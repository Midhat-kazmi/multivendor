import React from 'react'
import Header from '../components/Layout/Header';
import Hero from '../components/Hero/Hero';
import Categories from '../components/Route/Categories/Categories';
import BestDeals from '../components/Route/BestDeals/BestDeals';
import FeaturedProducts from '../components/Route/FeaturedProducts/FeaturedProducts';
import Events from '../components/Route/Events/Events';
import Sponsored from "../components/Route/Sponsored.jsx"
import Footer from '../components/Layout/Footer.jsx';


const HomePage = () => {
  return (
    <div>
        <Header activeHeading ={1}/>
        <Hero />
        <Categories />
        <BestDeals />
        <Events/>
        <FeaturedProducts />
        <Sponsored/>  
        <Footer />
        
     </div>
  )
}

export default HomePage