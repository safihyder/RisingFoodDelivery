import { useState, useEffect } from 'react';
import { Query } from 'appwrite';
import './App.css'
import {
  Outlet,
  useLocation,
} from "react-router-dom";
import AuthService from "./appwrite/auth"
import AppwriteResService from './appwrite/config';
import AppwriteItemService from './appwrite/itemsconfig'
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from './store/authSlice'
import Fotor from './components/Fotor/Fotor';
import Navbar from './components/navbar/Navbar';
import { restaurants } from './store/restSlice';
import { item } from './store/itemSlice';
import Loading from './components/Loading';
import Items from './screens/Items/Items';

function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()
  const location = useLocation()
  const items = useSelector((state) => state.item.items)

  useEffect(() => {
    AuthService.getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login({ userData }))
        } else {
          dispatch(logout())
        }
      }).finally(() => setLoading(false))
    AppwriteResService.getRestaurants([Query.limit(20)])
      .then((restData) => {
        if (restData) {
          console.log(restData)
          dispatch(restaurants({ restaurant: restData }))
        } else {
          dispatch(restaurants([]))
        }
      })
    AppwriteItemService.getItems()
      .then((itemData) => {
        if (itemData) {
          console.log(itemData)
          dispatch(item({ items: itemData }))
        }
      })
  }, [])

  const renderContent = () => {
    if (location.pathname === '/items') {
      return <Items items={items} />
    }
    return <Outlet />
  }

  return !loading ? (
    <>
      <Navbar />
      {renderContent()}
      <Fotor />
    </>
  )
    : <Loading />
}

export default App
