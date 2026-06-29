'use client';

import { useState, useMemo } from 'react';
import { Spin } from 'antd';
import { DocumentColumn } from './components/DocumentColumn';
import { AudienceColumn } from './components/AudienceColumn';
import { PageColumn } from './components/PageColumn';
import { SelectedNode } from './types';
import { useGetDocumentsQuery, useGetAudiencesQuery, useGetPagesQuery } from '@/store/api';
import styles from './ImpactTrailDashboard.module.scss';

export const ImpactTrailDashboard = () => {
  const { data: documents = [], isLoading: isLoadingDocs } = useGetDocumentsQuery();
  const { data: audiences = [], isLoading: isLoadingAuds } = useGetAudiencesQuery();
  const { data: pages = [], isLoading: isLoadingPages } = useGetPagesQuery();

  const [selectedNode, setSelectedNode] = useState<SelectedNode | null>(null);

  const { highlightedDocs, highlightedAudiences, highlightedPages } = useMemo(() => {
    const docs = new Set<string>();
    const auds = new Set<string>();
    const pgs = new Set<string>();

    if (!selectedNode) {
      return { highlightedDocs: docs, highlightedAudiences: auds, highlightedPages: pgs };
    }

    if (selectedNode.type === 'document') {
      docs.add(selectedNode.id);
      audiences.forEach(a => {
        if (a.docIds?.includes(selectedNode.id)) {
          auds.add(a.id);
        }
      });
      pages.forEach(p => {
        if (p.audienceIds?.some(aid => auds.has(aid))) {
          pgs.add(p.id);
        }
      });
    } else if (selectedNode.type === 'audience') {
      auds.add(selectedNode.id);
      const targetAud = audiences.find(a => a.id === selectedNode.id);
      targetAud?.docIds?.forEach(did => docs.add(did));
      pages.forEach(p => {
        if (p.audienceIds?.includes(selectedNode.id)) {
          pgs.add(p.id);
        }
      });
    } else if (selectedNode.type === 'page') {
      pgs.add(selectedNode.id);
      const targetPage = pages.find(p => p.id === selectedNode.id);
      targetPage?.audienceIds?.forEach(aid => {
        auds.add(aid);
      });
      audiences.forEach(a => {
        if (auds.has(a.id)) {
          a.docIds?.forEach(did => docs.add(did));
        }
      });
    }

    return { highlightedDocs: docs, highlightedAudiences: auds, highlightedPages: pgs };
  }, [selectedNode, documents, audiences, pages]);

  if (isLoadingDocs || isLoadingAuds || isLoadingPages) {
    return <div className={styles.loader}><Spin size="large" /></div>;
  }

  return (
    <div className={styles.container}>
      <DocumentColumn 
        selectedNode={selectedNode}
        highlightedDocs={highlightedDocs}
        onSelectNode={setSelectedNode}
      />
      
      <AudienceColumn 
        selectedNode={selectedNode}
        highlightedAudiences={highlightedAudiences}
        onSelectNode={setSelectedNode}
      />
      
      <PageColumn 
        selectedNode={selectedNode}
        highlightedPages={highlightedPages}
        onSelectNode={setSelectedNode}
      />
    </div>
  );
};
