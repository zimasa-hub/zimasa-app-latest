// layout.tsx
import { ReactNode } from 'react';
import BottomNav from '../NavBars/consumer-bottomBar.tsx';



export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-white relative min-h-screen overflow-hidden  "> {/* Add padding bottom to avoid overlap with BottomNav */}
      {children}
       
      <BottomNav />
    </div>
  );
}
