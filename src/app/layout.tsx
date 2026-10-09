import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '基数変換マスター',
  description: '2進数・10進数・16進数の相互変換とタイムアタック学習ツール',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
