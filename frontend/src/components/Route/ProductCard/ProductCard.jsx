import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AiFillStar,
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineEye,
  AiOutlineShoppingCart,
  AiOutlineClose,
} from 'react-icons/ai';
import ProductDetailsCard from '../ProductDetailsCard/ProductDetailCard';
import styles from "../../../styles/styles";

const ProductCard = ({ data }) => {
  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);
  const d = data.name;
  const product_name = d.replace(/ /g, "-");

  return (
    <>
      <div className='w-full h-[370px] bg-white rounded-lg shadow-sm p-3 relative cursor-pointer'>
        {/* Vertical Icons */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-3 items-center">
          <AiOutlineEye
            className="cursor-pointer"
            size={22}
            onClick={() => setOpen(true)}
            color="#333"
            title="Quick view"
          />
          {click ? (
            <AiFillHeart
              className="cursor-pointer"
              size={22}
              onClick={() => setClick(!click)}
              color="red"
              title="Remove from wishlist"
            />
          ) : (
            <AiOutlineHeart
              className="cursor-pointer"
              size={22}
              onClick={() => setClick(!click)}
              color="#333"
              title="Add to wishlist"
            />
          )}
          <AiOutlineShoppingCart
            size={22}
            className="cursor-pointer"
            onClick={() => setOpen(true)}
            color="#444"
            title="Add to cart"
          />
        </div>

        <Link to={`/product/${product_name}`}>
          <img
            src={data.image_Url[0].url}
            alt={data.name}
            className='w-full h-[170px] object-cover rounded-lg'
          />
        </Link>

        <div className='pt-3'>
          <Link to="/">
            <h5 className='text-sm text-gray-500'>{data.shop.name}</h5>
          </Link>

          <Link to={`/product/${product_name}`}>
            <h4 className='pb-3 font-[500] text-base'>
              {data.name.length > 40 ? data.name.slice(0, 40) + '...' : data.name}
            </h4>
          </Link>

          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <AiFillStar key={i} className="mr-2 cursor-pointer" size={20} color="#F6BA00" />
            ))}
          </div>

          <div className='py-2 flex justify-between items-center'>
            <div className='flex'>
              <h5 className={`${styles.productDiscountPrice}`}>
                {data.price === 0 ? data.price : data.discount_price}$
              </h5>
              <h4 className={`${styles.price}`}>
                {data.price ? data.price + "$" : null}
              </h4>
            </div>
            <span className="font-[400] text-[17px] text-[#68d284]">
              {data.total_sell} sold
            </span>
          </div>
        </div>
      </div>

      {/* Popup Modal */}
      {open && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 z-50 flex justify-center items-center">
          <div className="w-[90%] max-w-[900px] bg-white rounded-lg p-5 shadow-lg relative overflow-y-auto max-h-[90vh]">
            <AiOutlineClose
              size={25}
              className="absolute top-3 right-3 cursor-pointer"
              onClick={() => setOpen(false)}
              title="Close"
            />
            <ProductDetailsCard data={data} setOpen={setOpen} />
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
