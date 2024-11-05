// app/appointments/layout.tsx
import { ReactNode } from 'react';
import BottomNav from '@/app/NavBars/consumer-bottomBar';
import ConsumerBottomNav from '@/app/NavBars/consumer-bottomBar';



export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-white relative min-h-screen overflow-hidden "> {/* Add padding bottom to avoid overlap with BottomNav */}
      {children}
       
      <ConsumerBottomNav />
    </div>
  );
}
