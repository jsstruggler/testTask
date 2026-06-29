import { useState, MouseEvent } from 'react';
import { Button, Popconfirm, Tag, message, Form } from 'antd';
import { FileTextOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { StatusBadge } from '@/components/ui';
import { SelectedNode, DocumentFormValues } from '../types';
import styles from '../ImpactTrailDashboard.module.scss';
import { useGetDocumentsQuery, useDeleteDocumentMutation, useCreateDocumentMutation } from '@/store/api';
import { DocumentModal } from './DocumentModal';

interface DocumentColumnProps {
  selectedNode: SelectedNode | null;
  highlightedDocs: Set<string>;
  onSelectNode: (node: SelectedNode | null) => void;
}

export const DocumentColumn = ({
  selectedNode,
  highlightedDocs,
  onSelectNode,
}: DocumentColumnProps) => {
  const { data: documents = [] } = useGetDocumentsQuery();
  const [deleteDocument, { isLoading: isDeleting }] = useDeleteDocumentMutation();
  const [createDocument, { isLoading: isCreatingDoc }] = useCreateDocumentMutation();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm<DocumentFormValues>();

  const getCardClasses = (id: string) => {
    if (!selectedNode) return styles.card;
    if (selectedNode.type === 'document' && selectedNode.id === id) {
      return `${styles.card} ${styles.active}`;
    }
    return highlightedDocs.has(id) ? `${styles.card} ${styles.highlighted}` : `${styles.card} ${styles.dimmed}`;
  };

  const handleCreateDocument = async (values: DocumentFormValues) => {
    try {
      await createDocument(values).unwrap();
      message.success('Document created successfully');
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to create document');
    }
  };

  const handleDeleteDoc = async (id: string, e?: MouseEvent<HTMLElement>) => {
    e?.stopPropagation();
    try {
      await deleteDocument(id).unwrap();
      message.success('Document deleted successfully');
      if (selectedNode?.id === id) {
        onSelectNode(null);
      }
    } catch (error) {
      message.error('Failed to delete document');
    }
  };
  return (
    <div className={styles.column}>
      <div className={`${styles.header} ${styles.headerTitle}`}>
        <h3><FileTextOutlined className={styles.headerIcon} /> Documents</h3>
        <Button type="primary" size="small" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>Create</Button>
      </div>
      <div className={styles.content}>
        {documents.map(doc => (
          <div 
            key={doc.id} 
            className={getCardClasses(doc.id)}
            onClick={() => onSelectNode({ type: 'document', id: doc.id })}
          >
            <div className={styles.cardHeader}>
              <h4 className={styles.title}>{doc.name}</h4>
              <Popconfirm 
                title="Delete Document?" 
                description="This will affect audiences and pages."
                onConfirm={(e) => handleDeleteDoc(doc.id, e)}
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

      <DocumentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateDocument}
        isCreating={isCreatingDoc}
        form={form}
      />
    </div>
  );
};
