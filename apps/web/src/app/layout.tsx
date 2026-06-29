import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { StoreProvider } from "@/components/providers/StoreProvider";
import { ThemeProvider } from "@/components/shared/ThemeProvider/ThemeProvider";
import { AppLayout } from "@/components/shared/AppLayout/AppLayout";
import "@/styles/globals.scss";
import { ReactNode } from "react";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Knowledge Base Manager",
  description: "A premium tool to manage knowledge base, audiences, and impact.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <AntdRegistry>
          <StoreProvider>
            <ThemeProvider>
              <AppLayout>
                {children}
              </AppLayout>
            </ThemeProvider>
          </StoreProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
