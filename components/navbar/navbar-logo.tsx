import Link from "next/link";
import { logo1 } from "../../public";
import { projectName } from "../../utils/constants";
import { BlurImage } from "../ui/blur-image";

export default function LogoNavbar() {

  return (
    <Link href="/" >
      <div className="flex items-center justify-start">
        <BlurImage src={logo1} alt={`${projectName} Image`} className="w-[70px] md:w-[60px] tablet:w-[120px] h-auto" />
      </div>
    </Link>
  );
}