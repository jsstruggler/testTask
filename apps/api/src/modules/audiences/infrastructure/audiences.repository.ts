import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  IAudienceRepository,
  CreateAudienceData,
} from '../domain/audience-repository.interface';
import { AudienceEntity, VpcEntity } from '../domain/audience.entity';
import { InterviewStatus, VpcStatus, VpcFields } from '@kb/shared-types';

interface PrismaAudienceWithRelations {
  id: string;
  name: string;
  interviewStatus: string;
  documents: { documentId: string }[];
  vpcs: {
    id: string;
    name: string;
    status: string;
    fields: string;
    audienceId: string;
  }[];
}

@Injectable()
export class AudiencesRepository implements IAudienceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<AudienceEntity[]> {
    const audiences = await this.prisma.audience.findMany({
      include: {
        documents: true,
        vpcs: true,
      },
    });

    return audiences.map((a) => this.toEntity(a));
  }

  async findById(id: string): Promise<AudienceEntity | null> {
    const audience = await this.prisma.audience.findUnique({
      where: { id },
      include: {
        documents: true,
        vpcs: true,
      },
    });

    return audience ? this.toEntity(audience) : null;
  }

  async findByDocumentId(documentId: string): Promise<AudienceEntity[]> {
    const audiences = await this.prisma.audience.findMany({
      where: {
        documents: {
          some: { documentId },
        },
      },
      include: {
        documents: true,
        vpcs: true,
      },
    });

    return audiences.map((a) => this.toEntity(a));
  }

  async create(data: CreateAudienceData): Promise<AudienceEntity> {
    const audience = await this.prisma.audience.create({
      data: {
        name: data.name,
        interviewStatus: InterviewStatus.NEW,
        documents: {
          create: data.docIds.map((docId) => ({
            documentId: docId,
          })),
        },
        vpcs: {
          create: data.vpcs.map((vpc) => ({
            name: vpc.name,
            status: VpcStatus.NEW,
            fields: JSON.stringify(vpc.fields),
          })),
        },
      },
      include: {
        documents: true,
        vpcs: true,
      },
    });

    return this.toEntity(audience);
  }

  async updateInterviewStatus(id: string, status: string): Promise<void> {
    await this.prisma.audience.update({
      where: { id },
      data: { interviewStatus: status },
    });
  }

  async updateVpcStatus(vpcId: string, status: string): Promise<void> {
    await this.prisma.vpc.update({
      where: { id: vpcId },
      data: { status },
    });
  }

  private toEntity(a: PrismaAudienceWithRelations): AudienceEntity {
    return new AudienceEntity({
      id: a.id,
      name: a.name,
      interviewStatus: a.interviewStatus as InterviewStatus,
      docIds: a.documents.map((d) => d.documentId),
      vpcs: a.vpcs.map(
        (v) =>
          new VpcEntity({
            id: v.id,
            name: v.name,
            status: v.status as VpcStatus,
            fields: JSON.parse(v.fields) as VpcFields,
            audienceId: v.audienceId,
          }),
      ),
    });
  }
}
