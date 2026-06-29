import { useState } from 'react';
import { Button, Collapse, Typography, Space, message, Form } from 'antd';
import { TeamOutlined, PlusOutlined } from '@ant-design/icons';
import { StatusBadge } from '@/components/ui';
import { SelectedNode, VpcType, AudienceFormValues } from '../types';
import styles from '../ImpactTrailDashboard.module.scss';
import { useGetAudiencesQuery, useGetDocumentsQuery, useCreateAudienceMutation } from '@/store/api';
import { AudienceModal } from './AudienceModal';

const { Text } = Typography;

interface AudienceColumnProps {
  selectedNode: SelectedNode | null;
  highlightedAudiences: Set<string>;
  onSelectNode: (node: SelectedNode | null) => void;
}

export const AudienceColumn = ({
  selectedNode,
  highlightedAudiences,
  onSelectNode,
}: AudienceColumnProps) => {
  const { data: audiences = [] } = useGetAudiencesQuery();
  const { data: documents = [] } = useGetDocumentsQuery();
  const [createAudience, { isLoading: isCreatingAud }] = useCreateAudienceMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm<AudienceFormValues>();

  const getCardClasses = (id: string) => {
    if (!selectedNode) return styles.card;
    if (selectedNode.type === 'audience' && selectedNode.id === id) {
      return `${styles.card} ${styles.active}`;
    }
    return highlightedAudiences.has(id) ? `${styles.card} ${styles.highlighted}` : `${styles.card} ${styles.dimmed}`;
  };

  const handleCreateAudience = async (values: AudienceFormValues) => {
    try {
      const formattedVpcs = (values.vpcs || []).map(vpc => {
        const parseList = (str: string | undefined) => (str ? str.split(',').map(s => s.trim()).filter(Boolean) : []);
        return {
          ...vpc,
          fields: {
            jobs: parseList(vpc.fields?.jobs),
            pains: parseList(vpc.fields?.pains),
            gains: parseList(vpc.fields?.gains),
            products: parseList(vpc.fields?.products),
            painRelievers: parseList(vpc.fields?.painRelievers),
            gainCreators: parseList(vpc.fields?.gainCreators),
          }
        };
      });

      await createAudience({ ...values, vpcs: formattedVpcs }).unwrap();
      message.success('Audience created successfully');
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to create audience');
    }
  };
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
        <Button type="primary" size="small" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>Create</Button>
      </div>
      <div className={styles.content}>
        {audiences.map(aud => (
          <div 
            key={aud.id} 
            className={getCardClasses(aud.id)}
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

      <AudienceModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateAudience}
        isCreating={isCreatingAud}
        form={form}
        documents={documents}
      />
    </div>
  );
};
