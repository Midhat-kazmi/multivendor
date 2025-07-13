import React from "react";
import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillYoutube,
  AiOutlineTwitter,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import {
  footercompanyLinks,
  footerProductLinks,
  footerSupportLinks,
} from "../../static/data";

const Footer = () => {
  return (
    <div className="bg-white text-[#333]">
      {/* Subscribe Section */}
      <div className="md:flex md:justify-between md:items-center px-4 sm:px-12 bg-[#FFF0F2] py-8 border-b border-[#FADADD]">
        <h1 className="text-2xl lg:text-4xl font-semibold md:w-2/5 leading-snug mb-4 md:mb-0 text-center md:text-left">
          <span className="text-[#E75480]">Subscribe</span> to get news, events, and offers
        </h1>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-[50%]">
          <input
            type="email"
            required
            placeholder="Enter your email..."
            className="w-full sm:w-[60%] px-4 py-2 rounded-md border border-[#FADADD] focus:ring-2 focus:ring-[#E75480] text-[#333] outline-none"
          />
          <button className="bg-[#E75480] hover:bg-[#fa97ac] duration-300 px-6 py-2.5 rounded-md text-white font-medium w-full sm:w-auto">
            Submit
          </button>
        </div>
      </div>

      {/* Links & Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6 sm:px-12 py-16">
        {/* Logo & Social */}
        <div className="text-center sm:text-left">
          <img
            src="https://res.cloudinary.com/dgve6ewpr/image/upload/v1752370095/bfdf69bf-b02a-44ad-bb0d-8475856940bd-fotor-bg-remover-2025071362557_rrm0n5.png"
            alt="QuickCart Logo"
            className="h-[60px] mx-auto sm:mx-0 mb-4"
          />
          <p className="text-gray-600 text-sm">
            The home and elements needed to create beautiful products.
          </p>
          <div className="flex items-center justify-center sm:justify-start mt-4 space-x-4">
            <AiFillFacebook size={24} className="hover:text-[#E75480] cursor-pointer" />
            <AiOutlineTwitter size={24} className="hover:text-[#E75480] cursor-pointer" />
            <AiFillInstagram size={24} className="hover:text-[#E75480] cursor-pointer" />
            <AiFillYoutube size={24} className="hover:text-[#E75480] cursor-pointer" />
          </div>
        </div>

        {/* Company */}
        <div className="text-center sm:text-left">
          <h2 className="font-semibold mb-4 text-[#E75480]">Company</h2>
          <ul>
            {footerProductLinks.map((link, index) => (
              <li key={index} className="mb-2">
                <Link
                  to={link.link}
                  className="text-gray-600 text-sm hover:text-[#E75480] transition"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Shop */}
        <div className="text-center sm:text-left">
          <h2 className="font-semibold mb-4 text-[#E75480]">Shop</h2>
          <ul>
            {footercompanyLinks.map((link, index) => (
              <li key={index} className="mb-2">
                <Link
                  to={link.link}
                  className="text-gray-600 text-sm hover:text-[#E75480] transition"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div className="text-center sm:text-left">
          <h2 className="font-semibold mb-4 text-[#E75480]">Support</h2>
          <ul>
            {footerSupportLinks.map((link, index) => (
              <li key={index} className="mb-2">
                <Link
                  to={link.link}
                  className="text-gray-600 text-sm hover:text-[#E75480] transition"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-[#FADADD] px-6 sm:px-12 py-6 text-center text-sm text-gray-500 bg-[#FFF0F2]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-center">
          <span>© {new Date().getFullYear()} Shopora.Made by Midhat.</span>
          <span className="text-xs">Terms · Privacy Policy</span>
          <div className="flex justify-center sm:justify-end">
            <img
              src="https://hamart-shop.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ffooter-payment.a37c49ac.png&w=640&q=75"
              alt="Payment Methods"
              className="h-8 object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
