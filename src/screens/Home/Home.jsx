import React from 'react'
import Carousele from '../../components/Carousel/Carousel'
import MultiCarousel from '../../components/multiCarousel/MultiCarousel'
import Navbar from '../../components/navbar/Navbar'
import Fotor from '../../components/Fotor/Fotor'

const Home = () => {
  return (
    <div>
      <Navbar position="absolute" />
      <Carousele />
      <MultiCarousel title="Top Foods" />
      <MultiCarousel title="Top Sites" />
      <Fotor />
    </div>
  )
}
export default Home;