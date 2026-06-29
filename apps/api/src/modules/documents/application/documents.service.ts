import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  DOCUMENT_REPOSITORY,
  IDocumentRepository,
} from '../domain/document-repository.interface';
import { DocumentEntity } from '../domain/document.entity';
import { DocumentType } from '@kb/shared-types';

@Injectable()
export class DocumentsService {
  constructor(
    @Inject(DOCUMENT_REPOSITORY)
    private readonly documentRepository: IDocumentRepository,
  ) {}

  async findAll(): Promise<DocumentEntity[]> {
    return this.documentRepository.findAll();
  }

  async findById(id: string): Promise<DocumentEntity> {
    const document = await this.documentRepository.findById(id);
    if (!document) {
      throw new NotFoundException(`Document with id "${id}" not found`);
    }
    return document;
  }

  async create(data: { name: string; type: DocumentType }): Promise<DocumentEntity> {
    return this.documentRepository.create(data);
  }

  async delete(id: string): Promise<DocumentEntity> {
    await this.findById(id);
    return this.documentRepository.delete(id);
  }
}
