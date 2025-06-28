import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Header from "../components/Layout/Header";
import Hero from "../components/Route/Hero/Hero";
import Categories from "../components/Route/Categories/Categories";
import BestDeals from "../components/Route/BestDeals/BestDeals";
import FeaturedProduct from "../components/Route/FeaturedProducts/FeaturedProducts";
import Events from "../components/Route/Events/Events";
import Sponsored from "../components/Route/Sponsored";
import Footer from "../components/Layout/Footer";
import { getAllProducts } from "../redux/actions/product";
import useMediaQuery from '@mui/material/useMediaQuery';

const HomePage = () => {
  const dispatch = useDispatch();
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  return (
    <div style={{ padding: isMobile ? '0 8px' : '0' }}>
      <Header activeHeading={1} isMobile={isMobile} />
      <Hero isMobile={isMobile} />
      <Categories isMobile={isMobile} />
      <BestDeals isMobile={isMobile} />
      <Events isMobile={isMobile} />
      <FeaturedProduct isMobile={isMobile} />
      <Sponsored isMobile={isMobile} />
      <Footer isMobile={isMobile} />
    </div>
  );
};

export default HomePage;