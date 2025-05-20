import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  AiOutlineSearch,
  AiOutlineHeart,
  AiOutlineShoppingCart,
  AiOutlineUser,
} from "react-icons/ai";
import { productData } from "../../static/data";
import Dropdown from "./Dropdown";
import Navbar from "./Navbar";
import Cart from "../Cart/Cart";
import Wishlist from "../Wishlist/Wishlist";
import { server } from "../../server";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [user, setUser] = useState(null);
  const [openCart, setOpenCart] = useState(false);
  const [openWishlist, setOpenWishlist] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
    console.log("User avatar", user?.avatar?.url);
    console.log("User", user);
    console.log("storedUser", storedUser);
  }, []);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim()) {
      const filteredProducts = productData.filter((product) =>
        product.name.toLowerCase().includes(term.toLowerCase())
      );
      setSearchData(filteredProducts);
    } else {
      setSearchData([]);
    }
  };

  return (
    <div className="w-full shadow-sm sticky top-0 left-0 z-50 bg-white">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row items-center justify-between px-4 py-2 bg-white gap-2">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <img
            src="https://shopo.quomodothemes.website/assets/images/logo.svg"
            alt="logo"
            className="w-[120px] h-[40px] object-contain"
          />
        </Link>

        {/* Search bar */}
        <div className="w-full md:w-[500px] relative">
          <div
            className={`h-[40px] rounded-md flex items-center justify-between px-2 border ${
              isFocused ? "border-blue-500" : "border-gray-300"
            }`}
          >
            <input
              type="text"
              placeholder="Search Product..."
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              className="h-[40px] w-full px-2 outline-none text-sm"
            />
            <AiOutlineSearch size={20} className="text-gray-500" />
          </div>

          {searchTerm && searchData.length > 0 && (
            <div className="absolute min-h-[30vh] max-h-[50vh] overflow-y-auto bg-white shadow z-50 p-4 w-full rounded">
              {searchData.map((item, index) => (
                <Link
                  key={index}
                  to={`/product/${item.name.replace(/\s+/g, "_")}`}
                  className="block text-sm py-1 text-gray-700 hover:text-blue-600"
                >
                  <div className="w-full flex items-center py-2 border-b">
                    <img
                      src={item.image_Url[0].url}
                      alt={item.name}
                      className="w-[50px] h-[50px] object-contain mr-3"
                    />
                    <h1>{item.name}</h1>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Become a Seller */}
        <Link
          to="/shop-create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm md:text-base transition"
        >
          Become a Seller
        </Link>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-2 bg-blue-600 text-white gap-2">
        <Dropdown />
        <Navbar />
        <div className="flex items-center gap-4 sm:gap-6 text-lg sm:text-xl relative">
          {/* Wishlist Icon */}
          <div
            className="relative cursor-pointer"
            onClick={() => setOpenWishlist(true)}
          >
            <AiOutlineHeart />
            <span className="absolute -top-2 -right-2 text-xs bg-red-600 text-white w-4 h-4 rounded-full flex items-center justify-center">
              2
            </span>
          </div>
          {/* Cart Icon */}
          <div
            className="relative cursor-pointer"
            onClick={() => setOpenCart(true)}
          >
            <AiOutlineShoppingCart />
            <span className="absolute -top-2 -right-2 text-xs bg-red-600 text-white w-4 h-4 rounded-full flex items-center justify-center">
              2
            </span>
          </div>
          {/* User */}
          {user ? (
            <Link to="/profile">
              <img
                src={`${server}${user.avatar.url}`} 
                alt="profile"
                className="w-[30px] h-[30px] sm:w-[35px] sm:h-[35px] rounded-full object-cover border border-white"
              />
            </Link>
          ) : (
            <Link to="/login">
              <AiOutlineUser />
            </Link>
          )}
        </div>
      </div>

      {/* Cart & Wishlist Popups */}
      {openCart && <Cart setOpenCart={setOpenCart} />}
      {openWishlist && <Wishlist setOpenWishlist={setOpenWishlist} />}
    </div>
  );
};

export default Header;
