import { PageEntity } from './page.entity';

export const PAGE_REPOSITORY = Symbol('PAGE_REPOSITORY');

export interface CreateSectionData {
  name: string;
  vpcIds: string[];
}

export interface CreatePageData {
  name: string;
  audienceIds: string[];
  sections: CreateSectionData[];
}

export interface IPageRepository {
  findAll(): Promise<PageEntity[]>;
  findById(id: string): Promise<PageEntity | null>;
  findByAudienceIds(audienceIds: string[]): Promise<PageEntity[]>;
  create(data: CreatePageData): Promise<PageEntity>;
  updateSectionStatus(sectionId: string, status: string): Promise<void>;
}
