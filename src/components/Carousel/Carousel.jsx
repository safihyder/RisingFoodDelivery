import React from 'react'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-carousel-minimal';
import "./Carousel.css"
// const captionStyle = {
//     fontSize: '2em',
//     fontWeight: 'bold',
//   }
  const slideNumberStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
  }
const data = [
    {
      image: "/Images/car1.png",
    },
    {
      image: "/Images/car2.png",
    },
    {
      image: "/Images/car3.png",
    },
  ];
const Carousele = () => {
  return (
    <div className='carContainer'>
   <Carousel
   autoplay="true"
   data={data}
   time={4000}
   width="100vw"
   height="90vh"
   // captionStyle={captionStyle}
   radius="10px"
   slideNumberStyle={slideNumberStyle}
   captionPosition="bottom"
   automatic={true}
   pauseIconColor="white"
   pauseIconSize="40px"
   slideBackgroundColor="transparent"
   slideImageFit="cover"
   >
</Carousel>
       </div>
  )
}

export default Carousele;