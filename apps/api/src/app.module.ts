import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { AudiencesModule } from './modules/audiences/audiences.module';
import { PagesModule } from './modules/pages/pages.module';
import { ImpactModule } from './modules/impact/impact.module';

@Module({
  imports: [
    PrismaModule,
    DocumentsModule,
    AudiencesModule,
    PagesModule,
    ImpactModule,
  ],
})
export class AppModule {}
