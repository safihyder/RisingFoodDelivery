import React from 'react'
import { useState } from 'react'
import Carousele from '../../components/Carousel/Carousel'
import MultiCarousel from '../../components/multiCarousel/MultiCarousel'
import image from "/Images/pngDelivery.png"
import AppwriteitemService from '../../appwrite/itemsconfig'
import AppwriteResService from '../../appwrite/config'
import { Query } from 'appwrite'
const Home = () => {
  const [items, setItems] = useState(null)
  const [restaurants, setRestaurants] = useState(null)
  React.useEffect(() => {
    AppwriteitemService.getItems([Query.limit(10)])
      .then((data) => {
        data = data.documents?.map((item) => {
          return {
            ...item,
            image: AppwriteitemService.getFilePreview(item.image)
          }
        })
        setItems(data)
      })
    AppwriteResService.getRestaurants()
      .then((data) => {
        data = data.documents?.map((item) => {
          return {
            ...item,
            image: AppwriteResService.getFilePreview(item.image)
          }
        })
        setRestaurants(data)
      }
      )
  }, [])

  console.log(restaurants)
  return (
    <div className="mt-2 sm:mt-3 md:mt-4">
      <Carousele />
      <MultiCarousel url={'/item'} items={items} title="Top Items" />
      <MultiCarousel url={'/restaurant'} title="Top Restaurants" items={restaurants} />
      <div className="flex items-center justify-center">
        <img src={image} className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-contain" alt="Delivery illustration" />
      </div>
    </div>
  )
}
export default Home;