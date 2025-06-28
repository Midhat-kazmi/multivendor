import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/styles";
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
import Cart from "../cart/Cart";
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
  const [DropDown, setDropdown] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [openWishlist, setOpenWishlist] = useState(false);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    const filteredProducts = allProducts?.filter((product) =>
      product.name.toLowerCase().includes(term.toLowerCase())
    );
    setSearchData(filteredProducts);
  };

  useEffect(() => {
    const handleScroll = () => {
      setActive(window.scrollY > 70);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top Header */}
      <div className={`${styles.section}`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 space-y-3 md:space-y-0">
          {/* Logo */}
          <div>
            <Link to="/">
              <img
                src="https://shopo.quomodothemes.website/assets/images/logo.svg"
                alt="Shopo Logo"
                className="h-[40px]"
              />
            </Link>
          </div>

          {/* Search Bar */}
          <div className="w-full md:w-[50%] relative">
            <input
              type="text"
              placeholder="Search Product..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="h-[38px] w-full px-3 pr-10 border-2 border-[#3957db] rounded-md"
            />
            <AiOutlineSearch
              size={22}
              className="absolute right-3 top-[9px] text-gray-600 cursor-pointer"
            />
            {searchData && searchData.length !== 0 && (
              <div className="absolute bg-white shadow z-[999] w-full mt-1 max-h-[300px] overflow-y-auto p-2">
                {searchData.map((item, index) => (
                  <Link to={`/product/${item._id}`} key={index}>
                    <div className="flex items-center py-2">
                      <img
                        src={item.images[0]?.url}
                        alt=""
                        className="w-[40px] h-[40px] mr-3"
                      />
                      <h1 className="text-sm">{item.name}</h1>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Seller Button */}
          <div className="w-full md:w-auto">
            <Link to={isSeller ? "/dashboard" : "/shop-create"}>
              <div className={styles.button + " flex justify-center"}>
                <h1 className="text-white flex items-center text-sm md:text-base">
                  {isSeller ? "Go to Dashboard" : "Become Seller"}{" "}
                  <IoIosArrowForward className="ml-1" />
                </h1>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div
        className={`w-full bg-[#3321c8] h-[60px] z-50 transition ${
          active ? "fixed top-0 left-0 shadow-sm" : "relative"
        }`}
      >
        <div className={`${styles.section} flex items-center justify-between`}>
          {/* Hamburger (Mobile) */}
          <div className="block lg:hidden">
            <div
              className="cursor-pointer"
              onClick={() => setDropdown(!dropDown)}
            >
              <BiMenuAltLeft size={30} color="white" />
            </div>
          </div>

          {/* All Categories Dropdown (Desktop Only) */}
          <div className="hidden lg:block relative">
            <div
              onClick={() => setDropdown(!DropDown)}
              className="h-[48px] w-[240px] flex items-center bg-white pl-10 pr-3 rounded-t-md cursor-pointer relative"
            >
              <BiMenuAltLeft size={25} className="absolute left-2 top-2.5" />
              <span className="text-sm font-medium">All Categories</span>
              <IoIosArrowDown size={16} className="ml-auto" />
            </div>
            {DropDown && (
              <div className="absolute top-full left-0 z-50 bg-white w-full shadow">
                <DropDown categoriesData={categoriesData} setDropdown={setDropdown} />
              </div>
            )}
          </div>

          {/* DropDown for Mobile */}
          {dropDown && (
            <div className="lg:hidden absolute top-[60px] left-0 z-40 w-full bg-white shadow-md">
              <DropDown categoriesData={categoriesData} setDropDown={setDropdown} />
            </div>
          )}

          {/* Navbar Links */}
          <div className="hidden lg:block">
            <Navbar active={activeHeading} />
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            {/* Wishlist */}
            <div
              className="relative cursor-pointer"
              onClick={() => setOpenWishlist(true)}
            >
              <AiOutlineHeart size={24} color="white" />
              <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist?.length}
              </span>
            </div>

            {/* Cart */}
            <div
              className="relative cursor-pointer"
              onClick={() => setOpenCart(true)}
            >
              <AiOutlineShoppingCart size={24} color="white" />
              <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                {cart?.length}
              </span>
            </div>

            {/* Profile */}
            <div className="cursor-pointer">
              {isAuthenticated ? (
                <Link to="/profile">
                  <img
                    src={user?.avatar?.url}
                    className="w-[40px] h-[40px] rounded-full object-cover"
                    alt="User avatar"
                  />
                </Link>
              ) : (
                <Link to="/login">
                  <CgProfile size={24} color="white" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Popups */}
      {openCart && <Cart setOpenCart={setOpenCart} />}
      {openWishlist && <Wishlist setOpenWishlist={setOpenWishlist} />}
    </>
  );
};

export default Header;
