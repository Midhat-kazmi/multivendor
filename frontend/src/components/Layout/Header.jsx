import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { categoriesData } from "../../static/data";
import {
  AiOutlineHeart,
  AiOutlineSearch,
  AiOutlineShoppingCart,
} from "react-icons/ai";
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

  // Sticky effect (optional)
  const [active, setActive] = useState(false);
  useEffect(() => {
    const scrollHandler = () => setActive(window.scrollY > 70);
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, []);

  return (
    <>
      <header className={`w-full bg-[#FFF0F2] border-b border-[#FADADD] ${active ? "fixed top-0 left-0 shadow" : ""} z-50`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
          {/* Left: Navigation Links */}
          <nav className="flex items-center space-x-6">
            <Link to="/" className="font-semibold text-[#E75480] hover:text-[#c13c6a] text-lg">
              Home
            </Link>
            <Link to="/shop" className="font-medium text-gray-700 hover:text-[#E75480]">
              Shop
            </Link>
            <Link to="/products" className="font-medium text-gray-700 hover:text-[#E75480]">
              New Arrivals
            </Link>
            <Link to="/sale" className="font-medium text-gray-700 hover:text-[#E75480]">
              Sale
            </Link>
          </nav>

          {/* Center: Search Bar */}
          <div className="relative flex-1 mx-8 max-w-xl">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full h-11 pl-5 pr-12 rounded-full bg-[#FADADD] text-black placeholder:text-[#E75480] border-none focus:ring-2 focus:ring-[#E75480] shadow"
            />
            <AiOutlineSearch
              size={22}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#E75480] cursor-pointer"
            />
            {searchData && searchData.length > 0 && (
              <div className="absolute left-0 right-0 bg-white shadow z-[999] mt-2 max-h-[300px] overflow-y-auto p-2 rounded-lg border border-[#FADADD]">
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

          {/* Right: Icons */}
          <div className="flex items-center space-x-4">
            {/* Wishlist */}
            <button
              className="relative p-2 rounded-full hover:bg-[#FADADD] transition"
              onClick={() => setOpenWishlist(true)}
            >
              <AiOutlineHeart size={22} color="#E75480" />
              <span className="absolute -top-1 -right-1 bg-[#FADADD] text-[#E75480] text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold border border-[#E75480]">
                {wishlist?.length}
              </span>
            </button>
            {/* Cart */}
            <button
              className="relative p-2 rounded-full hover:bg-[#FADADD] transition"
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
              <div className="bg-[#E75480] text-white px-4 py-2 rounded-full hover:bg-[#FADADD] hover:text-[#E75480] transition text-center shadow font-bold text-sm flex items-center justify-center ml-2">
                {isSeller ? "Dashboard" : "Become Seller"}
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Popups */}
      {openCart && <Cart setOpenCart={setOpenCart} />}
      {openWishlist && <Wishlist setOpenWishlist={setOpenWishlist} />}
    </>
  );
};

export default Header;