import React from 'react'
import logo from '../assets/logo-excel.png'
import { useNavigate } from 'react-router-dom'

export const Navbar = () => {
   const navigate = useNavigate()
  return (
        <div className="header-logo">
              <img onClick={()=>navigate('/')} src={logo} alt="SheetSavvy Logo" />
              <span>Sheet<span className="highlight">Savvy</span></span>
       </div>
  )
}
