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
      <div className={`${styles.section}`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 space-y-3 md:space-y-0">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src="https://sdmntprwestus.oaiusercontent.com/files/00000000-d23c-6230-9d9f-e7e2c6e72a0b/raw?se=2025-07-12T04%3A32%3A42Z&sp=r&sv=2024-08-04&sr=b&scid=c7e51fbd-98fd-5624-aa08-f8ccc6cb9dcf&skoid=ea0c7534-f237-4ccd-b7ea-766c4ed977ad&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-07-12T00%3A33%3A14Z&ske=2025-07-13T00%3A33%3A14Z&sks=b&skv=2024-08-04&sig=iEpQTzXcv4iHzA0rZDw%2Bom7wz1SQxSZlrppy1IVxreA%3D"
              alt="QuickCart Logo"
              className="h-[100px] object-contain"
            />
          </Link>

          {/* Search Bar */}
          <div className="w-full md:w-[50%] relative">
            <input
              type="text"
              placeholder="Search Product..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="h-[42px] w-full px-3 pr-10 border border-black rounded-md text-black"
            />
            <AiOutlineSearch
              size={22}
              className="absolute right-3 top-2.5 text-black cursor-pointer"
            />
            {searchData && searchData.length > 0 && (
              <div className="absolute bg-white shadow z-[999] w-full mt-1 max-h-[300px] overflow-y-auto p-2">
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

          {/* Seller CTA */}
          <div className="w-full md:w-auto">
            <Link to={isSeller ? "/dashboard" : "/shop-create"}>
              <div className="bg-black text-white px-4 py-2 rounded hover:opacity-90 transition text-center">
                <h1 className="flex items-center justify-center text-sm md:text-base">
                  {isSeller ? "Go to Dashboard" : "Become Seller"}{" "}
                  <IoIosArrowForward className="ml-1" />
                </h1>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Sticky Navigation Bar */}
      <div
        className={`w-full bg-black h-[60px] z-50 transition ${
          active ? "fixed top-0 left-0 shadow-sm" : "relative"
        }`}
      >
        <div className={`${styles.section} flex items-center justify-between`}>
          {/* Mobile Menu */}
          <div className="block lg:hidden">
            <div
              className="cursor-pointer"
              onClick={() => setDropDown(!dropDown)}
            >
              <BiMenuAltLeft size={30} color="white" />
            </div>
          </div>

          {/* Categories Dropdown */}
          <div className="hidden lg:block relative">
            <div
              onClick={() => setDropDownVisible(!dropDownVisible)}
              className="h-[48px] w-[240px] flex items-center bg-white pl-10 pr-3 rounded-t-md cursor-pointer relative"
            >
              <BiMenuAltLeft size={25} className="absolute left-2 top-2.5 text-black" />
              <span className="text-sm font-medium text-black">
                All Categories
              </span>
              <IoIosArrowDown size={16} className="ml-auto text-black" />
            </div>
            {dropDownVisible && (
              <div className="absolute top-full left-0 z-50 bg-white w-full shadow">
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
          <div className="flex items-center space-x-4">
            {/* Wishlist */}
            <div
              className="relative cursor-pointer"
              onClick={() => setOpenWishlist(true)}
            >
              <AiOutlineHeart size={22} color="white" />
              <span className="absolute -top-1 -right-1 bg-white text-black text-xs w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist?.length}
              </span>
            </div>

            {/* Cart */}
            <div
              className="relative cursor-pointer"
              onClick={() => setOpenCart(true)}
            >
              <AiOutlineShoppingCart size={22} color="white" />
              <span className="absolute -top-1 -right-1 bg-white text-black text-xs w-4 h-4 rounded-full flex items-center justify-center">
                {cart?.length}
              </span>
            </div>

            {/* Profile */}
            <div className="cursor-pointer">
              {isAuthenticated ? (
                <Link to="/profile">
                  <img
                    src={user?.avatar?.url || "/default-avatar.png"}
                    className="w-[36px] h-[36px] rounded-full object-cover border border-white"
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
