import React from 'react'
import { useState } from 'react'
import MultiCarousel from '../../components/multiCarousel/MultiCarousel'
import Hero from '../../components/Hero/Hero'
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

  return (
    <div>
      <Hero />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-xl py-12">
        <MultiCarousel url={'/item'} items={items} title="Top Items" />
        <MultiCarousel url={'/restaurant'} title="Top Restaurants" items={restaurants} />
        <div className="flex items-center justify-center mt-16">
          <img src={image} className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-contain" alt="Delivery illustration" />
        </div>
      </div>
    </div>
  )
}

export default Home;