import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  PAGE_REPOSITORY,
  IPageRepository,
  CreatePageData,
} from '../domain/page-repository.interface';
import { PageEntity } from '../domain/page.entity';

@Injectable()
export class PagesService {
  constructor(
    @Inject(PAGE_REPOSITORY)
    private readonly pageRepository: IPageRepository,
  ) {}

  async findAll(): Promise<PageEntity[]> {
    return this.pageRepository.findAll();
  }

  async findById(id: string): Promise<PageEntity> {
    const page = await this.pageRepository.findById(id);
    if (!page) {
      throw new NotFoundException(`Page with id "${id}" not found`);
    }
    return page;
  }

  async findByAudienceIds(audienceIds: string[]): Promise<PageEntity[]> {
    return this.pageRepository.findByAudienceIds(audienceIds);
  }

  async create(data: CreatePageData): Promise<PageEntity> {
    return this.pageRepository.create(data);
  }
}
