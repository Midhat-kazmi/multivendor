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
    <div className="bg-black text-white">
      {/* Subscribe Section */}
      <div className="md:flex md:justify-between md:items-center px-4 sm:px-12 bg-gray-900 py-8">
        <h1 className="text-3xl lg:text-4xl font-semibold md:w-2/5 leading-snug mb-4 md:mb-0 text-center md:text-left">
          <span className="text-[#56d879]">Subscribe</span> to get news, events, and offers
        </h1>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-[50%]">
          <input
            type="email"
            required
            placeholder="Enter your email..."
            className="w-full sm:w-[60%] px-4 py-2 rounded-md text-white outline-none"
          />
          <button className="bg-[#56d879] hover:bg-teal-500 duration-300 px-6 py-2.5 rounded-md text-white font-medium w-full sm:w-auto">
            Submit
          </button>
        </div>
      </div>

      {/* Links & Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6 sm:px-12 py-16">
        {/* Logo & Social */}
        <div className="text-center sm:text-left">
          <img
            src="https://res.cloudinary.com/dgve6ewpr/image/upload/v1752295853/file-1746084849270-390129813_oeyefc.png"
            alt="QuickCart Logo"
            className="h-[60px] mx-auto sm:mx-0 mb-4"
            style={{ filter: "brightness(0) invert(1)" }}
          />
          <p className="text-gray-400 text-sm">
            The home and elements needed to create beautiful products.
          </p>
          <div className="flex items-center justify-center sm:justify-start mt-4 space-x-4">
            <AiFillFacebook size={24} className="hover:text-[#56d879] cursor-pointer" />
            <AiOutlineTwitter size={24} className="hover:text-[#56d879] cursor-pointer" />
            <AiFillInstagram size={24} className="hover:text-[#56d879] cursor-pointer" />
            <AiFillYoutube size={24} className="hover:text-[#56d879] cursor-pointer" />
          </div>
        </div>

        {/* Company */}
        <div className="text-center sm:text-left">
          <h2 className="font-semibold mb-4 text-white">Company</h2>
          <ul>
            {footerProductLinks.map((link, index) => (
              <li key={index} className="mb-2">
                <Link
                  to={link.link}
                  className="text-gray-400 text-sm hover:text-[#56d879] transition"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Shop */}
        <div className="text-center sm:text-left">
          <h2 className="font-semibold mb-4 text-white">Shop</h2>
          <ul>
            {footercompanyLinks.map((link, index) => (
              <li key={index} className="mb-2">
                <Link
                  to={link.link}
                  className="text-gray-400 text-sm hover:text-[#56d879] transition"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div className="text-center sm:text-left">
          <h2 className="font-semibold mb-4 text-white">Support</h2>
          <ul>
            {footerSupportLinks.map((link, index) => (
              <li key={index} className="mb-2">
                <Link
                  to={link.link}
                  className="text-gray-400 text-sm hover:text-[#56d879] transition"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-700 px-6 sm:px-12 py-6 text-center text-sm text-gray-400">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-center">
          <span>© {new Date().getFullYear()} QuickCart. All rights reserved.</span>
          <span>Terms · Privacy Policy</span>
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
