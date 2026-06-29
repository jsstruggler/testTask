'use client';

import { Layout } from 'antd';

const { Content } = Layout;
import styles from './AppLayout.module.scss';
import { ReactNode } from 'react';

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <Layout className={styles.layout}>
      <Layout>
        <Content className={styles.content}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
