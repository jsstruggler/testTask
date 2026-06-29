'use client';

import { Typography } from 'antd';
import styles from './page.module.scss';
import { ImpactTrailDashboard } from '@/components/shared/ImpactTrailDashboard/ImpactTrailDashboard';

const { Title, Paragraph } = Typography;

export default function DashboardPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Title level={2} className={styles.title}>Impact Trail</Title>
        <Paragraph type="secondary" className={styles.description}>
          Interactive dashboard to visualize the cascade impact of your documents across audiences and pages.
        </Paragraph>
      </div>
      
      <ImpactTrailDashboard />
    </div>
  );
}
