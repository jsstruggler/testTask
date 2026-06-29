'use client';

import { Spin } from 'antd';
import { useImpactTrailDashboard } from './useImpactTrailDashboard';
import { DocumentColumn } from './components/DocumentColumn';
import { AudienceColumn } from './components/AudienceColumn';
import { PageColumn } from './components/PageColumn';
import { DocumentModal } from './components/DocumentModal';
import { AudienceModal } from './components/AudienceModal';
import { PageModal } from './components/PageModal';
import styles from './ImpactTrailDashboard.module.scss';

export const ImpactTrailDashboard = () => {
  const {
    documents,
    audiences,
    pages,
    isLoading,
    isDeleting,
    isCreatingDoc,
    isCreatingAud,
    isCreatingPage,
    selectedNode,
    setSelectedNode,
    isDocModalOpen,
    setIsDocModalOpen,
    isAudModalOpen,
    setIsAudModalOpen,
    isPageModalOpen,
    setIsPageModalOpen,
    docForm,
    audForm,
    pageForm,
    highlightedDocs,
    highlightedAudiences,
    highlightedPages,
    handleCreateDocument,
    handleCreateAudience,
    handleCreatePage,
    handleDeleteDoc,
  } = useImpactTrailDashboard();

  const getCardClasses = (type: 'document' | 'audience' | 'page', id: string) => {
    if (!selectedNode) return styles.card;
    
    if (selectedNode.type === type && selectedNode.id === id) {
      return `${styles.card} ${styles.active}`;
    }

    let isHighlighted = false;
    if (type === 'document') isHighlighted = highlightedDocs.has(id);
    if (type === 'audience') isHighlighted = highlightedAudiences.has(id);
    if (type === 'page') isHighlighted = highlightedPages.has(id);

    return isHighlighted ? `${styles.card} ${styles.highlighted}` : `${styles.card} ${styles.dimmed}`;
  };

  if (isLoading) {
    return <div className={styles.loader}><Spin size="large" /></div>;
  }

  return (
    <div className={styles.container}>
      <DocumentColumn 
        documents={documents}
        selectedNode={selectedNode}
        highlightedDocs={highlightedDocs}
        isDeleting={isDeleting}
        onSelectNode={setSelectedNode}
        onDeleteDoc={handleDeleteDoc}
        onOpenModal={() => setIsDocModalOpen(true)}
        getCardClasses={getCardClasses}
      />
      
      <AudienceColumn 
        audiences={audiences}
        selectedNode={selectedNode}
        highlightedAudiences={highlightedAudiences}
        onSelectNode={setSelectedNode}
        onOpenModal={() => setIsAudModalOpen(true)}
        getCardClasses={getCardClasses}
      />
      
      <PageColumn 
        pages={pages}
        selectedNode={selectedNode}
        highlightedPages={highlightedPages}
        onSelectNode={setSelectedNode}
        onOpenModal={() => setIsPageModalOpen(true)}
        getCardClasses={getCardClasses}
      />

      <DocumentModal 
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
        onSubmit={handleCreateDocument}
        isCreating={isCreatingDoc}
        form={docForm}
      />

      <AudienceModal 
        isOpen={isAudModalOpen}
        onClose={() => setIsAudModalOpen(false)}
        onSubmit={handleCreateAudience}
        isCreating={isCreatingAud}
        form={audForm}
        documents={documents}
      />

      <PageModal 
        isOpen={isPageModalOpen}
        onClose={() => setIsPageModalOpen(false)}
        onSubmit={handleCreatePage}
        isCreating={isCreatingPage}
        form={pageForm}
        audiences={audiences}
      />
    </div>
  );
};
