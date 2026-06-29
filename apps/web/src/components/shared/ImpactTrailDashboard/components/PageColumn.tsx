import { Button, Collapse, Typography } from 'antd';
import { AppstoreOutlined, PlusOutlined } from '@ant-design/icons';
import { StatusBadge } from '@/components/ui';
import { PageType, SelectedNode } from '../types';
import styles from '../ImpactTrailDashboard.module.scss';

const { Text } = Typography;

interface PageColumnProps {
  pages: PageType[];
  selectedNode: SelectedNode | null;
  highlightedPages: Set<string>;
  onSelectNode: (node: SelectedNode) => void;
  onOpenModal: () => void;
  getCardClasses: (type: 'document' | 'audience' | 'page', id: string) => string;
}

export const PageColumn = ({
  pages,
  onSelectNode,
  onOpenModal,
  getCardClasses
}: PageColumnProps) => {
  return (
    <div className={styles.column}>
      <div className={`${styles.header} ${styles.headerTitle}`}>
        <h3><AppstoreOutlined className={styles.headerIcon} /> Pages & Sections</h3>
        <Button type="primary" size="small" icon={<PlusOutlined />} onClick={onOpenModal}>Create</Button>
      </div>
      <div className={styles.content}>
        {pages.map(page => (
          <div 
            key={page.id} 
            className={getCardClasses('page', page.id)}
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
    </div>
  );
};
