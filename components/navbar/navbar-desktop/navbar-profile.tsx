import { Button } from "../../ui/button";
import { UserAvatar } from "../../user/user-avatar";



export default function ProfileNavbar() {

  return (
    <aside className="pl-16 md:w-[319px] hidden lg:block">
    <div className="mt-6">
      <div className="w-full flex justify-between items-center px-2">
        <UserAvatar />
        <Button 
          variant={"link"} 
          className="no-underline">
          Sair
        </Button>
      </div>
    </div>
  </aside>
  )
}