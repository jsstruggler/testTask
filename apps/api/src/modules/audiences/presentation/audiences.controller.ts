import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AudiencesService } from '../application/audiences.service';
import { CreateAudienceDto } from './dto/create-audience.dto';

@ApiTags('Audiences')
@Controller('audiences')
export class AudiencesController {
  constructor(private readonly audiencesService: AudiencesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all audiences with VPCs' })
  @ApiResponse({ status: 200, description: 'List of audiences with nested VPCs' })
  async findAll() {
    const audiences = await this.audiencesService.findAll();

    return audiences.map((a) => ({
      id: a.id,
      name: a.name,
      docIds: a.docIds,
      interview: { status: a.interviewStatus },
      vpcs: a.vpcs.map((v) => ({
        id: v.id,
        name: v.name,
        status: v.status,
        fields: v.fields,
      })),
    }));
  }

  @Post()
  @ApiOperation({ summary: 'Create a new audience' })
  @ApiResponse({ status: 201, description: 'Audience created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async create(@Body() dto: CreateAudienceDto) {
    const audience = await this.audiencesService.create({
      name: dto.name,
      docIds: dto.docIds,
      vpcs: dto.vpcs ?? [],
    });

    return {
      id: audience.id,
      name: audience.name,
      docIds: audience.docIds,
      interview: { status: audience.interviewStatus },
      vpcs: audience.vpcs.map((v) => ({
        id: v.id,
        name: v.name,
        status: v.status,
        fields: v.fields,
      })),
    };
  }
}
