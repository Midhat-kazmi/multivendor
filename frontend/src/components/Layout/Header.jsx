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
      <div className={`${styles.section} py-2 bg-white`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-y-4 md:gap-y-0">
          {/* Logo */}
          <Link to="/" className="flex items-center justify-center md:justify-start">
            <img
              src="https://res.cloudinary.com/dgve6ewpr/image/upload/v1752295853/file-1746084849270-390129813_oeyefc.png"
              alt="QuickCart Logo"
              className="h-[100px] w-auto object-contain"
              style={{ maxWidth: "300px" }}
            />
          </Link>

          {/* Search Bar */}
          <div className="w-full md:w-[50%] relative">
            <input
              type="text"
              placeholder="Search Product..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="h-[48px] w-full px-4 pr-12 border border-gray-400 rounded-md text-black focus:outline-none"
            />
            <AiOutlineSearch
              size={22}
              className="absolute right-4 top-[13px] text-black cursor-pointer"
            />
            {searchData && searchData.length > 0 && (
              <div className="absolute bg-white shadow z-[999] w-full mt-2 max-h-[300px] overflow-y-auto p-2 rounded-md border border-gray-200">
                {searchData.map((item, index) => (
                  <Link to={`/product/${item._id}`} key={index}>
                    <div className="flex items-center py-2 hover:bg-gray-100 rounded px-2">
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
          <div className="w-full md:w-auto flex justify-center md:justify-end">
            <Link to={isSeller ? "/dashboard" : "/shop-create"}>
              <div className="bg-black text-white px-5 py-3 rounded-md hover:bg-gray-900 transition-all text-sm md:text-base font-medium flex items-center justify-center">
                {isSeller ? "Go to Dashboard" : "Become Seller"}
                <IoIosArrowForward className="ml-2" />
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Sticky Navigation Bar */}
      <div
        className={`w-full bg-black h-[60px] z-50 transition-all ${
          active ? "fixed top-0 left-0 shadow-md" : "relative"
        }`}
      >
        <div className={`${styles.section} flex items-center justify-between h-full`}>
          {/* Mobile Menu */}
          <div className="block lg:hidden">
            <div
              className="cursor-pointer"
              onClick={() => setDropDown(!dropDown)}
            >
              <BiMenuAltLeft size={30} color="white" />
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="hidden lg:block relative">
            <div
              onClick={() => setDropDownVisible(!dropDownVisible)}
              className="h-[45px] w-[240px] flex items-center bg-white pl-10 pr-4 rounded-t-md cursor-pointer relative"
            >
              <BiMenuAltLeft
                size={24}
                className="absolute left-3 top-2 text-black"
              />
              <span className="text-sm font-medium text-black">
                All Categories
              </span>
              <IoIosArrowDown size={16} className="ml-auto text-black" />
            </div>
            {dropDownVisible && (
              <div className="absolute top-full left-0 z-50 bg-white w-full shadow rounded-b-md">
                <DropDown
                  categoriesData={categoriesData}
                  setDropDown={setDropDownVisible}
                />
              </div>
            )}
          </div>

          {/* Mobile Dropdown */}
          {dropDown && (
            <div className="lg:hidden absolute top-[60px] left-0 z-40 w-full bg-white shadow-md">
              <DropDown
                categoriesData={categoriesData}
                setDropDown={setDropDown}
              />
            </div>
          )}

          {/* Navbar Links */}
          <div className="hidden lg:block">
            <Navbar active={activeHeading} />
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-5">
            {/* Wishlist */}
            <div
              className="relative cursor-pointer"
              onClick={() => setOpenWishlist(true)}
            >
              <AiOutlineHeart size={22} color="white" />
              <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                {wishlist?.length}
              </span>
            </div>

            {/* Cart */}
            <div
              className="relative cursor-pointer"
              onClick={() => setOpenCart(true)}
            >
              <AiOutlineShoppingCart size={22} color="white" />
              <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                {cart?.length}
              </span>
            </div>

            {/* Profile */}
            <div className="cursor-pointer">
              {isAuthenticated ? (
                <Link to="/profile">
                  <img
                    src={user?.avatar?.url || "/default-avatar.png"}
                    className="w-[36px] h-[36px] rounded-full object-cover border-2 border-white"
                    alt="User Avatar"
                  />
                </Link>
              ) : (
                <Link to="/login">
                  <CgProfile size={22} color="white" />
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
