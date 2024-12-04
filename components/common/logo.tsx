import { logo1 } from "../../public";
import { projectName } from "../../utils/constants";
import { BlurImage } from "../ui/blur-image";

export default function Logo() {
  return (
    <div className="flex items-center justify-center">
      <BlurImage src={logo1} alt={`${projectName} Image`} className="w-[200px] h-auto" />
    </div>
  );
}