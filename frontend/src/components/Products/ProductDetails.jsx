import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/styles';

const ProductDetails = ({ data }) => {
  const [select, setSelect] = useState(0);
  const [tab, setTab] = useState('details');
  const navigate = useNavigate();

  if (!data) return null;

  // Check if relatedProducts is available and is an array
  const relatedProducts = Array.isArray(data.relatedProducts) ? data.relatedProducts : [];

  // Add the current product to the related products list if it's not already there
  if (!relatedProducts.some(product => product.id === data.id)) {
    relatedProducts.unshift(data);  // Adds the current product at the beginning of the array
  }

  return (
    <div className="bg-white">
      <div className={`${styles.section} w-[90%] 800px:w-[80%] min-h-screen py-8`}>
        <div className="w-full py-5">
          <div className="block w-full 800px:flex">
            {/* Left: Image Gallery */}
            <div className="w-full 800px:w-[40%] flex flex-col items-center">
              <div className="flex gap-4 overflow-x-auto">
                {data?.image_Url?.map((image, idx) => (
                  <div
                    key={image?.url || idx}
                    className={`cursor-pointer ${select === idx ? "border-2 border-blue-500" : ""} hover:border-2 hover:border-gray-400 p-1`}
                    onClick={() => setSelect(idx)}
                  >
                    <img
                      src={image?.url}
                      alt={`Product ${idx}`}
                      className="w-[100px] h-[100px] object-contain rounded-md transition-all duration-200 ease-in-out"
                    />
                  </div>
                ))}
              </div>
              {/* Large Image */}
              <div className="mt-4">
                <img
                  src={data?.image_Url?.[select]?.url}
                  alt="Selected"
                  className="w-full max-h-[600px] object-contain border border-gray-200 rounded-md"
                />
              </div>
            </div>

            {/* Right: Product Info */}
            <div className="w-full 800px:w-[60%] p-6 space-y-6">
              <h2 className="text-3xl font-semibold text-gray-800">{data.name}</h2>
              <p className="text-lg text-gray-600">{data.description}</p>
              <p className="text-2xl font-semibold text-green-600">{data.price}</p>

              {/* Add more details like color, size, etc. */}
              <div className="flex flex-col space-y-3">
                <div className="flex items-center gap-4">
                  <label className="font-medium text-gray-700">Color:</label>
                  <span className="text-gray-800">{data.color || "N/A"}</span>
                </div>
                <div className="flex items-center gap-4">
                  <label className="font-medium text-gray-700">Storage:</label>
                  <span className="text-gray-800">{data.storage || "N/A"}</span>
                </div>
                <div className="flex items-center gap-4">
                  <label className="font-medium text-gray-700">Warranty:</label>
                  <span className="text-gray-800">{data.warranty || "N/A"}</span>
                </div>
              </div>

              {/* Shop Logo and Ratings */}
              <div className="flex items-center gap-4 mt-4">
                <img
                  src={data?.shop?.shop_avatar?.url}
                  alt="Shop Logo"
                  className="w-[50px] h-[50px] object-contain rounded-full"
                />
                <div>
                  <p className="text-sm text-gray-500">Shop: {data?.shop?.name}</p>
                  <div className="flex items-center">
                    <span className="text-yellow-500">{'★'.repeat(Math.round(data?.shop?.ratings))}</span>
                    <span className="text-sm text-gray-600 ml-2">({data?.shop?.ratings}/5)</span>
                  </div>
                </div>
              </div>

              {/* Add to Cart and Buy Now buttons */}
              <div className="flex gap-4">
                <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all">
                  Add to Cart
                </button>
                <button className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all">
                  Buy Now
                </button>
              </div>
            </div>
          </div>

          {/* Tab Navigation for Product Details, Reviews, and Seller Info */}
          <div className="mt-8 flex gap-4">
            <button
              onClick={() => setTab('details')}
              className={`px-6 py-2 ${tab === 'details' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-lg`}
            >
              Product Details
            </button>
            <button
              onClick={() => setTab('reviews')}
              className={`px-6 py-2 ${tab === 'reviews' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-lg`}
            >
              Product Reviews
            </button>
            <button
              onClick={() => setTab('seller')}
              className={`px-6 py-2 ${tab === 'seller' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-lg`}
            >
              Seller Information
            </button>
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {tab === 'details' && (
              <div className="text-lg text-gray-600">
                <p>{data?.description || "No detailed description available."}</p>
              </div>
            )}
            {tab === 'reviews' && (
              <div className="text-lg text-gray-600">
                <p>No reviews available for this product.</p>
              </div>
            )}
            {tab === 'seller' && (
              <div className="text-lg text-gray-600">
                <p>Seller: {data?.shop?.name}</p>
                <p>Ratings: {data?.shop?.ratings}/5</p>
                <p>Location: {data?.shop?.location || 'N/A'}</p>
              </div>
            )}
          </div>

          {/* Related Products Section */}
          <div className="mt-12">
            <h3 className="text-xl font-semibold mb-4">Related Products</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {/* Check if relatedProducts has data */}
              {relatedProducts.length > 0 ? (
                relatedProducts.map((product, index) => (
                  <div key={index} className="p-4 border rounded shadow-sm">
                    <img
                      src={product.image_Url[0].url}
                      alt={product.name}
                      className="w-full h-auto object-contain rounded mb-3"
                    />
                    <h4 className="text-lg font-semibold">{product.name}</h4>
                    <p className="text-gray-600">${product.discount_price}</p>
                  </div>
                ))
              ) : (
                <p>No related products available.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
