export type SelectedNode = {
  type: 'document' | 'audience' | 'page';
  id: string;
};

export interface DocumentType {
  id: string;
  name: string;
  type: string;
  status?: string;
}

export interface VpcField {
  jobs?: string[];
  pains?: string[];
  gains?: string[];
  products?: string[];
  painRelievers?: string[];
  gainCreators?: string[];
}

export interface VpcType {
  id: string;
  name: string;
  status?: string;
  fields?: VpcField;
}

export interface AudienceType {
  id: string;
  name: string;
  docIds?: string[];
  interview?: { status?: string };
  vpcs?: VpcType[];
}

export interface SectionType {
  id: string;
  name: string;
  status?: string;
}

export interface PageType {
  id: string;
  name: string;
  audienceIds?: string[];
  sections?: SectionType[];
}

export interface DocumentFormValues {
  name: string;
  type: 'audience' | 'product';
}

export interface AudienceFormValues {
  name: string;
  docIds: string[];
  vpcs: {
    name: string;
    fields?: {
      jobs?: string;
      pains?: string;
      gains?: string;
      products?: string;
      painRelievers?: string;
      gainCreators?: string;
    };
  }[];
}

export interface PageFormValues {
  name: string;
  audienceIds: string[];
  sections?: {
    name: string;
    vpcIds: string[];
  }[];
}
