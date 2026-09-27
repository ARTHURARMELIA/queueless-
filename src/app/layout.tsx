import type { Metadata } from 'next';
import './globals.css';
import { QueueProvider } from '@/context/QueueContext';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { WhatsAppSimulator } from '@/components/ui/WhatsAppSimulator';

export const metadata: Metadata = {
  title: 'QUEUELESS | Your time shouldn’t be spent waiting',
  description:
    'Digital queue management with live spatial 3D visualization and real-time WhatsApp updates. Join digitally, leave the waiting room, and return when called.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#08090C] text-white min-h-screen flex flex-col antialiased selection:bg-cyan-500/30 selection:text-white">
        <QueueProvider>
          <Navbar />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
          <WhatsAppSimulator />
        </QueueProvider>
      </body>
    </html>
  );
}
