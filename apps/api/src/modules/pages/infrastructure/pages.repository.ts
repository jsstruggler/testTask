import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  IPageRepository,
  CreatePageData,
} from '../domain/page-repository.interface';
import { PageEntity, SectionEntity } from '../domain/page.entity';
import { SectionStatus } from '@kb/shared-types';

interface PrismaPageWithRelations {
  id: string;
  name: string;
  audiences: { audienceId: string }[];
  sections: {
    id: string;
    name: string;
    status: string;
    pageId: string;
    vpcs: { vpcId: string }[];
  }[];
}

@Injectable()
export class PagesRepository implements IPageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<PageEntity[]> {
    const pages = await this.prisma.page.findMany({
      include: {
        audiences: true,
        sections: {
          include: { vpcs: true },
        },
      },
    });

    return pages.map((p) => this.toEntity(p));
  }

  async findById(id: string): Promise<PageEntity | null> {
    const page = await this.prisma.page.findUnique({
      where: { id },
      include: {
        audiences: true,
        sections: {
          include: { vpcs: true },
        },
      },
    });

    return page ? this.toEntity(page) : null;
  }

  async findByAudienceIds(audienceIds: string[]): Promise<PageEntity[]> {
    const pages = await this.prisma.page.findMany({
      where: {
        audiences: {
          some: {
            audienceId: { in: audienceIds },
          },
        },
      },
      include: {
        audiences: true,
        sections: {
          include: { vpcs: true },
        },
      },
    });

    return pages.map((p) => this.toEntity(p));
  }

  async create(data: CreatePageData): Promise<PageEntity> {
    const page = await this.prisma.page.create({
      data: {
        name: data.name,
        audiences: {
          create: data.audienceIds.map((audienceId) => ({
            audienceId,
          })),
        },
        sections: {
          create: data.sections.map((section) => ({
            name: section.name,
            status: SectionStatus.NEW,
            vpcs: {
              create: section.vpcIds.map((vpcId) => ({
                vpcId,
              })),
            },
          })),
        },
      },
      include: {
        audiences: true,
        sections: {
          include: { vpcs: true },
        },
      },
    });

    return this.toEntity(page);
  }

  async updateSectionStatus(sectionId: string, status: string): Promise<void> {
    await this.prisma.section.update({
      where: { id: sectionId },
      data: { status },
    });
  }

  private toEntity(p: PrismaPageWithRelations): PageEntity {
    return new PageEntity({
      id: p.id,
      name: p.name,
      audienceIds: p.audiences.map((a) => a.audienceId),
      sections: p.sections.map(
        (s) =>
          new SectionEntity({
            id: s.id,
            name: s.name,
            status: s.status as SectionStatus,
            pageId: s.pageId,
            vpcIds: s.vpcs.map((v) => v.vpcId),
          }),
      ),
    });
  }
}
