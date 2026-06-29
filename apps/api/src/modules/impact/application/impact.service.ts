import { Injectable } from '@nestjs/common';
import { AudiencesService } from '../../audiences/application/audiences.service';
import { PagesService } from '../../pages/application/pages.service';
import { DocumentEntity } from '../../documents/domain/document.entity';
import { AudienceEntity, VpcEntity } from '../../audiences/domain/audience.entity';
import { PageEntity } from '../../pages/domain/page.entity';
import { PrismaService } from '../../../prisma/prisma.service';
import { ImpactReport } from '@kb/shared-types';

export interface ImpactResult {
  document: DocumentEntity;
  affectedAudiences: AudienceEntity[];
  affectedVpcs: VpcEntity[];
  affectedPages: PageEntity[];
}

@Injectable()
export class ImpactService {
  constructor(
    private readonly audiencesService: AudiencesService,
    private readonly pagesService: PagesService,
    private readonly prisma: PrismaService,
  ) {}

  async calculateImpact(document: DocumentEntity): Promise<ImpactResult> {
    // 1. Find all audiences linked to this document
    const affectedAudiences = await this.audiencesService.findByDocumentId(document.id);

    // 2. Collect all VPCs from affected audiences
    const affectedVpcs = affectedAudiences.flatMap((a) => a.vpcs);

    // 3. Find all pages linked to affected audiences
    const audienceIds = affectedAudiences.map((a) => a.id);
    const affectedPages =
      audienceIds.length > 0
        ? await this.pagesService.findByAudienceIds(audienceIds)
        : [];

    return {
      document,
      affectedAudiences,
      affectedVpcs,
      affectedPages,
    };
  }

  async applyImpact(result: ImpactResult): Promise<void> {
    const audienceIds = result.affectedAudiences.map((a) => a.id);
    const vpcIds = result.affectedVpcs.map((v) => v.id);

    if (audienceIds.length > 0) {
      await this.prisma.audience.updateMany({
        where: { id: { in: audienceIds } },
        data: { interviewStatus: 'outdated' },
      });
    }

    if (vpcIds.length > 0) {
      await this.prisma.vpc.updateMany({
        where: { id: { in: vpcIds } },
        data: { status: 'outdated' },
      });

      await this.prisma.section.updateMany({
        where: { vpcs: { some: { vpcId: { in: vpcIds } } } },
        data: { status: 'outdated' },
      });
    }
  }

  toReport(result: ImpactResult): ImpactReport {
    return {
      document: {
        id: result.document.id,
        name: result.document.name,
        type: result.document.type,
        status: result.document.status,
        createdAt: result.document.createdAt,
      },
      affectedAudiences: result.affectedAudiences.map((a) => ({
        id: a.id,
        name: a.name,
        docIds: a.docIds,
        interview: { status: a.interviewStatus },
        vpcs: a.vpcs.map((v) => ({
          id: v.id,
          name: v.name,
          status: v.status,
          fields: v.fields,
          audienceId: v.audienceId,
        })),
      })),
      affectedVpcs: result.affectedVpcs.map((v) => ({
        id: v.id,
        name: v.name,
        status: v.status,
        fields: v.fields,
        audienceId: v.audienceId,
      })),
      affectedPages: result.affectedPages.map((p) => ({
        id: p.id,
        name: p.name,
        audienceIds: p.audienceIds,
        sections: p.sections.map((s) => ({
          id: s.id,
          name: s.name,
          vpcIds: s.vpcIds,
          status: s.status,
          pageId: s.pageId,
        })),
      })),
    };
  }
}
