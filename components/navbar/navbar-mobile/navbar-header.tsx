import { Heart } from 'lucide-react';
import Link from 'next/link';
import LogoNavbar from '../navbar-logo';
import SearchUsers from '../search-users';

export default function NavbarHeader(){

  const users = [
    {
      id: 1,
      name: "Gustavim da 12",
      username: "gustavimda12",
      avatarSrc: "",
    },
    {
      id: 2,
      name: "Medina do B da Mirage",	
      username: "medinamirage",
      avatarSrc: "",
    },
    {
      id: 3,
      name: "Raul do DDos",
      username: "raulntjj",
      avatarSrc: "",
    },
    {
      id: 4,
      name: "Brunin VeryXit",
      username: "bruninho",
      avatarSrc: "",
    },
    {
      id: 5,
      name: "Brunin VeryXit",
      username: "bruninho",
      avatarSrc: "",
    },
    {
      id: 6,
      name: "Brunin VeryXit",
      username: "bruninho",
      avatarSrc: "",
    },
    {
      id: 7,
      name: "Brunin VeryXit",
      username: "bruninho",
      avatarSrc: "",
    },
    {
      id: 8,
      name: "Jonao Bazucador",
      username: "reazew",
      avatarSrc: "",
    },
  ];
  
  return (
    <div className="fixed md:hidden inset-x-0 top-0 z-50 bg-background text-foreground">
      <div className="flex items-center justify-between gap-5 py-1 px-4 border-b border-zinc-700">
        <LogoNavbar />
        
        <div className="flex items-center space-x-2">
          <SearchUsers users={users} />
          <Link 
            href={`/notifications`}
            className={``}
          >
            <Heart className="tablet:mr-3 h-7 w-7" />
          </Link>
        </div>
      </div>
    </div>
  )
}