import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PagesService } from '../application/pages.service';
import { CreatePageDto } from './dto/create-page.dto';

@ApiTags('Pages')
@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all pages with sections' })
  @ApiResponse({ status: 200, description: 'List of pages with nested sections' })
  async findAll() {
    const pages = await this.pagesService.findAll();

    return pages.map((p) => ({
      id: p.id,
      name: p.name,
      audienceIds: p.audienceIds,
      sections: p.sections.map((s) => ({
        id: s.id,
        name: s.name,
        vpcIds: s.vpcIds,
        status: s.status,
      })),
    }));
  }

  @Post()
  @ApiOperation({ summary: 'Create a new page with sections' })
  @ApiResponse({ status: 201, description: 'Page created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async create(@Body() dto: CreatePageDto) {
    const page = await this.pagesService.create({
      name: dto.name,
      audienceIds: dto.audienceIds,
      sections: dto.sections,
    });

    return {
      id: page.id,
      name: page.name,
      audienceIds: page.audienceIds,
      sections: page.sections.map((s) => ({
        id: s.id,
        name: s.name,
        vpcIds: s.vpcIds,
        status: s.status,
      })),
    };
  }
}
