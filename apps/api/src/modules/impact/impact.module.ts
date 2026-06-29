import { Module, forwardRef } from '@nestjs/common';
import { ImpactController } from './presentation/impact.controller';
import { ImpactService } from './application/impact.service';
import { DocumentsModule } from '../documents/documents.module';
import { AudiencesModule } from '../audiences/audiences.module';
import { PagesModule } from '../pages/pages.module';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [forwardRef(() => DocumentsModule), AudiencesModule, PagesModule, PrismaModule],
  controllers: [ImpactController],
  providers: [ImpactService],
  exports: [ImpactService],
})
export class ImpactModule {}
