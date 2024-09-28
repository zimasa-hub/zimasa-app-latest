// layout.tsx
import { ReactNode } from 'react';
import BottomNav from '../BottomNavigationBar';



export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden "> {/* Add padding bottom to avoid overlap with BottomNav */}
      {children}
      <BottomNav />
    </div>
  );
}
