import React from 'react'

//Layouts always export some children within them
const layout = ({children} : {children:React.ReactNode}) => {
  return (
    <main className='auth'>{children}</main>
  )
}

export default layout