import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  AUDIENCE_REPOSITORY,
  IAudienceRepository,
  CreateAudienceData,
} from '../domain/audience-repository.interface';
import { AudienceEntity } from '../domain/audience.entity';

@Injectable()
export class AudiencesService {
  constructor(
    @Inject(AUDIENCE_REPOSITORY)
    private readonly audienceRepository: IAudienceRepository,
  ) {}

  async findAll(): Promise<AudienceEntity[]> {
    return this.audienceRepository.findAll();
  }

  async findById(id: string): Promise<AudienceEntity> {
    const audience = await this.audienceRepository.findById(id);
    if (!audience) {
      throw new NotFoundException(`Audience with id "${id}" not found`);
    }
    return audience;
  }

  async findByDocumentId(documentId: string): Promise<AudienceEntity[]> {
    return this.audienceRepository.findByDocumentId(documentId);
  }

  async create(data: CreateAudienceData): Promise<AudienceEntity> {
    return this.audienceRepository.create(data);
  }
}
