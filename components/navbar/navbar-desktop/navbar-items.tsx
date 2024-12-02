import { Heart, Home, MenuIcon, PlusSquare } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { HiMiniUserGroup } from "react-icons/hi2";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { FaFileUpload } from "react-icons/fa";
import ProfilePhoto from "../../user/profile-photo";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Button } from "../../ui/button";
import { FileUpload } from "../../ui/file-upload";



export default function NavbarItems() {

  const [files, setFiles] = useState<File[]>([]);
  const handleFileUpload = (files: File[]) => {
    setFiles(files);
    console.log(files);
  };

  const navbarItems = [
    { icon: Home, label: 'Página inicial', href:"/" , key: 'home'  },
    { icon: HiMiniUserGroup, label:'Colabbs', href:"/", key: 'colabbs' },
    { icon: Heart, label: 'Notificações', href:"/", key: 'notifications' },
  ];

  const [activeTab, setActiveTab] = useState('home');

  return (
    <nav className="h-full w-full flex flex-col justify-between space-y-7">
      <div className="flex flex-col space-y-7">
        {navbarItems.map((item) => (
          <Link 
            key={item.key} 
            href={`/${item.href}`}
            className={`flex w-full justify-center tablet:justify-start items-center ${activeTab === item.key ? 'secondary' : 'ghost'}`}
            onClick={() => setActiveTab(item.key)}
          >
            <item.icon className="tablet:mr-3 h-7 w-7" />
            <span className="hidden tablet:block">
              {item.label}
            </span>
          </Link>
        ))}

        <Dialog>
          <DialogTrigger className="flex w-full justify-center tablet:justify-start items-center">
            <PlusSquare className="tablet:mr-3 h-7 w-7" />
            <span className="hidden tablet:block">
              Criar
            </span>
          </DialogTrigger>
          <DialogContent className="border-zinc-700">
            <DialogHeader>
              <DialogTitle className="text-center">Criar nova publicação</DialogTitle>
            </DialogHeader>
            <div>
              <FileUpload onChange={handleFileUpload} />
            </div>
          </DialogContent>
        </Dialog>
        <Link href={`/profile/{user}`} className="flex w-full justify-center tablet:justify-start items-center" >
          <ProfilePhoto src="" alt="" className="tablet:mr-3" />
          <span className="hidden tablet:block">
            Perfil
          </span>
        </Link>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <button className="flex w-full justify-center tablet:justify-start items-center">
            <MenuIcon className="tablet:mr-3 h-7 w-7" />
            <span className="hidden tablet:block">
              Mais
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="max-w-[200px] bg-zinc-800 border-zinc-700 p-2">
          <div className="flex justify-center items-center gap-4">
            <Button variant={"ghost"} className="w-full"> 
              Sair
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </nav>
  )
}