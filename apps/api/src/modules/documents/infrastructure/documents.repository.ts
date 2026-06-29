import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { IDocumentRepository } from '../domain/document-repository.interface';
import { DocumentEntity } from '../domain/document.entity';
import { DocumentType, DocumentStatus } from '@kb/shared-types';

@Injectable()
export class DocumentsRepository implements IDocumentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<DocumentEntity[]> {
    const documents = await this.prisma.document.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return documents.map((doc) => this.toEntity(doc));
  }

  async findById(id: string): Promise<DocumentEntity | null> {
    const document = await this.prisma.document.findUnique({
      where: { id },
    });

    return document ? this.toEntity(document) : null;
  }

  async findByType(type: DocumentType): Promise<DocumentEntity[]> {
    const documents = await this.prisma.document.findMany({
      where: { type },
      orderBy: { createdAt: 'desc' },
    });

    return documents.map((doc) => this.toEntity(doc));
  }

  async create(data: { name: string; type: DocumentType }): Promise<DocumentEntity> {
    const document = await this.prisma.document.create({
      data: {
        name: data.name,
        type: data.type,
        status: DocumentStatus.NEW,
      },
    });

    return this.toEntity(document);
  }

  async updateStatus(id: string, status: string): Promise<DocumentEntity> {
    const document = await this.prisma.document.update({
      where: { id },
      data: { status },
    });

    return this.toEntity(document);
  }

  async delete(id: string): Promise<DocumentEntity> {
    const document = await this.prisma.document.delete({
      where: { id },
    });

    return this.toEntity(document);
  }

  private toEntity(doc: {
    id: string;
    name: string;
    type: string;
    status: string;
    createdAt: Date;
  }): DocumentEntity {
    return new DocumentEntity({
      id: doc.id,
      name: doc.name,
      type: doc.type as DocumentType,
      status: doc.status as DocumentStatus,
      createdAt: doc.createdAt,
    });
  }
}
