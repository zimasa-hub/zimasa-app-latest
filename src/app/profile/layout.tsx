// layout.tsx
import { ReactNode } from 'react';
import BottomNav from '@/app/NavBars/service-provider-bottomBar';



export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className=" bg-white relative min-h-screen overflow-hidden "> 
      {children}
      <BottomNav />
    </div>
  );
}
