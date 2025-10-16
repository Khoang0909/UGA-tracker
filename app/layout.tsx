import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import { DataProvider } from '@/contexts/DataContext';
import Navbar from '@/components/Navbar';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'UGA Job Tracker',
  description: 'Track job opportunities and applications for UGA students in Athens',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <DataProvider>
            <Navbar />
            <main className="main-content">{children}</main>
          </DataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
