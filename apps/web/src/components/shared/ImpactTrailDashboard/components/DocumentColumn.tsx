import { Button, Popconfirm, Tag } from 'antd';
import { FileTextOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { StatusBadge } from '@/components/ui';
import { DocumentType, SelectedNode } from '../types';
import styles from '../ImpactTrailDashboard.module.scss';
import { MouseEvent } from 'react';

interface DocumentColumnProps {
  documents: DocumentType[];
  selectedNode: SelectedNode | null;
  highlightedDocs: Set<string>;
  isDeleting: boolean;
  onSelectNode: (node: SelectedNode) => void;
  onDeleteDoc: (id: string, e?: MouseEvent<HTMLElement>) => void;
  onOpenModal: () => void;
  getCardClasses: (type: 'document' | 'audience' | 'page', id: string) => string;
}

export const DocumentColumn = ({
  documents,
  isDeleting,
  onSelectNode,
  onDeleteDoc,
  onOpenModal,
  getCardClasses
}: DocumentColumnProps) => {
  return (
    <div className={styles.column}>
      <div className={`${styles.header} ${styles.headerTitle}`}>
        <h3><FileTextOutlined className={styles.headerIcon} /> Documents</h3>
        <Button type="primary" size="small" icon={<PlusOutlined />} onClick={onOpenModal}>Create</Button>
      </div>
      <div className={styles.content}>
        {documents.map(doc => (
          <div 
            key={doc.id} 
            className={getCardClasses('document', doc.id)}
            onClick={() => onSelectNode({ type: 'document', id: doc.id })}
          >
            <div className={styles.cardHeader}>
              <h4 className={styles.title}>{doc.name}</h4>
              <Popconfirm 
                title="Delete Document?" 
                description="This will affect audiences and pages."
                onConfirm={(e) => onDeleteDoc(doc.id, e)}
                onCancel={(e) => e?.stopPropagation()}
                okText="Yes"
                cancelText="No"
              >
                <Button 
                  type="text" 
                  danger 
                  icon={<DeleteOutlined />} 
                  size="small" 
                  onClick={e => e.stopPropagation()} 
                  loading={isDeleting}
                />
              </Popconfirm>
            </div>
            <div>
              <Tag color={doc.type === 'audience' ? 'blue' : 'purple'} className={styles.tagCapitalize}>
                {doc.type}
              </Tag>
              <StatusBadge status={doc.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
