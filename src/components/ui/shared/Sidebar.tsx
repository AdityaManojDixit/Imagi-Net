"use client"
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { navLinks } from '../../../constants'
import { usePathname } from 'next/navigation'
import { Button } from '../button'


const Sidebar = () => {
  //usePathname hook from Next.js and nextNavigation
  const pathname = usePathname();
  return (
    //HTML5 semantic tag which means something is on side
      <aside className='sidebar'>
        <div className='flex size-full flex-col gap-4'>
          <Link href="/" className='sidebar-logo'>
            <Image src="public\assets\images\logo-text.svg" alt="logo" width={180} height={28}/>
          </Link>

          <nav className='sidebar-nav'>
            <SignedIn>
              <ul className='sidebar-nav_elements'>
                  {
                    navLinks.slice(0,6).map((link)=>{
                        //Link on which we currently are
                        const isActive = link.route === pathname
                        return (
                          <li key={link.route} className={`sidebar-nav_element group ${isActive ? 'bg-purple-900/70 text-white' : 'text-gray-700'}`}>
              
                            <Link className='sidebar-link' href={link.route}>
                              <Image 
                                src={`public/${link.icon}`}
                                alt='logo'
                                width={24}
                                height={24}
                                className={`${isActive && 'brightness-200' }`}
                              />
                              {link.label}
                            </Link>
                            

                          </li>
                          
                        )
                      })}
              </ul>

              <ul className='sidebar-nav_elements' >
                  {
                    navLinks.slice(6).map((link)=>{
                        //Link on which we currently are
                        const isActive = link.route === pathname
                        return (
                          <li key={link.route} className={`sidebar-nav_element group ${isActive ? 'bg-purple-900/70 text-white' : 'text-gray-700'}`}>
              
                            <Link className='sidebar-link' href={link.route}>
                              <Image 
                                src={`public/${link.icon}`}
                                alt='logo'
                                width={24}
                                height={24}
                                className={`${isActive && 'brightness-200' }`}
                              />
                              {link.label}
                            </Link>
                            

                          </li>
                          
                        )
                      })}
                  <li className='flex-centre cursor-pointer gap-2 p-4 '>
                    <UserButton afterSwitchSessionUrl='/' showName/>
                  </li>
              </ul>
            </SignedIn>

            <SignedOut>
                  {/* asChild ensures it renders as link */}
                  <Button asChild className='bg-purple-gradient bg-cover'>
                      <Link href="/sign-in"> Login </Link>
                  </Button>
            </SignedOut>
          </nav>
        </div>
      </aside>
  )
}

export default Sidebar