

export enum DocumentType {
  AUDIENCE = 'audience',
  PRODUCT = 'product',
}

export enum DocumentStatus {
  NEW = 'new',
  APPLIED = 'applied',
  OUTDATED = 'outdated',
}

export enum InterviewStatus {
  NEW = 'new',
  APPLIED = 'applied',
  OUTDATED = 'outdated',
}

export enum VpcStatus {
  NEW = 'new',
  APPLIED = 'applied',
  OUTDATED = 'outdated',
}

export enum SectionStatus {
  NEW = 'new',
  APPLIED = 'applied',
  OUTDATED = 'outdated',
}



export interface VpcFields {
  jobs: string[];
  pains: string[];
  gains: string[];
  products: string[];
  painRelievers: string[];
  gainCreators: string[];
}

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  status: DocumentStatus;
  createdAt: Date;
}

export interface Vpc {
  id: string;
  name: string;
  status: VpcStatus;
  fields: VpcFields;
  audienceId: string;
}

export interface Audience {
  id: string;
  name: string;
  docIds: string[];
  interview: {
    status: InterviewStatus;
  };
  vpcs: Vpc[];
}

export interface Section {
  id: string;
  name: string;
  vpcIds: string[];
  status: SectionStatus;
  pageId: string;
}

export interface Page {
  id: string;
  name: string;
  audienceIds: string[];
  sections: Section[];
}



export interface CreateDocumentDto {
  name: string;
  type: DocumentType;
}

export interface CreateAudienceDto {
  name: string;
  docIds: string[];
}

export interface CreateVpcDto {
  name: string;
  fields: VpcFields;
}

export interface CreateSectionDto {
  name: string;
  vpcIds: string[];
}

export interface CreatePageDto {
  name: string;
  audienceIds: string[];
  sections: CreateSectionDto[];
}



export interface ImpactReport {
  document: Document;
  affectedAudiences: Audience[];
  affectedVpcs: Vpc[];
  affectedPages: Page[];
}
