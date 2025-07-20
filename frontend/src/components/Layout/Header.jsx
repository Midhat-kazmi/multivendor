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
      {/* Header - Top */}
      <header
        className={`w-full bg-white z-50 ${
          active ? "fixed top-0 left-0 shadow-md" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between flex-wrap gap-4 h-auto md:h-14">
            {/* Logo */}
            <Link
              to="/"
              className="text-2xl sm:text-3xl font-extrabold tracking-tight text-pink-500 font-[Poppins] lowercase"
            >
              shopora
            </Link>

            {/* Search Input - visible on md+ */}
            <div className="w-full max-w-xl relative hidden md:block">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full h-11 pl-5 pr-10 rounded-full bg-gray-100 text-black placeholder:text-gray-500 border border-gray-300 focus:ring-2 focus:ring-pink-400 shadow-sm"
              />
              <AiOutlineSearch
                size={20}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-500 cursor-pointer"
              />
              {searchData && searchData.length > 0 && (
                <div className="absolute left-0 right-0 bg-white shadow z-[999] mt-2 max-h-[300px] overflow-y-auto p-2 rounded-lg border border-gray-200">
                  {searchData.map((item, index) => (
                    <Link to={`/product/${item._id}`} key={index}>
                      <div className="flex items-center py-2 hover:bg-pink-100 rounded px-2">
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

            {/* Mobile Search Icon */}
            <div className="block md:hidden">
              <AiOutlineSearch
                size={22}
                className="text-pink-500 cursor-pointer"
                onClick={() => alert("Implement mobile search modal")}
              />
            </div>

            {/* Action Icons */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Wishlist */}
              <button
                className="relative p-2 rounded-full hover:bg-gray-100 transition"
                onClick={() => setOpenWishlist(true)}
              >
                <AiOutlineHeart size={22} color="#E75480" />
                <span className="absolute -top-1 -right-1 bg-pink-100 text-pink-600 text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold border border-pink-500">
                  {wishlist?.length}
                </span>
              </button>

              {/* Cart */}
              <button
                className="relative p-2 rounded-full hover:bg-gray-100 transition"
                onClick={() => setOpenCart(true)}
              >
                <AiOutlineShoppingCart size={22} color="#E75480" />
                <span className="absolute -top-1 -right-1 bg-pink-100 text-pink-600 text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold border border-pink-500">
                  {cart?.length}
                </span>
              </button>

              {/* Profile */}
              <div className="cursor-pointer">
                {isAuthenticated ? (
                  <Link to="/profile">
                    <img
                      src={user?.avatar?.url || "/default-avatar.png"}
                      className="w-[36px] h-[36px] rounded-full object-cover border-2 border-pink-200"
                      alt="User Avatar"
                    />
                  </Link>
                ) : (
                  <Link to="/login">
                    <CgProfile size={22} color="#E75480" />
                  </Link>
                )}
              </div>

              {/* Seller */}
              <Link to={isSeller ? "/dashboard" : "/shop-create"}>
                <div className="bg-pink-500 text-white px-4 py-2 rounded-full hover:bg-pink-600 transition font-semibold text-xs">
                  {isSeller ? "Shop Dashboard" : "Become Seller"}
                </div>
              </Link>

              {/* Mobile Menu */}
              <div className="block lg:hidden relative">
                <button
                  className="bg-pink-100 p-2 rounded-full"
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
        </div>
      </header>

      {/* Navigation Row */}
      <section className="w-full bg-white border-t border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-4">
          {/* Categories - Desktop only */}
          <div className="hidden lg:flex items-center relative">
            <button
              onClick={() => setDropDownVisible(!dropDownVisible)}
              className="flex items-center text-pink-600 px-4 py-2 font-semibold hover:text-pink-700 transition"
            >
              <BiMenuAltLeft size={22} className="mr-2" />
              Categories
            </button>
            {dropDownVisible && (
              <div className="absolute top-[110%] left-0 z-50 bg-white shadow-md rounded-md border p-4">
                <DropDown
                  categoriesData={categoriesData}
                  setDropDown={setDropDownVisible}
                />
              </div>
            )}
          </div>

          {/* Navbar Links */}
<div className="flex-1 flex justify-center">
            <Navbar active={activeHeading} noRounded />
          </div>
        </div>
      </section>

      {/* Modals */}
      {openCart && <Cart setOpenCart={setOpenCart} />}
      {openWishlist && <Wishlist setOpenWishlist={setOpenWishlist} />}
    </>
  );
};

export default Header;
