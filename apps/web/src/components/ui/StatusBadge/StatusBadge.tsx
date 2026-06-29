'use client';

import { Tag } from 'antd';
import { 
  CheckCircleOutlined, 
  SyncOutlined, 
  ExclamationCircleOutlined 
} from '@ant-design/icons';
import styles from './StatusBadge.module.scss';
import { FC } from 'react';

type StatusType = 'new' | 'applied' | 'outdated' | string;

interface StatusBadgeProps {
  status?: StatusType;
}

export const StatusBadge: FC<StatusBadgeProps> = ({ status }) => {
  if (!status) return null;

  let color = 'default';
  let icon = null;

  switch (status.toLowerCase()) {
    case 'applied':
      color = 'success';
      icon = <CheckCircleOutlined />;
      break;
    case 'new':
      color = 'processing';
      icon = <SyncOutlined spin />;
      break;
    case 'outdated':
      color = 'error';
      icon = <ExclamationCircleOutlined />;
      break;
    default:
      color = 'default';
  }

  return (
    <Tag color={color} icon={icon} className={styles.badge}>
      {status}
    </Tag>
  );
};
