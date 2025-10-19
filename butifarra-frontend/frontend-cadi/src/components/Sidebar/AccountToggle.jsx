import purpleLogo from '../../assets/purple-logo.png'; 

import React, { useState, useEffect } from "react"
import { useRole } from "../Sidebar/RoleContext";



export const AccountToggle = () => {
    const role = useRole();
  return (
        <div className="border-b mt-2 mb-4 pb-4 border-stone-300">

            <button className='ml-6  flex hover:bg-stone-200 rounded transition-colors relative gap-2 w-full items-center'>
                <img className='size-8' src={purpleLogo} alt="sidebar-logo" />
                <div className='text-start mt-0'>
                     <span className='text-[24px]  font-bold block sidebar-logo-color leading-none'>ICESI</span>
                     <span className='text-[24px] font-bold block sidebar-logo-color  leading-6'>Bienestar</span>
                </div>
            </button> 
                <div className='pt-2'>
                     <span>{role || "Cargando rol "}</span>
                </div>   
        </div>
  ) 
}
