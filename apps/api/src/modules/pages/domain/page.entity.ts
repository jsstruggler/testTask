import { SectionStatus } from '@kb/shared-types';

export class SectionEntity {
  readonly id: string;
  readonly name: string;
  readonly status: SectionStatus;
  readonly pageId: string;
  readonly vpcIds: string[];

  constructor(props: {
    id: string;
    name: string;
    status: SectionStatus;
    pageId: string;
    vpcIds: string[];
  }) {
    this.id = props.id;
    this.name = props.name;
    this.status = props.status;
    this.pageId = props.pageId;
    this.vpcIds = props.vpcIds;
  }
}

export class PageEntity {
  readonly id: string;
  readonly name: string;
  readonly audienceIds: string[];
  readonly sections: SectionEntity[];

  constructor(props: {
    id: string;
    name: string;
    audienceIds: string[];
    sections: SectionEntity[];
  }) {
    this.id = props.id;
    this.name = props.name;
    this.audienceIds = props.audienceIds;
    this.sections = props.sections;
  }
}
