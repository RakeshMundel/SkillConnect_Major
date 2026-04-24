import React from 'react'
import './Home.css'
import TrustSection from '../Components/TrustSection/TrustSection';
import Professionals from '../Components/Professionals/Professionals';
import Category from '../Components/Category/Category';
const Home = () => {
  return (
    <div className='home'>
      <div className="home-shell">
        <TrustSection/>
        <Category/>
        <Professionals/>
      </div>
    </div>
  )
}

export default Home
