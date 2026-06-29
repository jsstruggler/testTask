import { Module } from '@nestjs/common';
import { PagesController } from './presentation/pages.controller';
import { PagesService } from './application/pages.service';
import { PagesRepository } from './infrastructure/pages.repository';
import { PAGE_REPOSITORY } from './domain/page-repository.interface';

@Module({
  controllers: [PagesController],
  providers: [
    PagesService,
    {
      provide: PAGE_REPOSITORY,
      useClass: PagesRepository,
    },
  ],
  exports: [PagesService],
})
export class PagesModule {}
