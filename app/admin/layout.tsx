import type { Metadata } from 'next';
import '../globals.css';
import { SuppressExtensionErrors } from './SuppressExtensionErrors';

export const metadata: Metadata = {
  title: 'Admin Semayot',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FCF9F2]">
      <SuppressExtensionErrors />
      {children}
    </div>
  );
}
