import './globals.css';

export const metadata = {
  title: 'NFC Profile',
  description: 'Create and preview styled NFC profile cards',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}