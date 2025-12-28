import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sea Route Configuration',
  description: 'Configure and manage maritime sea routes',
  icons: {
    icon: '/Searoute-logo.jpg',
    shortcut: '/Searoute-logo.jpg',
    apple: '/Searoute-logo.jpg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}

