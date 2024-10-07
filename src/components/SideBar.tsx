import { Button } from "@/components/ui/button"
import { Home, BookOpen, MessageSquare, Bell, Bookmark, User, LogOut } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { signOut } from "next-auth/react";


interface SidebarProps {
  isOpen: boolean
}


async function keycloakSessionLogOut() {
  try {
    await fetch(`/api/auth/signout`, { method: "GET" });
  } catch (err) {
    console.error(err);
  }
}





export default function Sidebar({ isOpen }: SidebarProps) {
  const navItems = [
    { icon: User, label: 'Profile' },
    { icon: BookOpen, label: 'Topics' },
    { icon: MessageSquare, label: 'Messages' },
    { icon: Bell, label: 'Notifications' },
    { icon: Bookmark, label: 'Bookmarks' },
    
  ]

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-72 bg-white border-r shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center p-6 border-b">
          <div className="relative">
            <img
              src="/lady_profile.png"
              alt="User avatar"
              className="w-12 h-12 rounded-full border-2 border-primary"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          </div>
          <div className="ml-4">
            <h2 className="font-semibold text-lg">Dalton Leyian</h2>
            <p className="text-sm text-muted-foreground">Zimasa Member</p>
          </div>
        </div>
        <ScrollArea className="flex-grow">
          <nav className="p-4">
            <ul className="space-y-2">
              {navItems.map((item, index) => (
                <li key={index}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-base font-medium"
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.label}
                  </Button>
                </li>
              ))}
            </ul>
          </nav>
        </ScrollArea>
        <div className="p-4 border-t">
          <Button variant="outline"
           onClick={() => {
            keycloakSessionLogOut().then(() => signOut({ callbackUrl: "/" }));
          }} className="w-full justify-start text-base font-medium">
            <LogOut className="mr-3 h-5 w-5" />
            Log out
          </Button>
        </div>
      </div>
    </aside>
  )
}