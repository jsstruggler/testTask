'use client';

import { ConfigProvider, theme } from 'antd';
import { ReactNode } from 'react';

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#5e6ad2',
          fontFamily: 'var(--font-inter), sans-serif',
          colorBgBase: '#0f1115',
          colorBgContainer: '#1a1d24',
          borderRadius: 12,
        },
        components: {
          Menu: {
            itemBg: 'transparent',
            itemSelectedBg: 'rgba(94, 106, 210, 0.1)',
            itemSelectedColor: '#5e6ad2',
          },
          Layout: {
            siderBg: '#13151a',
            headerBg: '#13151a',
            bodyBg: '#0f1115',
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
