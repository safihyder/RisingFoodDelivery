import React from 'react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import MultiCarousel from '../../components/multiCarousel/MultiCarousel'
import Hero from '../../components/Hero/Hero'
import AppwriteitemService from '../../appwrite/itemsconfig'
import AppwriteResService from '../../appwrite/config'
import { Query } from 'appwrite'

const Home = () => {
  const [items, setItems] = useState(null)
  const [restaurants, setRestaurants] = useState(null)
  const [hoveredFeature, setHoveredFeature] = useState(null)

  const features = [
    {
      icon: "🚀",
      title: "Lightning Fast Delivery",
      description: "Experience the speed of light with our optimized delivery network",
      color: "from-orange-400 to-red-500"
    },
    {
      icon: "🌟",
      title: "Premium Restaurants",
      description: "Partner with top-rated restaurants for the finest dining experience",
      color: "from-blue-400 to-purple-500"
    },
    {
      icon: "💫",
      title: "Real-Time Tracking",
      description: "Track your order in real-time from kitchen to doorstep",
      color: "from-green-400 to-teal-500"
    }
  ]

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const featureVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  return (
    <div>
      <Hero />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-xl py-12">
        <MultiCarousel url={'/items'} items={items} title="Top Items" />


        <MultiCarousel url={'/restaurants'} title="Top Restaurants" items={restaurants} />

        <motion.div
          className="mt-16 space-y-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-3xl font-bold text-center text-gray-800 mb-12"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Why Choose Rising Food Delivery?
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={`relative p-6 rounded-xl bg-gradient-to-br ${feature.color} transform transition-all duration-300 cursor-pointer`}
                variants={featureVariants}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
                onHoverStart={() => setHoveredFeature(index)}
                onHoverEnd={() => setHoveredFeature(null)}
              >
                <div className="absolute inset-0 bg-white opacity-90 rounded-xl" />
                <div className="relative z-10">
                  <motion.div
                    className="text-4xl mb-4"
                    animate={{
                      scale: hoveredFeature === index ? [1, 1.2, 1] : 1,
                      rotate: hoveredFeature === index ? [0, 10, -10, 0] : 0
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent"
                    initial={{ scaleX: 0 }}
                    animate={{
                      scaleX: hoveredFeature === index ? 1 : 0
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Home;