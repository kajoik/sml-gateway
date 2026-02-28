import { Test, TestingModule } from "@nestjs/testing";
import { ObisMappingService } from "./obis-mapping.service";

describe("ObisMappingService", () => {
  let service: ObisMappingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ObisMappingService],
    }).compile();

    service = module.get<ObisMappingService>(ObisMappingService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
