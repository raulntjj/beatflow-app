"use client"

import Image from "next/image";
import { vetor1, vetor2, vetor3, vetor4, vetor5, vetor6, vetor7 } from "@/public";
import LoginForm from "./LoginForm";

export default function Login() {
  return (
    <div className="relative flex items-center justify-center bg-background overflow-hidden">
      <div className="md:flex w-full m-auto">
        <div className="relative h-full min-h-screen w-fill md:w-[55%] lg:w-[60%] xl:w-[65%] flex justify-center items-center">
          <LoginForm />
          <Image src={vetor1} alt="" width={576} height={520} className="absolute bottom-0 left-0 object-contain max-w-[250px] sm:max-w-[300px] md:max-w-[330px]"/>
          <Image src={vetor2} alt="" width={173} height={168} className="absolute bottom-[70%] -right-[25px] object-contain max-w-[100px] sm:max-w-[124px] md:max-w-[154px]"/>
          <Image src={vetor3} alt="" width={72} height={128} className="absolute bottom-[30%] -right-[2px] object-contain max-w-[52px] sm:max-w-[52px] md:max-w-[62px]"/>
        </div>
        <div className="relative h-full min-h-screen hidden md:w-[45%] lg:w-[40%] xl:w-[35%] md:flex justify-center items-center bg-foreground">
          <div className="h-full flex items-center justify-center">
            <h1 className="sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-center text-background">
                Sua música,<br /> sua rede,<br /> seu mundo.
            </h1>
          </div>
          <Image src={vetor4} alt="" width={173} height={168} className="absolute bottom-10 -left-3"/>
          <Image src={vetor5} alt="" width={87} height={103} className="absolute bottom-[15%] right-[20%]"/>
          <Image src={vetor6} alt="" width={72} height={128} className="absolute top-[5%] left-[20%]"/>
          <Image src={vetor7} alt="" width={72} height={70} className="absolute top-[10%] right-[20%]"/>
        </div>
      </div>
    </div>
  );
}