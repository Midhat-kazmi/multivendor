import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { categoriesData } from "../../static/data";
import {
  AiOutlineHeart,
  AiOutlineSearch,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { BiMenuAltLeft } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import DropDown from "./Dropdown";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import Cart from "../Cart/Cart";
import Wishlist from "../Wishlist/Wishlist";

const Header = ({ activeHeading }) => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { isSeller } = useSelector((state) => state.seller);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const { allProducts } = useSelector((state) => state.products);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState(null);
  const [active, setActive] = useState(false);
  const [dropDownVisible, setDropDownVisible] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [openWishlist, setOpenWishlist] = useState(false);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    const filtered = allProducts?.filter((p) =>
      p.name.toLowerCase().includes(term.toLowerCase())
    );
    setSearchData(filtered);
  };

  useEffect(() => {
    const scrollHandler = () => setActive(window.scrollY > 70);
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, []);

  return (
    <>
      {/* Top Header */}
      <div className="w-full bg-[#FADADD] py-0">
        <div className="max-w-none w-full flex flex-col md:flex-row md:items-center justify-between px-0 md:px-0 gap-0 md:gap-8 pt-6 pb-2">
          {/* Search Bar */}
          <div className="w-full md:w-[50%] relative flex items-center justify-center px-4 md:px-12">
            <input
              type="text"
              placeholder="Search Product..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="h-[48px] w-full px-4 pr-12 border border-[#FADADD] rounded-lg text-black shadow focus:outline-none focus:border-[#FFF0F2] bg-[#FFF0F2]"
            />
            <AiOutlineSearch
              size={26}
              className="absolute right-5 top-3 text-[#E75480] cursor-pointer"
            />
            {searchData && searchData.length > 0 && (
              <div className="absolute bg-[#FFF0F2] shadow z-[999] w-full mt-2 max-h-[300px] overflow-y-auto p-2 rounded-lg border border-[#FADADD]">
                {searchData.map((item, index) => (
                  <Link to={`/product/${item._id}`} key={index}>
                    <div className="flex items-center py-2 hover:bg-[#FADADD] rounded px-2">
                      <img
                        src={item.images[0]?.url || "/no-image.png"}
                        alt={item.name}
                        className="w-[40px] h-[40px] mr-3 object-cover rounded"
                      />
                      <h1 className="text-sm text-black">{item.name}</h1>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Seller Button */}
          <div className="w-full md:w-auto flex justify-center md:justify-end px-4 md:px-12 mt-4 md:mt-0">
            <Link to={isSeller ? "/dashboard" : "/shop-create"}>
              <div className="bg-[#E75480] text-white px-6 py-3 rounded-full hover:bg-[#FADADD] transition text-center shadow-lg font-bold text-base flex items-center justify-center">
                {isSeller ? "Go to Dashboard" : "Become Seller"}
                <IoIosArrowForward className="ml-2" />
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Modern Navbar */}
      <nav
        className={`w-full bg-[#FFF0F2] h-[70px] z-50 transition ${
          active ? "fixed top-0 left-0 shadow-lg" : "relative"
        } flex items-center`}
        style={{ borderBottom: "2px solid #FADADD" }}
      >
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between px-4 md:px-12 h-full">
          {/* Left: Categories Dropdown */}
          <div className="hidden lg:flex items-center relative">
            <button
              onClick={() => setDropDownVisible(!dropDownVisible)}
              className="flex items-center bg-[#FADADD] text-[#E75480] px-5 py-2 rounded-full font-semibold shadow hover:bg-[#FFF0F2] transition"
            >
              <BiMenuAltLeft size={24} className="mr-2" />
              All Categories
              <IoIosArrowDown size={16} className="ml-2" />
            </button>
            {dropDownVisible && (
              <div className="absolute top-full left-0 z-50 bg-[#FFF0F2] w-[220px] shadow rounded-lg mt-2">
                <DropDown
                  categoriesData={categoriesData}
                  setDropDown={setDropDownVisible}
                />
              </div>
            )}
          </div>

          {/* Center: Navbar Links */}
          <div className="flex-1 flex justify-center">
            <Navbar active={activeHeading} />
          </div>

          {/* Right: Icons */}
          <div className="flex items-center space-x-6">
            {/* Wishlist */}
            <div
              className="relative cursor-pointer"
              onClick={() => setOpenWishlist(true)}
            >
              <AiOutlineHeart size={26} color="#E75480" />
              <span className="absolute -top-2 -right-2 bg-[#FADADD] text-[#E75480] text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold border border-[#E75480]">
                {wishlist?.length}
              </span>
            </div>

            {/* Cart */}
            <div
              className="relative cursor-pointer"
              onClick={() => setOpenCart(true)}
            >
              <AiOutlineShoppingCart size={26} color="#E75480" />
              <span className="absolute -top-2 -right-2 bg-[#FADADD] text-[#E75480] text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold border border-[#E75480]">
                {cart?.length}
              </span>
            </div>

            {/* Profile */}
            <div className="cursor-pointer">
              {isAuthenticated ? (
                <Link to="/profile">
                  <img
                    src={user?.avatar?.url || "/default-avatar.png"}
                    className="w-[40px] h-[40px] rounded-full object-cover border-2 border-[#FADADD]"
                    alt="User Avatar"
                  />
                </Link>
              ) : (
                <Link to="/login">
                  <CgProfile size={26} color="#E75480" />
                </Link>
              )}
            </div>
          </div>

          {/* Mobile: Hamburger */}
          <div className="block lg:hidden ml-4">
            <button
              className="bg-[#FADADD] p-2 rounded-full"
              onClick={() => setDropDown(!dropDown)}
            >
              <BiMenuAltLeft size={28} color="#E75480" />
            </button>
            {dropDown && (
              <div className="absolute top-[70px] left-0 z-40 w-full bg-[#FFF0F2] shadow-md rounded-b-lg">
                <DropDown
                  categoriesData={categoriesData}
                  setDropDown={setDropDown}
                />
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Popups */}
      {openCart && <Cart setOpenCart={setOpenCart} />}
      {openWishlist && <Wishlist setOpenWishlist={setOpenWishlist} />}
    </>
  );
};

export default Header;