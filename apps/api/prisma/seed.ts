import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {

  await prisma.sectionVpc.deleteMany();
  await prisma.pageAudience.deleteMany();
  await prisma.audienceDocument.deleteMany();
  await prisma.section.deleteMany();
  await prisma.vpc.deleteMany();
  await prisma.page.deleteMany();
  await prisma.audience.deleteMany();
  await prisma.document.deleteMany();

  console.warn('🧹 Cleaned existing data');



  const doc1 = await prisma.document.create({
    data: {
      id: 'doc-1',
      name: 'Customer Interview: Startup Founders',
      type: 'audience',
      status: 'applied',
    },
  });

  const doc2 = await prisma.document.create({
    data: {
      id: 'doc-2',
      name: 'Customer Interview: Enterprise CTOs',
      type: 'audience',
      status: 'applied',
    },
  });

  const doc3 = await prisma.document.create({
    data: {
      id: 'doc-3',
      name: 'Product Requirements: Analytics Dashboard',
      type: 'product',
      status: 'new',
    },
  });

  const doc4 = await prisma.document.create({
    data: {
      id: 'doc-4',
      name: 'Market Research: SaaS Trends 2025',
      type: 'audience',
      status: 'applied',
    },
  });

  console.warn(`📄 Created ${4} documents`);



  const audience1 = await prisma.audience.create({
    data: {
      id: 'aud-1',
      name: 'Startup Founders',
      interviewStatus: 'applied',
    },
  });

  const audience2 = await prisma.audience.create({
    data: {
      id: 'aud-2',
      name: 'Enterprise CTOs',
      interviewStatus: 'applied',
    },
  });

  const audience3 = await prisma.audience.create({
    data: {
      id: 'aud-3',
      name: 'Product Managers',
      interviewStatus: 'new',
    },
  });

  console.warn(`👥 Created ${3} audiences`);


  await prisma.audienceDocument.createMany({
    data: [
      { audienceId: audience1.id, documentId: doc1.id },
      { audienceId: audience1.id, documentId: doc4.id },
      { audienceId: audience2.id, documentId: doc2.id },
      { audienceId: audience2.id, documentId: doc4.id },
      { audienceId: audience3.id, documentId: doc3.id },
    ],
  });

  console.warn('🔗 Linked audiences to documents');



  const vpc1 = await prisma.vpc.create({
    data: {
      id: 'vpc-1',
      name: 'Startup Founders - Growth',
      status: 'applied',
      audienceId: audience1.id,
      fields: JSON.stringify({
        jobs: ['Scale product quickly', 'Find product-market fit'],
        pains: ['Limited budget', 'Small team'],
        gains: ['Rapid user growth', 'Investor confidence'],
        products: ['Analytics Dashboard'],
        painRelievers: ['Affordable pricing', 'Easy onboarding'],
        gainCreators: ['Real-time metrics', 'Growth insights'],
      }),
    },
  });

  const vpc2 = await prisma.vpc.create({
    data: {
      id: 'vpc-2',
      name: 'Enterprise CTOs - Security',
      status: 'applied',
      audienceId: audience2.id,
      fields: JSON.stringify({
        jobs: ['Ensure data security', 'Manage compliance'],
        pains: ['Complex regulations', 'Legacy systems'],
        gains: ['Audit readiness', 'Risk reduction'],
        products: ['Security Module'],
        painRelievers: ['Automated compliance checks'],
        gainCreators: ['SOC2 certification support'],
      }),
    },
  });

  const vpc3 = await prisma.vpc.create({
    data: {
      id: 'vpc-3',
      name: 'Startup Founders - Collaboration',
      status: 'new',
      audienceId: audience1.id,
      fields: JSON.stringify({
        jobs: ['Collaborate with team', 'Share insights'],
        pains: ['Tool fragmentation', 'Context switching'],
        gains: ['Single source of truth', 'Faster decisions'],
        products: ['Collaboration Suite'],
        painRelievers: ['Unified workspace'],
        gainCreators: ['Real-time collaboration'],
      }),
    },
  });

  console.warn(`🎯 Created ${3} VPCs`);



  const page1 = await prisma.page.create({
    data: {
      id: 'page-1',
      name: 'Landing Page',
    },
  });

  const page2 = await prisma.page.create({
    data: {
      id: 'page-2',
      name: 'Pricing Page',
    },
  });

  console.warn(`📃 Created ${2} pages`);



  await prisma.pageAudience.createMany({
    data: [
      { pageId: page1.id, audienceId: audience1.id },
      { pageId: page1.id, audienceId: audience2.id },
      { pageId: page2.id, audienceId: audience1.id },
    ],
  });

  console.warn('🔗 Linked pages to audiences');


  const section1 = await prisma.section.create({
    data: {
      id: 'sec-1',
      name: 'Hero Section',
      status: 'applied',
      pageId: page1.id,
    },
  });

  const section2 = await prisma.section.create({
    data: {
      id: 'sec-2',
      name: 'Features Section',
      status: 'applied',
      pageId: page1.id,
    },
  });

  const section3 = await prisma.section.create({
    data: {
      id: 'sec-3',
      name: 'Pricing Tiers',
      status: 'new',
      pageId: page2.id,
    },
  });

  console.warn(`📑 Created ${3} sections`);


  await prisma.sectionVpc.createMany({
    data: [
      { sectionId: section1.id, vpcId: vpc1.id },
      { sectionId: section1.id, vpcId: vpc2.id },
      { sectionId: section2.id, vpcId: vpc3.id },
      { sectionId: section3.id, vpcId: vpc1.id },
    ],
  });

  console.warn('🔗 Linked sections to VPCs');


  console.warn('\n✅ Seed completed successfully!');
  console.warn('─────────────────────────────────');
  console.warn(`  Documents:  4`);
  console.warn(`  Audiences:  3`);
  console.warn(`  VPCs:       3`);
  console.warn(`  Pages:      2`);
  console.warn(`  Sections:   3`);
  console.warn('─────────────────────────────────');
  console.warn('\nRelation graph:');
  console.warn('  doc-1 (Startup Founders Interview) → aud-1 (Startup Founders)');
  console.warn('  doc-2 (Enterprise CTOs Interview)   → aud-2 (Enterprise CTOs)');
  console.warn('  doc-4 (SaaS Trends)                 → aud-1, aud-2');
  console.warn('  doc-3 (Product Requirements)         → aud-3 (Product Managers)');
  console.warn('  aud-1 → vpc-1 (Growth), vpc-3 (Collaboration)');
  console.warn('  aud-2 → vpc-2 (Security)');
  console.warn('  page-1 (Landing) → aud-1, aud-2');
  console.warn('  page-2 (Pricing) → aud-1');
  console.warn('  sec-1 (Hero)     → vpc-1, vpc-2');
  console.warn('  sec-2 (Features) → vpc-3');
  console.warn('  sec-3 (Pricing)  → vpc-1');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
