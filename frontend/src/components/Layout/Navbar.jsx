import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { navItems } from "../../static/data";
import axios from "axios";
import { server } from "../../server";

const Navbar = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${server}/user/get-user`, {
          withCredentials: true,
        });

        const userData = response.data.user;
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } catch (err) {
        setError(
          err.response ? err.response.data.message : "An error occurred"
        );
      }
    };

    fetchUserData();
  }, []);

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <nav className="flex items-center gap-6 text-base font-medium bg-[#FFF0F2] px-4 py-2 rounded-full shadow-sm border border-[#FADADD]">
      {navItems.map((item) => {
        const isActive = location.pathname === item.url;

        return (
          <Link
            key={item.id}
            to={item.url}
            className={`relative px-3 py-1 rounded-full transition duration-150 ease-in-out
              ${
                isActive
                  ? "bg-[#FADADD] text-[#E75480] font-semibold"
                  : "text-[#E75480] hover:bg-[#FADADD] hover:text-[#E75480]"
              }
            `}
          >
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
};

export default Navbar;