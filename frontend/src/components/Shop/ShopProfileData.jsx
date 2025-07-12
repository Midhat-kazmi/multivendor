import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getAllProductsShop } from "../../redux/actions/product";
import styles from "../../styles/styles";
import ProductCard from "../Route/ProductCard/ProductCard";
import Ratings from "../Products/Ratings";
import { getAllEventsShop } from "../../redux/actions/event";

const ShopProfileData = ({ isOwner }) => {
  const { products } = useSelector((state) => state.products);
  const { events } = useSelector((state) => state.events);
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      dispatch(getAllProductsShop(id));
      dispatch(getAllEventsShop(id));
    }
  }, [dispatch, id]);

  const [active, setActive] = useState(1);
  const allReviews = products && products.map((product) => product.reviews).flat();

  if (!id) return <div>Loading...</div>;

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <div className="w-full flex">
          {["Shop Products", "Running Events", "Shop Reviews"].map((label, index) => (
            <div
              key={label}
              className="flex items-center"
              onClick={() => setActive(index + 1)}
            >
              <h5
                className={`font-[600] text-[20px] ${
                  active === index + 1 ? "text-red-500" : "text-[#333]"
                } cursor-pointer pr-[20px]`}
              >
                {label}
              </h5>
            </div>
          ))}
        </div>
        {isOwner && (
          <Link to="/dashboard">
            <div className={`${styles.button} !rounded-[4px] h-[42px]`}>
              <span className="text-[#fff]">Go to Dashboard</span>
            </div>
          </Link>
        )}
      </div>

      <br />
      {active === 1 && (
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-12">
          {products && products.map((i, index) => (
            <ProductCard data={i} key={index} isShop={true} />
          ))}
        </div>
      )}

      {active === 2 && (
        <div className="w-full">
          {events && events.length > 0 ? (
            <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-12">
              {events.map((i, index) => (
                <ProductCard key={index} data={i} isShop={true} isEvent={true} />
              ))}
            </div>
          ) : (
            <h5 className="w-full text-center py-5 text-[18px]">
              No Events for this shop!
            </h5>
          )}
        </div>
      )}

      {active === 3 && (
        <div className="w-full">
          {allReviews && allReviews.length > 0 ? (
            allReviews.map((item, index) => (
              <div key={index} className="w-full flex my-4">
                <img
                  src={item?.user?.avatar?.url || "/default.png"}
                  className="w-[50px] h-[50px] rounded-full"
                  alt=""
                />
                <div className="pl-2">
                  <div className="flex items-center">
                    <h1 className="font-[600] pr-2">{item.user.name}</h1>
                    <Ratings rating={item.rating} />
                  </div>
                  <p className="text-[#000000a7]">{item.comment}</p>
                  <p className="text-[14px] text-[#000000a7]">2 days ago</p>
                </div>
              </div>
            ))
          ) : (
            <h5 className="w-full text-center py-5 text-[18px]">
              No reviews yet!
            </h5>
          )}
        </div>
      )}
    </div>
  );
};

export default ShopProfileData;
