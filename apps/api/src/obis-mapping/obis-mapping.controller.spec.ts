import { Test, TestingModule } from "@nestjs/testing";
import { ObisMappingController } from "./obis-mapping.controller";
import { ObisMappingService } from "./obis-mapping.service";

describe("ObisMappingController", () => {
  let controller: ObisMappingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ObisMappingController],
      providers: [ObisMappingService],
    }).compile();

    controller = module.get<ObisMappingController>(ObisMappingController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
