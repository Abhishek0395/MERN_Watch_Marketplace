import { AuthProvider } from '../context/AuthContext';
import './globals.css';

export const metadata = {
  title: 'Second Hand — Pre-Owned Watches, Verified',
  description: 'A marketplace for buying and selling pre-owned watches.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}