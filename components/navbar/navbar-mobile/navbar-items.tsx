import { Home} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { HiOutlineUserGroup } from 'react-icons/hi2';
import ProfilePhoto from '../../user/profile-photo';
import CreatePost from '../../user/create-post';
import PlusOptions from '../plus-options';

export default function NavbarMobileItems(){

  const [files, setFiles] = useState<File[]>([]);// eslint-disable-line @typescript-eslint/no-unused-vars
  const handleFileUpload = (files: File[]) => {
    setFiles(files);
    console.log(files);
  };


  const [activeTab, setActiveTab] = useState('home');

  const navbarItems = [
    { icon: Home, label: 'Página inicial', href:"/" , key: 'home'  },
    { icon: HiOutlineUserGroup , label:'Collabs', href:"/", key: 'collabs' },
  ];

  return (
    <div className="fixed md:hidden z-10 inset-x-0 bottom-0 bg-background border-t-[2px] border-zinc-700 flex justify-around py-3">
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
      <CreatePost />
      <Link href={`/profile/{user}`} className="flex w-full justify-center tablet:justify-start items-center" >
        <ProfilePhoto src="" alt="" className="tablet:mr-3" />
      </Link>
      <PlusOptions />
    </div>
  );
};