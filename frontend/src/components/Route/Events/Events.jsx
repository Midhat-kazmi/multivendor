import React from 'react';
import styles from '../../../styles/styles';

const Event = () => {
  const product = {
    id: 2,
    category: "Mobile and Tablets",
    name: "Iphone 14 Pro Max 256 GB SSD and 8 GB RAM Silver Colour",
    description:
      "Product details are a crucial part of any eCommerce website or online marketplace. These details help potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help increase sales. Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
    image_Url: [
      {
        public_id: "test",
        url: "https://m.media-amazon.com/images/I/31Vle5fVdaL.jpg",
      },
      {
        public_id: "test",
        url: "https://m.media-amazon.com/images/I/31Vle5fVdaL.jpg",
      },
    ],
    shop: {
      name: "Amazon Ltd",
      shop_avatar: {
        public_id: "test",
        url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
      },
      ratings: 4.2,
    },
    discount_price: 1099,
    rating: 5,
    total_sell: 80,
    stock: 10,
  };

  return (
    <div className={`${styles.section} bg-gray-100 py-12`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-8">
          {/* Product Image */}
          <div className="flex-shrink-0">
            <img
              src={product.image_Url[0].url}
              alt={product.name}
              className="w-full h-80 object-contain rounded-lg shadow-lg"
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col md:flex-1 space-y-4">
            <h2 className="text-3xl font-bold text-gray-800">{product.name}</h2>
            <div className="flex items-center space-x-2">
              <img
                src={product.shop.shop_avatar.url}
                alt={product.shop.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="text-lg font-semibold text-gray-700">{product.shop.name}</p>
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-500">
                    {'★'.repeat(Math.round(product.shop.ratings))}
                  </span>
                  <span className="text-gray-500">({product.shop.ratings} ratings)</span>
                </div>
              </div>
            </div>

            <p className="text-gray-600">{product.description}</p>

            <div className="flex items-center space-x-4">
              <span className="text-2xl font-semibold text-gray-800">
                ${product.discount_price}
              </span>
              <span className="text-xl line-through text-gray-500">
                ${product.discount_price + 200} {/* Assuming original price is $200 more */}
              </span>
            </div>

            <div className="flex items-center space-x-4 mt-4">
              <span className="text-sm text-gray-600">In Stock: {product.stock}</span>
              <span className="text-sm text-gray-600">Total Sold: {product.total_sell}</span>
            </div>

            <div className="mt-4">
              <button className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Event;
