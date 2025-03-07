import React from 'react'
import { MdMenu } from "react-icons/md";
import { FaUser } from "react-icons/fa";  
import { FaBell } from "react-icons/fa"; 
import { BsThreeDotsVertical } from "react-icons/bs"; 


const Header = () => {
  return (

<div className="bg-gray-950 text-white mt-5 mx-4 rounded-2xl border border-white-600">
  <div className="flex justify-between py-3 items-center">

    {/* Left Section */}
    <div className="flex items-center flex-1 ml-5">
      <MdMenu size={35} className="px-1 rounded-lg border border-white-600 w-12" />
      <span className="text-xl font-bold ml-20">Home</span>
    </div>

    {/* Center Section - Stays Centered */}
    <div className="text-3xl font-bold px-5 rounded-2xl border border-white-600">
      <span>NextDesk</span>
    </div>

    {/* Right Section */}
    <div className="flex items-center gap-12 flex-1 justify-end mr-5">
      <div className="flex items-center gap-2 mr-10">
        <FaUser size={30} className="px-1 py-1 rounded-2xl border border-white-600 " />
        <span className="text-l">User</span>
      </div>

      <FaBell size={28}/>
      <BsThreeDotsVertical size={30} />
    </div>

  </div>
</div>


  )
}

export default Header

