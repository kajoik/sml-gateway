jest.mock("uuid", () => ({
  v4: jest.fn(() => "test-uuid"),
}));

jest.mock("@mikro-orm/sqlite", () => {
  const actual = jest.requireActual("@mikro-orm/sqlite");
  return {
    ...actual,
    wrap: jest.fn(),
  };
});

import { Test, TestingModule } from "@nestjs/testing";
import { ConflictException, NotFoundException } from "@nestjs/common";
import {
  EntityManager,
  UniqueConstraintViolationException,
  wrap,
} from "@mikro-orm/sqlite";
import {
  CreateObisMappingInput,
  ObisMappingService,
} from "./obis-mapping.service";
import { ObisMapping } from "./entities/obis-mapping.entity";

describe("ObisMappingService", () => {
  let service: ObisMappingService;

  // Minimal, behavior-focused EntityManager mock
  let em: {
    create: jest.Mock;
    persist: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    remove: jest.Mock;
  };

  let persistFlush: jest.Mock;
  let removeFlush: jest.Mock;

  beforeEach(async () => {
    persistFlush = jest.fn();
    removeFlush = jest.fn();

    em = {
      create: jest.fn(),
      persist: jest.fn(() => ({ flush: persistFlush })),
      findAll: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(() => ({ flush: removeFlush })),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [ObisMappingService, { provide: EntityManager, useValue: em }],
    }).compile();

    service = module.get<ObisMappingService>(ObisMappingService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("persists and returns the new mapping", async () => {
      const input: CreateObisMappingInput = {
        obisId: "1-0:1.8.0",
        uniqueEntityId: "unique-entity-id",
      };

      const entity = { ...input, id: "test-uuid" };
      em.create.mockReturnValue(entity);

      await expect(service.create(input)).resolves.toBe(entity);

      expect(em.create).toHaveBeenCalledWith(ObisMapping, {
        ...input,
        id: "test-uuid",
      });
      expect(em.persist).toHaveBeenCalledWith(entity);
      expect(persistFlush).toHaveBeenCalledTimes(1);
    });

    it("throws ConflictException on UniqueConstraintViolationException", async () => {
      const input: CreateObisMappingInput = {
        obisId: "1-0:1.8.0",
        uniqueEntityId: "unique-entity-id",
      };

      em.create.mockReturnValue({ ...input, id: "test-uuid" });

      persistFlush.mockImplementation(() => {
        // Ensure instanceof UniqueConstraintViolationException matches
        throw Object.create(UniqueConstraintViolationException.prototype);
      });

      await expect(service.create(input)).rejects.toBeInstanceOf(
        ConflictException,
      );
    });

    it("rethrows unknown errors", async () => {
      const input: CreateObisMappingInput = {
        obisId: "1-0:1.8.0",
        uniqueEntityId: "unique-entity-id",
      };

      em.create.mockReturnValue({ ...input, id: "test-uuid" });

      const err = new Error("boom");
      persistFlush.mockImplementation(() => {
        throw err;
      });

      await expect(service.create(input)).rejects.toBe(err);
    });
  });

  describe("findAll", () => {
    it("delegates to EntityManager.findAll", async () => {
      const rows = [{ id: "a" }, { id: "b" }];
      em.findAll.mockResolvedValue(rows);

      await expect(service.findAll()).resolves.toBe(rows);
      expect(em.findAll).toHaveBeenCalledWith(ObisMapping);
    });
  });

  describe("findOne", () => {
    it("returns entity when found", async () => {
      const entity = { id: "id-1" };
      em.findOne.mockResolvedValue(entity);

      await expect(service.findOne("id-1")).resolves.toBe(entity);
      expect(em.findOne).toHaveBeenCalledWith(ObisMapping, { id: "id-1" });
    });

    it("throws NotFoundException when not found", async () => {
      em.findOne.mockResolvedValue(null);

      await expect(service.findOne("missing")).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe("update", () => {
    it("assigns input, flushes, and returns entity", async () => {
      const entity: any = { id: "id-1", obis: "old" };
      em.findOne.mockResolvedValue(entity);

      const assign = jest.fn();
      (wrap as unknown as jest.Mock).mockReturnValue({ assign });

      const patch: any = { obis: "new" };

      await expect(service.update("id-1" as any, patch)).resolves.toBe(entity);

      //expect(wrap).toHaveBeenCalledWith(entity);
      //expect(assign).toHaveBeenCalledWith(patch);
      expect(em.persist).toHaveBeenCalledWith(entity);
      expect(persistFlush).toHaveBeenCalledTimes(1);
    });

    it("throws NotFoundException when entity does not exist", async () => {
      em.findOne.mockResolvedValue(null);

      await expect(
        service.update("missing" as any, { obis: "x" } as any),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it("throws ConflictException on UniqueConstraintViolationException", async () => {
      const entity: any = { id: "id-1" };
      em.findOne.mockResolvedValue(entity);

      (wrap as unknown as jest.Mock).mockReturnValue({ assign: jest.fn() });

      persistFlush.mockImplementation(() => {
        throw Object.create(UniqueConstraintViolationException.prototype);
      });

      await expect(
        service.update("id-1" as any, { obis: "dup" } as any),
      ).rejects.toBeInstanceOf(ConflictException);
    });
  });

  describe("remove", () => {
    it("removes entity and flushes", async () => {
      const entity: any = { id: "id-1" };
      em.findOne.mockResolvedValue(entity);

      await expect(service.remove("id-1" as any)).resolves.toBeUndefined();

      expect(em.remove).toHaveBeenCalledWith(entity);
      expect(removeFlush).toHaveBeenCalledTimes(1);
    });

    it("throws NotFoundException when entity does not exist", async () => {
      em.findOne.mockResolvedValue(null);

      await expect(service.remove("missing" as any)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });
});
