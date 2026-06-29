-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Audience" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "interviewStatus" TEXT NOT NULL DEFAULT 'new'
);

-- CreateTable
CREATE TABLE "AudienceDocument" (
    "audienceId" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,

    PRIMARY KEY ("audienceId", "documentId"),
    CONSTRAINT "AudienceDocument_audienceId_fkey" FOREIGN KEY ("audienceId") REFERENCES "Audience" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AudienceDocument_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Vpc" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "fields" TEXT NOT NULL DEFAULT '{}',
    "audienceId" TEXT NOT NULL,
    CONSTRAINT "Vpc_audienceId_fkey" FOREIGN KEY ("audienceId") REFERENCES "Audience" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Page" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "PageAudience" (
    "pageId" TEXT NOT NULL,
    "audienceId" TEXT NOT NULL,

    PRIMARY KEY ("pageId", "audienceId"),
    CONSTRAINT "PageAudience_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PageAudience_audienceId_fkey" FOREIGN KEY ("audienceId") REFERENCES "Audience" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Section" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "pageId" TEXT NOT NULL,
    CONSTRAINT "Section_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SectionVpc" (
    "sectionId" TEXT NOT NULL,
    "vpcId" TEXT NOT NULL,

    PRIMARY KEY ("sectionId", "vpcId"),
    CONSTRAINT "SectionVpc_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SectionVpc_vpcId_fkey" FOREIGN KEY ("vpcId") REFERENCES "Vpc" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Document_type_idx" ON "Document"("type");

-- CreateIndex
CREATE INDEX "Document_status_idx" ON "Document"("status");

-- CreateIndex
CREATE INDEX "AudienceDocument_documentId_idx" ON "AudienceDocument"("documentId");

-- CreateIndex
CREATE INDEX "Vpc_audienceId_idx" ON "Vpc"("audienceId");

-- CreateIndex
CREATE INDEX "Vpc_status_idx" ON "Vpc"("status");

-- CreateIndex
CREATE INDEX "PageAudience_audienceId_idx" ON "PageAudience"("audienceId");

-- CreateIndex
CREATE INDEX "Section_pageId_idx" ON "Section"("pageId");

-- CreateIndex
CREATE INDEX "Section_status_idx" ON "Section"("status");

-- CreateIndex
CREATE INDEX "SectionVpc_vpcId_idx" ON "SectionVpc"("vpcId");
