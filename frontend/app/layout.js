import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'TaskFlow — Full-Stack Task Manager',
  description: 'A Next.js + Django REST full-stack portfolio application.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#0b1120] min-h-screen">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
