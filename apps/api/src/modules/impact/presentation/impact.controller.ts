import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ImpactService } from '../application/impact.service';
import { DocumentsService } from '../../documents/application/documents.service';

@ApiTags('Impact')
@Controller('impact')
export class ImpactController {
  constructor(
    private readonly impactService: ImpactService,
    private readonly documentsService: DocumentsService,
  ) {}

  @Get(':docId')
  @ApiOperation({ summary: 'Get impact report for a document' })
  @ApiResponse({ status: 200, description: 'Impact report showing all affected entities' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async getImpact(@Param('docId') docId: string) {
    const document = await this.documentsService.findById(docId);
    const impact = await this.impactService.calculateImpact(document);
    return this.impactService.toReport(impact);
  }
}
