import './../src/index.css';
import { Providers } from './providers';

export const metadata = {
  title: 'Blood Donation Platform for Rotary Districts',
  description: 'A platform for blood donation for Rotary districts.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
