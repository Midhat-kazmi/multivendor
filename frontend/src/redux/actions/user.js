import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { navItems } from "../../static/data";
import axios from "axios";
import Cookies from "js-cookie"; 
import { server } from "../../server";

const Navbar = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = Cookies.get("token");

    if (token) {
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
    }
  }, []);

  if (error && Cookies.get("token")) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <nav className="flex items-center gap-6 text-base font-medium">
      {navItems.map((item) => {
        const isActive = location.pathname === item.url;

        return (
          <Link
            key={item.id}
            to={item.url}
            className={`relative pb-1 transition duration-150 ease-in-out
              ${
                isActive
                  ? "text-[#E75480] font-semibold border-b-2 border-[#E75480]"
                  : "text-gray-700 hover:text-[#E75480] hover:border-b-2 hover:border-[#E75480]"
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
