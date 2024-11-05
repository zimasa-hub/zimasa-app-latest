// layout.tsx
import { ReactNode } from 'react';
import BottomNav from "@/app/NavBars/service-provider-bottomBar";
import ConsumerBottomNav from '../NavBars/consumer-bottomBar';
import BottomNavBar from '../NavBars/BottomNavBar';



export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className=" bg-white relative overflow-hidden flex flex-col "> {/* Add padding bottom to avoid overlap with BottomNav */}
      {children}
     
      <BottomNavBar />
    </div>
  );
}
