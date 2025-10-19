import React from 'react';
import { Link } from 'react-router-dom';
import logoutIcon from '../../assets/icons/logout-icon.png';

export const Logout = () => {
  return (
    <div className="pl-[16px] pt-90 w-full">
      <Link
        to="/login"
        className="flex items-center gap-2 p-2 rounded transition-colors hover:bg-red-300  shadow-none w- te"
      >
        <img src={logoutIcon} alt="Cerrar sesión" className="w-5 h-5" />
        <span className="text-base font-medium block">Cerrar sesión</span>
      </Link>
    </div>
  );
};
