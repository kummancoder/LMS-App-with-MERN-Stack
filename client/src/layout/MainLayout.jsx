import Navbar from '@/components/Navbar'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <div className='space-y-20'>
      <Navbar />
      <Outlet/>
    </div>
  )
}

export default MainLayout