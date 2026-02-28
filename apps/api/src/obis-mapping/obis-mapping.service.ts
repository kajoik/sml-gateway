import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  EntityManager,
  UniqueConstraintViolationException,
  wrap,
} from "@mikro-orm/sqlite";
import { ObisMapping, IObisMapping } from "./entities/obis-mapping.entity";
import { v4 as uuid } from "uuid";

interface CreateObisMappingInput extends Omit<
  IObisMapping,
  "id" | "createdAt" | "updatedAt" | "version"
> {}

interface UpdateObisMappingInput extends Partial<CreateObisMappingInput> {}

@Injectable()
export class ObisMappingService {
  constructor(private readonly em: EntityManager) {}

  async create(input: CreateObisMappingInput): Promise<IObisMapping> {
    const newObisMapping = this.em.create(ObisMapping, {
      ...input,
      id: uuid(),
    });
    try {
      await this.em.persist(newObisMapping).flush();
    } catch (e) {
      if (e instanceof UniqueConstraintViolationException) {
        throw new ConflictException();
      }
      throw e;
    }
    return newObisMapping;
  }

  findAll(): Promise<IObisMapping[]> {
    return this.em.findAll(ObisMapping);
  }

  async findOne(id: IObisMapping["id"]): Promise<IObisMapping> {
    const entity = await this.em.findOne(ObisMapping, { id });
    if (!entity) {
      throw new NotFoundException(`ObisMapping with id "${id}" not found`);
    }
    return entity;
  }

  async update(
    id: IObisMapping["id"],
    input: UpdateObisMappingInput,
  ): Promise<IObisMapping> {
    const entity = await this.findOne(id);
    wrap(entity).assign(input, { ignoreUndefined: true });
    try {
      await this.em.persist(entity).flush();
    } catch (e) {
      if (e instanceof UniqueConstraintViolationException) {
        throw new ConflictException();
      }
      throw e;
    }
    return entity;
  }

  async remove(id: IObisMapping["id"]): Promise<void> {
    const entity = await this.findOne(id);
    await this.em.remove(entity).flush();
    return;
  }
}
