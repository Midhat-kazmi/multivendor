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
      <div className={`${styles.section} py-0 bg-[#FADADD]`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-0 md:gap-8 pt-6 pb-2">
          {/* Logo */}
          <Link to="/" className="flex items-center min-h-[120px]">
            <img
              src=""
              alt="QuickCart Logo"
              className="h-[140px] md:h-[160px] w-auto object-contain transition-all duration-300"
              style={{ maxWidth: "340px" }}
            />
          </Link>

          {/* Search Bar */}
          <div className="w-full md:w-[50%] relative flex items-center justify-center">
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
          <div className="w-full md:w-auto flex justify-center md:justify-end">
            <Link to={isSeller ? "/dashboard" : "/shop-create"}>
              <div className="bg-[#E75480] text-white px-6 py-3 rounded-lg hover:bg-[#FADADD] transition text-center shadow">
                <h1 className="flex items-center justify-center text-base md:text-lg font-semibold">
                  {isSeller ? "Go to Dashboard" : "Become Seller"}{" "}
                  <IoIosArrowForward className="ml-2" />
                </h1>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Sticky Navigation Bar */}
      <div
        className={`w-full bg-[#E75480] h-[64px] z-50 transition ${
          active ? "fixed top-0 left-0 shadow-lg" : "relative"
        }`}
      >
        <div className={`${styles.section} flex items-center justify-between h-full`}>
          {/* Mobile Menu */}
          <div className="block lg:hidden">
            <div
              className="cursor-pointer"
              onClick={() => setDropDown(!dropDown)}
            >
              <BiMenuAltLeft size={32} color="#FFF0F2" />
            </div>
          </div>

          {/* Categories Dropdown */}
          <div className="hidden lg:block relative">
            <div
              onClick={() => setDropDownVisible(!dropDownVisible)}
              className="h-[52px] w-[260px] flex items-center bg-[#FFF0F2] pl-12 pr-4 rounded-t-lg cursor-pointer relative shadow"
            >
              <BiMenuAltLeft size={28} className="absolute left-3 top-3 text-[#E75480]" />
              <span className="text-base font-medium text-[#E75480]">
                All Categories
              </span>
              <IoIosArrowDown size={18} className="ml-auto text-[#E75480]" />
            </div>
            {dropDownVisible && (
              <div className="absolute top-full left-0 z-50 bg-[#FFF0F2] w-full shadow rounded-b-lg">
                <DropDown
                  categoriesData={categoriesData}
                  setDropDown={setDropDownVisible}
                />
              </div>
            )}
          </div>

          {/* Mobile Dropdown */}
          {dropDown && (
            <div className="lg:hidden absolute top-[64px] left-0 z-40 w-full bg-[#FFF0F2] shadow-md rounded-b-lg">
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
          <div className="flex items-center space-x-6">
            {/* Wishlist */}
            <div
              className="relative cursor-pointer"
              onClick={() => setOpenWishlist(true)}
            >
              <AiOutlineHeart size={26} color="#FFF0F2" />
              <span className="absolute -top-2 -right-2 bg-[#FFF0F2] text-[#E75480] text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold border border-[#E75480]">
                {wishlist?.length}
              </span>
            </div>

            {/* Cart */}
            <div
              className="relative cursor-pointer"
              onClick={() => setOpenCart(true)}
            >
              <AiOutlineShoppingCart size={26} color="#FFF0F2" />
              <span className="absolute -top-2 -right-2 bg-[#FFF0F2] text-[#E75480] text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold border border-[#E75480]">
                {cart?.length}
              </span>
            </div>

            {/* Profile */}
            <div className="cursor-pointer">
              {isAuthenticated ? (
                <Link to="/profile">
                  <img
                    src={user?.avatar?.url || "/default-avatar.png"}
                    className="w-[40px] h-[40px] rounded-full object-cover border-2 border-[#FFF0F2]"
                    alt="User Avatar"
                  />
                </Link>
              ) : (
                <Link to="/login">
                  <CgProfile size={26} color="#FFF0F2" />
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