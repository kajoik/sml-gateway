import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { ObisMappingService } from "./obis-mapping.service";
import { CreateObisMappingDto } from "./dto/create-obis-mapping.dto";
import { UpdateObisMappingDto } from "./dto/update-obis-mapping.dto";
import { FindObisMappingParams } from "./dto/find-obis-mapping.dto";
import { ObisMappingResponseDto } from "./dto/obis-mapping-response.dto";
import { plainToInstance } from "class-transformer";

@Controller("obis-mappings")
export class ObisMappingController {
  constructor(private readonly obisMappingService: ObisMappingService) {}

  /**
   * Create a new obis mapping
   *
   * @throws {400} Bad request
   * @throws {409} A value that should be unique already exists.
   */
  @Post()
  async create(
    @Body()
    createObisMappingDto: CreateObisMappingDto,
  ): Promise<ObisMappingResponseDto> {
    const entity = this.obisMappingService.create(createObisMappingDto);
    return plainToInstance(ObisMappingResponseDto, entity);
  }

  /**
   * Get all existing obis mappings.
   */
  @Get()
  async findAll(): Promise<ObisMappingResponseDto[]> {
    const entities = await this.obisMappingService.findAll();
    return plainToInstance(ObisMappingResponseDto, entities);
  }

  /**
   * Get an existing obis mapping.
   *
   * @throws {400} Bad request
   * @throws {404} Not found
   */
  @Get(":id")
  async findOne(
    @Param() id: FindObisMappingParams,
  ): Promise<ObisMappingResponseDto> {
    const entity = await this.obisMappingService.findOne(id.id);
    return plainToInstance(ObisMappingResponseDto, entity);
  }

  /**
   * Update an existing obis mapping.
   *
   * @throws {400} Bad request
   * @throws {409} A value that should be unique already exists.
   */
  @Patch(":id")
  async update(
    @Param()
    { id }: FindObisMappingParams,
    @Body() updateObisMappingDto: UpdateObisMappingDto,
  ): Promise<ObisMappingResponseDto> {
    const entity = await this.obisMappingService.update(
      id,
      updateObisMappingDto,
    );
    return plainToInstance(ObisMappingResponseDto, entity);
  }

  /**
   * Delete an existing obis mapping.
   *
   * @throws {400} Bad request
   * @throws {404} Not found
   */
  @HttpCode(204)
  @Delete(":id")
  remove(
    @Param()
    { id }: FindObisMappingParams,
  ): Promise<void> {
    return this.obisMappingService.remove(id);
  }
}
