import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // ✅ Add this
import {
  FaUser,
  FaBoxOpen,
  FaHeart,
  FaSignOutAlt,
  FaEnvelope,
  FaMoneyCheckAlt,
  FaMapMarkedAlt,
  FaUndoAlt,
  FaSearchLocation,
  FaBars,
  FaTimes,
} from 'react-icons/fa';

const menuItems = [
  { id: 1, label: 'My Account', icon: <FaUser /> },
  { id: 2, label: 'Orders', icon: <FaBoxOpen /> },
  { id: 3, label: 'Wishlist', icon: <FaHeart /> },
  { id: 4, label: 'Inbox', icon: <FaEnvelope /> },
  { id: 5, label: 'Refunds', icon: <FaUndoAlt /> },
  { id: 6, label: 'Track Order', icon: <FaSearchLocation /> },
  { id: 7, label: 'Payment Methods', icon: <FaMoneyCheckAlt /> },
  { id: 8, label: 'Address', icon: <FaMapMarkedAlt /> },
];

const ProfileSidebar = ({ active, setActive }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleItemClick = (id) => {
    setActive(id);
    setIsOpen(false); // close menu on mobile after selection
  };

  return (
    <div className="w-full sm:w-[250px] bg-white rounded-lg shadow-md mb-4 sm:mb-0 sm:mr-6">
      {/* Mobile menu button */}
      <div className="sm:hidden flex justify-between items-center p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Menu</h2>
        <button onClick={handleToggle} className="text-gray-700 focus:outline-none">
          {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Sidebar menu */}
      <ul className={`sm:block ${isOpen ? 'block' : 'hidden'} sm:mt-0 mt-2`}>
        {menuItems.map((item) => (
          <li
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            className={`flex items-center gap-3 py-2 px-4 cursor-pointer transition hover:bg-gray-100 ${
              active === item.id ? 'bg-blue-100 font-semibold text-blue-600' : 'text-gray-700'
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </li>
        ))}

        <Link to="/login">
          <li className="flex items-center gap-3 py-2 px-4 text-red-600 cursor-pointer hover:bg-red-100 transition">
            <FaSignOutAlt />
            <span>Log out</span>
          </li>
        </Link>
      </ul>
    </div>
  );
};

export default ProfileSidebar;
