import { Test, TestingModule } from "@nestjs/testing";
import { SmlStreamGateway } from "./sml-stream.gateway";

describe("SmlStreamGateway", () => {
  let gateway: SmlStreamGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SmlStreamGateway],
    }).compile();

    gateway = module.get<SmlStreamGateway>(SmlStreamGateway);
  });

  it("should be defined", () => {
    expect(gateway).toBeDefined();
  });
});
