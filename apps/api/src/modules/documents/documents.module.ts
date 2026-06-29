import { Module, forwardRef } from '@nestjs/common';
import { DocumentsController } from './presentation/documents.controller';
import { DocumentsService } from './application/documents.service';
import { DocumentsRepository } from './infrastructure/documents.repository';
import { DOCUMENT_REPOSITORY } from './domain/document-repository.interface';
import { ImpactModule } from '../impact/impact.module';

@Module({
  imports: [forwardRef(() => ImpactModule)],
  controllers: [DocumentsController],
  providers: [
    DocumentsService,
    {
      provide: DOCUMENT_REPOSITORY,
      useClass: DocumentsRepository,
    },
  ],
  exports: [DocumentsService],
})
export class DocumentsModule {}
