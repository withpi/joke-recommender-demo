import Link from "next/link";
import Image from "next/image";
import piLogo from "@/public/pi-logo-full.svg";
import {BookOpen, Calendar, Github, Mail, MessageCircle} from "lucide-react";
import {ReactNode} from "react";
import {UserDropdown} from "@/components/auth/signin_dropdown";
import { Button } from "./catalyst/button";
import {User} from "next-auth";
export function Navbar({children, user} : {children?: ReactNode; user?: User}) {
  return (
    <header className="flex items-center justify-between gap-6 px-6 py-4 border-b">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Link href={'https://withpi.ai'} target={'_blank'} className="flex items-center justify-center rounded-lg ">
            <Image className={'w-24'} src={piLogo} alt={"Pi Labs logo"}/>
          </Link>
        </div>
        <div className={'text-gray-600'}>
          Joke Recommender
        </div>
        {children}
      </div>

      <div className="flex items-center gap-6">
        <Link
          href={'/'}
          className="flex items-center gap-1.5 text-gray-600 hover:text-primary transition-colors"
          title="Join our Discord"
        >
          About Example
        </Link>
        <a
          href="https://calendar.app.google/wvGTUqNLcUberikD8"
          target="_blank"
          className="flex items-center gap-1.5 text-gray-600  hover:text-primary transition-colors"
          title="Schedule time with Pi"
          rel="noreferrer"
        >
          Contact
        </a>
        {user?.email ?
          <UserDropdown user={user}/> :
          <Button color={'white'} className={'cursor-pointer'}>
            Pi Labs Home
          </Button>

        }
      </div>
    </header>
  )
}