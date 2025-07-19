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
      const tokenExists = document.cookie.includes("user_token"); // Match your backend cookie name

      if (!tokenExists) {
        return;
      }

      try {
        const response = await axios.get(`${server}/user/get-user`, {
          withCredentials: true,
        });

        const userData = response.data.user;
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } catch (err) {
        if (err.response?.status !== 401) {
          setError(err.response?.data?.message || "Something went wrong");
        }
      }
    };

    fetchUserData();
  }, []);

  return (
    <>
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

      {/* Only show real errors, not unauthenticated */}
      {error && user && <p className="text-red-500 text-sm">{error}</p>}
    </>
  );
};

export default Navbar;
