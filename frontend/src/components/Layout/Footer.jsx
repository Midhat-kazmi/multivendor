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
          <span className="text-pink-500">Subscribe</span> to get news, events,
          and offers
        </h1>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-[50%]">
          <input
            type="email"
            required
            placeholder="Enter your email..."
            className="w-full sm:w-[60%] px-4 py-2 rounded-md border border-[#FADADD] focus:ring-2 focus:ring-[#E75480] text-[#333] outline-none"
          />
          <button className="bg-pink-500 hover:bg-pink-500 duration-300 px-6 py-2.5 rounded-md text-white font-medium w-full sm:w-auto">
            Submit
          </button>
        </div>
      </div>

      {/* Links & Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6 sm:px-12 py-16">
        {/* Logo & Social */}
                  <Link
          to="/"
          className="text-2xl font-extrabold tracking-tight text-pink-500 font-[Poppins] lowercase"
        >
          shopora
        </Link>

        {/* Company */}
        <div className="text-center sm:text-left">
          <h2 className="font-semibold mb-4 text-pink-500">Company</h2>
          <ul>
            {footerProductLinks.map((link, index) => (
              <li key={index} className="mb-2">
                <Link
                  to={link.link}
                  className="text-gray-600 text-sm hover:text-pink-500 transition"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Shop */}
        <div className="text-center sm:text-left">
          <h2 className="font-semibold mb-4 text-pink-500">Shop</h2>
          <ul>
            {footercompanyLinks.map((link, index) => (
              <li key={index} className="mb-2">
                <Link
                  to={link.link}
                  className="text-gray-600 text-sm hover:text-pink-500 transition"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div className="text-center sm:text-left">
          <h2 className="font-semibold mb-4 text-pink-500">Support</h2>
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
          <span>© {new Date().getFullYear()} Shopora.Designed by Midhat.</span>
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
