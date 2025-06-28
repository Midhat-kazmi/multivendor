import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Header from '../components/Layout/Header';
import styles from '../styles/styles';
import ProfileSidebar from '../components/Profile/ProfileSidebar';
import ProfileContent from '../components/Profile/ProfileContent';

const ProfilePage = () => {
  const [active, setActive] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useSelector((state) => state.user);

  return (
    <div>
      <Header />
      <div className={`${styles.section} bg-[#f5f5f5] py-10`}>
        {/* Mobile toggle button */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="px-4 py-2 bg-white shadow rounded"
          >
            {sidebarOpen ? 'Hide Menu' : 'Show Menu'}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Sidebar - always visible on md+, toggle on mobile */}
          <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block w-full md:w-[335px]`}>
            <ProfileSidebar active={active} setActive={setActive} />
          </div>

          {/* Profile Content */}
          <div className="w-full">
            <ProfileContent active={active} user={user} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
