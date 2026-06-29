import { InterviewStatus, VpcStatus, VpcFields } from '@kb/shared-types';

export class VpcEntity {
  readonly id: string;
  readonly name: string;
  readonly status: VpcStatus;
  readonly fields: VpcFields;
  readonly audienceId: string;

  constructor(props: {
    id: string;
    name: string;
    status: VpcStatus;
    fields: VpcFields;
    audienceId: string;
  }) {
    this.id = props.id;
    this.name = props.name;
    this.status = props.status;
    this.fields = props.fields;
    this.audienceId = props.audienceId;
  }
}

export class AudienceEntity {
  readonly id: string;
  readonly name: string;
  readonly interviewStatus: InterviewStatus;
  readonly docIds: string[];
  readonly vpcs: VpcEntity[];

  constructor(props: {
    id: string;
    name: string;
    interviewStatus: InterviewStatus;
    docIds: string[];
    vpcs: VpcEntity[];
  }) {
    this.id = props.id;
    this.name = props.name;
    this.interviewStatus = props.interviewStatus;
    this.docIds = props.docIds;
    this.vpcs = props.vpcs;
  }
}
