import { Module } from '@nestjs/common';
import { AudiencesController } from './presentation/audiences.controller';
import { AudiencesService } from './application/audiences.service';
import { AudiencesRepository } from './infrastructure/audiences.repository';
import { AUDIENCE_REPOSITORY } from './domain/audience-repository.interface';

@Module({
  controllers: [AudiencesController],
  providers: [
    AudiencesService,
    {
      provide: AUDIENCE_REPOSITORY,
      useClass: AudiencesRepository,
    },
  ],
  exports: [AudiencesService],
})
export class AudiencesModule {}
