import React from 'react'
import Sidebar from '@/components/ui/shared/Sidebar'
import MobileNav from '@/components/ui/shared/MobileNav'

const layout = ({children} : {children:React.ReactNode}) => {
  return (
    <main className='root'>
      <Sidebar />
      <MobileNav />
        <div className="root-container">
            <div className="wrapper">
                {children}
            </div>
        </div>   
    </main>
  )
}

export default layout