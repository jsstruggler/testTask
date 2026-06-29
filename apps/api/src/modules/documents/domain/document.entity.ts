import { DocumentType, DocumentStatus } from '@kb/shared-types';

export class DocumentEntity {
  readonly id: string;
  readonly name: string;
  readonly type: DocumentType;
  readonly status: DocumentStatus;
  readonly createdAt: Date;

  constructor(props: {
    id: string;
    name: string;
    type: DocumentType;
    status: DocumentStatus;
    createdAt: Date;
  }) {
    this.id = props.id;
    this.name = props.name;
    this.type = props.type;
    this.status = props.status;
    this.createdAt = props.createdAt;
  }
}
