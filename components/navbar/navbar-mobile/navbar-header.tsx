import { Heart } from 'lucide-react';
import Link from 'next/link';
import LogoNavbar from '../navbar-logo';
import SearchUsers from '../search-users';
import { useState } from 'react';
import { FaHeart } from 'react-icons/fa';

export default function NavbarHeader(){
  
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="fixed md:hidden inset-x-0 top-0 z-50 bg-background text-foreground">
      <div className="flex items-center justify-between gap-5 py-1 px-4 border-b border-zinc-700">
        <LogoNavbar />
        
        <div className="flex items-center space-x-2">
          <SearchUsers />
          <Link 
            href={`/notifications`}
            className={``}
            onClick={() => setActiveTab("notifications")}
          >
           { activeTab === "projects" ? <FaHeart  className="tablet:mr-3 h-7 w-7" /> : <Heart className="tablet:mr-3 h-7 w-7" />}
          </Link>
        </div>
      </div>
    </div>
  )
}