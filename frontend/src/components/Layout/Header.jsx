import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { categoriesData } from "../../static/data";
import {
  AiOutlineHeart,
  AiOutlineSearch,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { BiMenuAltLeft } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import DropDown from "./Dropdown";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import Cart from "../Cart/Cart";
import Wishlist from "../Wishlist/Wishlist";

const LOGO_URL =
  "https://res.cloudinary.com/dgve6ewpr/image/upload/v1752370095/bfdf69bf-b02a-44ad-bb0d-8475856940bd-fotor-bg-remover-2025071362557_rrm0n5.png";

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
      {/* Header */}
      <header
        className={`w-full bg-[#FFDDE1] border-b z-50 ${
          active ? "fixed top-0 left-0 shadow-md" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 flex-wrap md:flex-nowrap gap-4">
          {/* Logo */}
          <Link to="/" className="min-w-[100px]">
            <img
              src={LOGO_URL}
              alt="Shopora Logo"
              className="h-20 object-contain max-w-[220px]"
            />
          </Link>

          {/* Search Bar */}
          <div className="flex-grow w-full md:w-auto relative">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full h-11 pl-5 pr-10 rounded-full bg-white text-black placeholder:text-gray-500 border border-gray-300 focus:ring-2 focus:ring-[#E75480] shadow-sm"
            />
            <AiOutlineSearch
              size={20}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#E75480] cursor-pointer"
            />
            {searchData && searchData.length > 0 && (
              <div className="absolute left-0 right-0 bg-white shadow z-[999] mt-2 max-h-[300px] overflow-y-auto p-2 rounded-lg border border-gray-200">
                {searchData.map((item, index) => (
                  <Link to={`/product/${item._id}`} key={index}>
                    <div className="flex items-center py-2 hover:bg-[#FADADD] rounded px-2">
                      <img
                        src={item.images[0]?.url || "/no-image.png"}
                        alt={item.name}
                        className="w-[36px] h-[36px] mr-3 object-cover rounded"
                      />
                      <h1 className="text-sm text-black">{item.name}</h1>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Wishlist */}
            <button
              className="relative p-2 rounded-full hover:bg-[#f9e3e6] transition"
              onClick={() => setOpenWishlist(true)}
            >
              <AiOutlineHeart size={22} color="#E75480" />
              <span className="absolute -top-1 -right-1 bg-[#FADADD] text-[#E75480] text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold border border-[#E75480]">
                {wishlist?.length}
              </span>
            </button>

            {/* Cart */}
            <button
              className="relative p-2 rounded-full hover:bg-[#f9e3e6] transition"
              onClick={() => setOpenCart(true)}
            >
              <AiOutlineShoppingCart size={22} color="#E75480" />
              <span className="absolute -top-1 -right-1 bg-[#FADADD] text-[#E75480] text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold border border-[#E75480]">
                {cart?.length}
              </span>
            </button>

            {/* Profile */}
            <div className="cursor-pointer">
              {isAuthenticated ? (
                <Link to="/profile">
                  <img
                    src={user?.avatar?.url || "/default-avatar.png"}
                    className="w-[36px] h-[36px] rounded-full object-cover border-2 border-[#FADADD]"
                    alt="User Avatar"
                  />
                </Link>
              ) : (
                <Link to="/login">
                  <CgProfile size={22} color="#E75480" />
                </Link>
              )}
            </div>

            {/* Seller Button */}
            <Link to={isSeller ? "/dashboard" : "/shop-create"}>
              <div className="bg-[#E75480] text-white px-4 py-2 rounded-full hover:bg-white hover:text-[#E75480] border border-[#E75480] transition font-semibold text-xs">
                {isSeller ? "Dashboard" : "Become Seller"}
              </div>
            </Link>

            {/* Mobile Menu */}
            <div className="block md:hidden">
              <button
                className="bg-[#FADADD] p-2 rounded-full"
                onClick={() => setDropDown(!dropDown)}
              >
                <BiMenuAltLeft size={22} color="#E75480" />
              </button>
              {dropDown && (
                <div className="absolute top-[60px] right-2 z-40 w-60 bg-white shadow-md rounded-b-lg border">
                  <DropDown
                    categoriesData={categoriesData}
                    setDropDown={setDropDown}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Row */}
      <section className="w-full bg-[#FFDDE1] border-t border-[#E75480] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center">
          {/* Categories Button */}
          <div className="hidden md:flex items-center">
            <button
              onClick={() => setDropDownVisible(!dropDownVisible)}
              className="flex items-center bg-[#FFF0F2] text-[#E75480] px-5 py-2 rounded-full font-semibold shadow-sm hover:bg-[#FFEFF1] transition"
            >
              <BiMenuAltLeft size={22} className="mr-2" />
              Categories
            </button>
            {dropDownVisible && (
              <div className="absolute top-[100%] left-6 z-50">
                <DropDown
                  categoriesData={categoriesData}
                  setDropDown={setDropDownVisible}
                />
              </div>
            )}
          </div>

          {/* Navbar Links */}
          <div className="flex-1 w-full">
            <Navbar active={activeHeading} />
          </div>
        </div>
      </section>

      {/* Popups */}
      {openCart && <Cart setOpenCart={setOpenCart} />}
      {openWishlist && <Wishlist setOpenWishlist={setOpenWishlist} />}
    </>
  );
};

export default Header;
