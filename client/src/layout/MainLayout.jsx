import Navbar from '@/components/Navbar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <Outlet/>
    </div>
  )
}

export default MainLayout