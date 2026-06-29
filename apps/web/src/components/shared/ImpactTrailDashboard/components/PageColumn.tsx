import { useState } from 'react';
import { Button, Collapse, Typography, message, Form } from 'antd';
import { AppstoreOutlined, PlusOutlined } from '@ant-design/icons';
import { StatusBadge } from '@/components/ui';
import { SelectedNode, PageFormValues } from '../types';
import styles from '../ImpactTrailDashboard.module.scss';
import { useGetPagesQuery, useGetAudiencesQuery, useCreatePageMutation } from '@/store/api';
import { PageModal } from './PageModal';

const { Text } = Typography;

interface PageColumnProps {
  selectedNode: SelectedNode | null;
  highlightedPages: Set<string>;
  onSelectNode: (node: SelectedNode | null) => void;
}

export const PageColumn = ({
  selectedNode,
  highlightedPages,
  onSelectNode,
}: PageColumnProps) => {
  const { data: pages = [] } = useGetPagesQuery();
  const { data: audiences = [] } = useGetAudiencesQuery();
  const [createPage, { isLoading: isCreatingPage }] = useCreatePageMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm<PageFormValues>();

  const getCardClasses = (id: string) => {
    if (!selectedNode) return styles.card;
    if (selectedNode.type === 'page' && selectedNode.id === id) {
      return `${styles.card} ${styles.active}`;
    }
    return highlightedPages.has(id) ? `${styles.card} ${styles.highlighted}` : `${styles.card} ${styles.dimmed}`;
  };

  const handleCreatePage = async (values: PageFormValues) => {
    try {
      await createPage({ ...values, sections: values.sections || [] }).unwrap();
      message.success('Page created successfully');
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to create page');
    }
  };
  return (
    <div className={styles.column}>
      <div className={`${styles.header} ${styles.headerTitle}`}>
        <h3><AppstoreOutlined className={styles.headerIcon} /> Pages & Sections</h3>
        <Button type="primary" size="small" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>Create</Button>
      </div>
      <div className={styles.content}>
        {pages.map(page => (
          <div 
            key={page.id} 
            className={getCardClasses(page.id)}
            onClick={() => onSelectNode({ type: 'page', id: page.id })}
          >
            <div className={styles.cardHeader}>
              <h4 className={styles.title}>{page.name}</h4>
            </div>
            <div className={styles.cardBody} onClick={e => e.stopPropagation()}>
              {page.sections && page.sections.length > 0 ? (
                <Collapse 
                  size="small"
                  ghost
                  items={[{
                    key: 'sections',
                    label: <span className={styles.mutedText}>{page.sections.length} Sections</span>,
                    children: (
                      <div>
                        {page.sections.map(sec => (
                          <div key={sec.id} className={styles.sectionItem}>
                            <span>{sec.name}</span>
                            <StatusBadge status={sec.status} />
                          </div>
                        ))}
                      </div>
                    )
                  }]}
                />
              ) : (
                <Text type="secondary" className={styles.emptyText}>No sections available</Text>
              )}
            </div>
          </div>
        ))}
      </div>

      <PageModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreatePage}
        isCreating={isCreatingPage}
        form={form}
        audiences={audiences}
      />
    </div>
  );
};
