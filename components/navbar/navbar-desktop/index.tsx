import LogoNavbar from "../navbar-logo";
import NavbarItems from "./navbar-items";



export default function NavbarDesktop() {

  return (
    <aside className="hidden md:block tablet:w-fit xl:w-[244px] p-1 tablet:p-4 border-r border-zinc-700 overflow-y-auto">
      <div className="h-full w-full flex flex-col px-3 pt-2 pb-5">
        <div className="py-6 tablet:pb-6 mb-5">
          <LogoNavbar />
        </div>
        <NavbarItems />
      </div>
    </aside>
  )
}