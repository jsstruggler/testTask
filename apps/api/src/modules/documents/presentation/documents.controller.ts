import { Controller, Get, Post, Delete, Body, Param, Inject, forwardRef } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DocumentsService } from '../application/documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { ImpactService } from '../../impact/application/impact.service';

@ApiTags('Documents')
@Controller('documents')
export class DocumentsController {
  constructor(
    private readonly documentsService: DocumentsService,
    @Inject(forwardRef(() => ImpactService))
    private readonly impactService: ImpactService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all documents' })
  @ApiResponse({ status: 200, description: 'List of all documents' })
  async findAll() {
    return this.documentsService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new document' })
  @ApiResponse({ status: 201, description: 'Document created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async create(@Body() dto: CreateDocumentDto) {
    return this.documentsService.create(dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a document and return impact report' })
  @ApiResponse({ status: 200, description: 'Document deleted with impact report' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async delete(@Param('id') id: string) {
    const document = await this.documentsService.findById(id);
    const impactResult = await this.impactService.calculateImpact(document);
    

    await this.impactService.applyImpact(impactResult);
    

    await this.documentsService.delete(id);
    

    const report = this.impactService.toReport(impactResult);
    
    report.affectedAudiences.forEach(a => a.interview.status = 'outdated' as any);
    report.affectedVpcs.forEach(v => v.status = 'outdated' as any);
    
    const affectedVpcIds = new Set(report.affectedVpcs.map(v => v.id));
    report.affectedPages.forEach(p => {
      p.sections.forEach(s => {
        if (s.vpcIds.some(vid => affectedVpcIds.has(vid))) {
          s.status = 'outdated' as any;
        }
      });
    });

    return report;
  }
}
