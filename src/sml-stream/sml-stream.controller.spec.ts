import { Test, TestingModule } from "@nestjs/testing";
import { SmlStreamController } from "./sml-stream.controller";

describe("SmlStreamController", () => {
  let controller: SmlStreamController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SmlStreamController],
    }).compile();

    controller = module.get<SmlStreamController>(SmlStreamController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
