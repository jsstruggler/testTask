import { AudienceEntity } from './audience.entity';
import { VpcFields } from '@kb/shared-types';

export const AUDIENCE_REPOSITORY = Symbol('AUDIENCE_REPOSITORY');

export interface CreateAudienceData {
  name: string;
  docIds: string[];
  vpcs: {
    name: string;
    fields: VpcFields;
  }[];
}

export interface IAudienceRepository {
  findAll(): Promise<AudienceEntity[]>;
  findById(id: string): Promise<AudienceEntity | null>;
  findByDocumentId(documentId: string): Promise<AudienceEntity[]>;
  create(data: CreateAudienceData): Promise<AudienceEntity>;
  updateInterviewStatus(id: string, status: string): Promise<void>;
  updateVpcStatus(vpcId: string, status: string): Promise<void>;
}
