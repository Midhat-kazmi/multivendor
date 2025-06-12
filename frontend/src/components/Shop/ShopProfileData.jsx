import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getAllProductsShop } from "../../redux/actions/product";
import styles from "../../styles/styles";
import ProductCard from "../Route/ProductCard/ProductCard";
import { getAllEventsShop } from "../../redux/actions/event";

const ShopProfileData = ({ isOwner }) => {
  const { products } = useSelector((state) => state.products);
  const { events } = useSelector((state) => state.events);
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProductsShop(id));
    dispatch(getAllEventsShop(id));
  }, [dispatch, id]);

  const [active, setActive] = useState(1);
  const allReviews = products && products.map((product) => product.reviews).flat();

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <div className="w-full flex">
          <h5
            className={`font-[600] text-[20px] cursor-pointer pr-[20px] ${active === 1 ? "text-red-500" : "text-[#333]"}`}
            onClick={() => setActive(1)}
          >
            Shop Products
          </h5>
          <h5
            className={`font-[600] text-[20px] cursor-pointer pr-[20px] ${active === 2 ? "text-red-500" : "text-[#333]"}`}
            onClick={() => setActive(2)}
          >
            Running Events
          </h5>
          <h5
            className={`font-[600] text-[20px] cursor-pointer pr-[20px] ${active === 3 ? "text-red-500" : "text-[#333]"}`}
            onClick={() => setActive(3)}
          >
            Shop Reviews
          </h5>
        </div>
        {isOwner && (
          <Link to="/dashboard">
            <div className={`${styles.button} !rounded-[4px] h-[42px]`}>
              <span className="text-[#fff]">Go Dashboard</span>
            </div>
          </Link>
        )}
      </div>

      <br />

      {active === 1 && (
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-12">
          {products &&
            products.map((product, index) => (
              <ProductCard data={product} key={index} isShop={true} />
            ))}
        </div>
      )}

      {active === 2 && (
        <div className="w-full">
          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-12">
            {events &&
              events.map((event, index) => (
                <ProductCard data={event} key={index} isShop={true} isEvent={true} />
              ))}
          </div>
          {events && events.length === 0 && (
            <h5 className="w-full text-center py-5 text-[18px]">
              No Events have for this shop!
            </h5>
          )}
        </div>
      )}

      {active === 3 && (
        <div className="w-full">
          {allReviews &&
            allReviews.map((item, index) => (
              <div key={index} className="w-full flex my-4">
                <img
                  src={item.user.avatar?.url}
                  className="w-[50px] h-[50px] rounded-full"
                  alt="user avatar"
                />
                <div className="pl-2">
                  <h5 className="font-[500]">{item.user.name}</h5>
                  <Ratings rating={item.rating} />
                  <p>{item.comment}</p>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ShopProfileData;
