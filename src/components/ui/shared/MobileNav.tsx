"use client"
import React from 'react'
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import Link from 'next/link'
import Image from 'next/image'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { navLinks } from '../../../constants'
import { usePathname } from 'next/navigation'
import { Button } from '../button'

const MobileNav = () => {

    const pathname = usePathname()
  return (
    <header className='header'>
        <Link href="/" className='flex item-centre gap-2 md:py-2 '> 
            <Image 
                src="public/assets/images/logo-text.svg"
                alt="logo"
                width={180}
                height={28}
            />
        </Link>
        <nav className='flex gap-2'>
            <SignedIn>
                <UserButton afterSwitchSessionUrl='/'/>
            </SignedIn>
            <Sheet>
                <SheetTrigger>
                    <Image 
                        src = "\public\assets\icons\menu.svg"
                        alt = "menu"
                        width={32} 
                        height={32}
                        className='cursor-pointer'
                    />
                </SheetTrigger>
                <SheetContent className="sheet-content sm:w-54 md:w-72 lg:w-96 ">
                    <>
                        <Image
                            src="/public/assets/images/logo-text.svg"
                            alt="logo"
                            width={152}
                            height={23}
                        />

                        <ul className='sidebar-nav_elements mt-4 flex flex-col'>
                            {
                                navLinks.map((link)=>{
                                    //Link on which we currently are
                                    const isActive = link.route === pathname
                                    return (
                                    <li key={link.route} className={`mt-2 rounded-full w-full flex whitespace-nowrap p-18 ${isActive ? 'bg-purple-900/70 text-white' : 'text-gray-700'} sm:p-2 `}>
                                        <Link className='sidebar-link cursor-pointer' href={link.route}>
                                        <Image 
                                            src={`public/${link.icon}`}
                                            alt='logo'
                                            width={24}
                                            height={24}
                            
                                        />
                                        {link.label}
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>  
                    </>
                </SheetContent>
            </Sheet>

            <SignedOut>
                  {/* asChild ensures it renders as link */}
                  <Button asChild className='bg-purple-gradient bg-cover'>
                      <Link href="/sign-in"> Login </Link>
                  </Button>
            </SignedOut>
        </nav>
    </header>
  )
}

export default MobileNav