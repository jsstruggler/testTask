import { DocumentEntity } from './document.entity';
import { DocumentType } from '@kb/shared-types';

export const DOCUMENT_REPOSITORY = Symbol('DOCUMENT_REPOSITORY');

export interface IDocumentRepository {
  findAll(): Promise<DocumentEntity[]>;
  findById(id: string): Promise<DocumentEntity | null>;
  findByType(type: DocumentType): Promise<DocumentEntity[]>;
  create(data: { name: string; type: DocumentType }): Promise<DocumentEntity>;
  updateStatus(id: string, status: string): Promise<DocumentEntity>;
  delete(id: string): Promise<DocumentEntity>;
}
