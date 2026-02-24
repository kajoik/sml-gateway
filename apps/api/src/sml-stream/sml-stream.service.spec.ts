import { Test, TestingModule } from "@nestjs/testing";
import { SmlStreamService } from "./sml-stream.service";

describe("SmlStreamService", () => {
  let service: SmlStreamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SmlStreamService],
    }).compile();

    service = module.get<SmlStreamService>(SmlStreamService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
