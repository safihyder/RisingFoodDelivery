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
    <div>
      <Carousele />
      <MultiCarousel url={'/item'} items={items} title="Top Items" />
      <MultiCarousel url={'/restaurant'} title="Top Restaurants" items={restaurants} />
      <div className='pngDelivery' style={{ height: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><img src={image} style={{ width: '100%', height: '500px' }} alt="" /></div>
    </div>
  )
}
export default Home;