import { Link } from 'react-router-dom';
import notificationIcon from '../../assets/icons/notification-icon.png';
import profileIcon from '../../assets/icons/profile-icon.png';

export const TopBar = () => {
  return (
    <div className="sticky top-0 right-0 z-50">
      <div className="absolute top-4 right-4 flex items-center gap-4">
        <Link
          to="/notifications"
          className="transition-transform duration-200 hover:scale-105 active:scale-95"
        >
          <img
            src={notificationIcon}
            alt="notification"
            className="w-[33px] h-[33px] hover:drop-shadow-md"
            style={{ filter: 'drop-shadow(0 0 4px rgba(160, 120, 255, 0.4))' }}
          />
        </Link>
        <Link
          to="/profile"
          className="transition-transform duration-200 hover:scale-105 active:scale-95"
        >
          <img
            src={profileIcon}
            alt="profile"
            className="w-[33px] h-[33px] hover:drop-shadow-md"
            style={{ filter: 'drop-shadow(0 0 4px rgba(160, 120, 255, 0.4))' }}
          />
        </Link>
      </div>
    </div>
  );
};