import React from 'react'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import Link from 'next/link'
import Image from 'next/image'
import { SignedIn, UserButton } from '@clerk/nextjs'

const MobileNav = () => {
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
                <SheetTrigger>Open</SheetTrigger>
                <SheetContent className="w-[400px] sm:w-[540px]">
                    <SheetHeader>
                    <SheetTitle>Are you absolutely sure?</SheetTitle>
                    <SheetDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                    </SheetDescription>
                    </SheetHeader>
                </SheetContent>
            </Sheet>

        </nav>
    </header>
  )
}

export default MobileNav