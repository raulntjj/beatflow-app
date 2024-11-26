"use client"

import Image from "next/image";
import Link from "next/link";
import { logo1 } from "../../../public";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";

export default function LoginForm() {
  return (
    <div className="w-full h-full max-w-md p-8 rounded-xl shadow-md m-auto -translate-y-14">
      <Image src={logo1} alt="logo" className="w-[130px] h-auto mx-auto mb-6" />  
      <h2 className="text-xl font-semibold text-center mb-6">Fazer login</h2>
      <form className="space-y-4">
        <div>
          <Input 
            type="text" 
            id="username" 
            placeholder="Usuário" 
            className="w-full"
          />
        </div>
        
        <div>
          <Input 
            type="password" 
            id="password" 
            placeholder="Senha" 
            className="w-full"
          />
          
          <Link 
            href="/forgot-password" 
            className="text-sm text-foreground  hover:underline block mt-2 text-right"
          >
            Esqueceu sua senha?
          </Link>
        </div>
        
        <Button 
          type="submit"
          variant={"default"}
          className="w-full mt-4"
        >
          Login
        </Button>
        
        <div className="text-center text-sm mt-4">
          Não possui conta?{' '}
          <Link 
            href="/register" 
            className="text-primary hover:underline"
          >
             Cadastre-se
          </Link>
        </div>
      </form>
    </div>
  );
}