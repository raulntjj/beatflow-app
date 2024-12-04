import { Home } from 'lucide-react';
import Link from 'next/link';
import { HiOutlineUserGroup, HiUserGroup } from 'react-icons/hi2';
import ProfilePhoto from '../../user/profile-photo';
import CreatePost from '../../user/create-post';
import PlusOptions from '../plus-options';

import { useContext, useState } from 'react';
import { UserContext } from "@/context/user-context";
import { GoHome, GoHomeFill } from 'react-icons/go';

export default function NavbarMobileItems() {

  const userData = useContext(UserContext);

  const [files, setFiles] = useState<File[]>([]); // eslint-disable-line @typescript-eslint/no-unused-vars
  const handleFileUpload = (files: File[]) => {
    setFiles(files);
  };

  const [activeTab, setActiveTab] = useState("home");


  return (
    <div className="fixed md:hidden z-10 inset-x-0 bottom-0 bg-background border-t-[2px] border-zinc-700 flex justify-around py-3">
      <Link
        key={'home'}
        href={`/`}
        className={`flex w-full justify-center tablet:justify-start items-center`}
        onClick={() => setActiveTab("home")}
      >
        { activeTab === "home" ? <GoHomeFill className="tablet:mr-3 h-7 w-7" /> : <GoHome className="tablet:mr-3 h-7 w-7" />}
        
        <span className="hidden tablet:block">Página inicial</span>
      </Link>
      <Link
        key={'projects'}
        href={`/projects`}
        className={`flex w-full justify-center tablet:justify-start items-center`}
        onClick={() => setActiveTab("projects")}
      >
        { activeTab === "projects" ? <HiUserGroup className="tablet:mr-3 h-7 w-7" /> : <HiOutlineUserGroup className="tablet:mr-3 h-7 w-7" />}
        
        <span className="hidden tablet:block">Projetos</span>
      </Link>
      <CreatePost />
      <Link
        href={`/profile/{user}`}
        className="flex w-full justify-center tablet:justify-start items-center"
      >
        <ProfilePhoto 
          src={userData?.profilePhoto || ""}
          alt={userData?.name || ""}
          className="tablet:mr-3"
        />
      </Link>
      <PlusOptions />
    </div>
  );
}
