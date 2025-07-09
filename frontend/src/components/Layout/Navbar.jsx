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
        console.log("Navbar", userData);

        // Save full user object in localStorage (not just the name)
        localStorage.setItem("user", JSON.stringify(userData));
      } catch (err) {
        setError(
          err.response ? err.response.data.message : "An error occurred"
        );
      }
    };

    fetchUserData();
  }, []);

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex items-center gap-6 text-sm font-medium">
      {/* Navigation Links */}
      {navItems.map((item) => (
        <Link
          key={item.id}
          to={item.url}
          className={`hover:text-yellow-400 transition ${
            location.pathname === item.url ? "text-yellow-400" : "text-white"
          }`}
        >
          {item.title}
        </Link>
      ))}
    </div>
  );
};

export default Navbar;
