import { Button, Collapse, Typography, Space } from 'antd';
import { TeamOutlined, PlusOutlined } from '@ant-design/icons';
import { StatusBadge } from '@/components/ui';
import { AudienceType, SelectedNode, VpcType } from '../types';
import styles from '../ImpactTrailDashboard.module.scss';

const { Text } = Typography;

interface AudienceColumnProps {
  audiences: AudienceType[];
  selectedNode: SelectedNode | null;
  highlightedAudiences: Set<string>;
  onSelectNode: (node: SelectedNode) => void;
  onOpenModal: () => void;
  getCardClasses: (type: 'document' | 'audience' | 'page', id: string) => string;
}

export const AudienceColumn = ({
  audiences,
  onSelectNode,
  onOpenModal,
  getCardClasses
}: AudienceColumnProps) => {
  const renderVpcFields = (vpc: VpcType) => {
    if (!vpc.fields) return null;
    return (
      <div className={styles.toolbar}>
        <Space direction="vertical">
          {Object.entries(vpc.fields).map(([key, values]) => {
            if (!values || values.length === 0) return null;
            return (
              <div key={key} className={styles.vpcField}>
                <div className={styles.fieldLabel}>{key}</div>
                <ul>
                  {values.map((v: string, i: number) => <li key={i}>{v}</li>)}
                </ul>
              </div>
            );
          })}
        </Space>
      </div>
    );
  };

  return (
    <div className={styles.column}>
      <div className={`${styles.header} ${styles.headerTitle}`}>
        <h3><TeamOutlined className={styles.headerIcon} /> Audiences & VPCs</h3>
        <Button type="primary" size="small" icon={<PlusOutlined />} onClick={onOpenModal}>Create</Button>
      </div>
      <div className={styles.content}>
        {audiences.map(aud => (
          <div 
            key={aud.id} 
            className={getCardClasses('audience', aud.id)}
            onClick={() => onSelectNode({ type: 'audience', id: aud.id })}
          >
            <div className={styles.cardHeader}>
              <h4 className={styles.title}>{aud.name}</h4>
              <StatusBadge status={aud.interview?.status} />
            </div>
            <div className={styles.cardBody} onClick={e => e.stopPropagation()}>
              {aud.vpcs && aud.vpcs.length > 0 ? (
                <Collapse 
                  size="small"
                  ghost
                  items={aud.vpcs.map(vpc => ({
                    key: vpc.id,
                    label: (
                      <div className={styles.vpcHeader}>
                        <span>{vpc.name}</span>
                        <StatusBadge status={vpc.status} />
                      </div>
                    ),
                    children: renderVpcFields(vpc)
                  }))}
                />
              ) : (
                <Text type="secondary" className={styles.emptyText}>No VPCs available</Text>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
