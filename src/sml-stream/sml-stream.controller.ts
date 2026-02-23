import { Controller, Get, Header } from "@nestjs/common";
import { SmlStreamService } from "./sml-stream.service";

@Controller("sml-stream")
export class SmlStreamController {
  constructor(private readonly smlStreamService: SmlStreamService) {}

  @Get("/sample")
  @Header("Content-Type", "application/json")
  getSample(): string {
    return JSON.stringify(this.smlStreamService.getSample());
  }
}
