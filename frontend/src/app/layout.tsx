// frontend/src/app/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { MainLayout } from '@/components/layout/MainLayout';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Labor Compliance PY | Sistema de Cumplimiento Laboral',
  description: 'Gestión inteligente de obligaciones laborales en Paraguay (IPS, MTESS, Aguinaldo).',
  keywords: 'laboral, paraguay, cumplimiento, ips, mtess, aguinaldo, calculadoras',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased text-gray-900 selection:bg-indigo-100 selection:text-indigo-900`}>
        <MainLayout>
          {children}
        </MainLayout>
      </body>
    </html>
  );
}
