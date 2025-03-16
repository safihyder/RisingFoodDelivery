import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './store/store.js'
import './index.css'
import { RouterProvider, createBrowserRouter, ScrollRestoration } from "react-router-dom"
import Home from './screens/Home/Home';
import Loginuser from './screens/LoginUser/Loginuser';
import SignupUser from './screens/SignUpUser/SignupUser';
import Orderselection from './screens/OrderSelection/Orderselection';
import AddRestaurant from './screens/AddRestaurant/AddRestaurant';
import ErrorPage from './screens/ErrorPage/ErrorPage';
import AddFoodItem from './screens/AddFoodItem/AddFoodItem';
import Restaurant from './screens/Restaurant/Restaurant';
import EditRestaurant from './screens/EditRestaurant/EditRestaurant.jsx'
import EditFoodItem from './screens/EditFoodItem/EditFoodItem.jsx'
import Item from './screens/Item/Item.jsx'
import Success from './screens/Payment/Success.jsx'
import PrivacyPolicy from './screens/PrivacyPolicy/PrivacyPolicy.jsx'
import TermsOfService from './screens/TermsOfService/TermsOfService.jsx'
import AboutUs from './screens/AboutUs/AboutUs.jsx'
import FAQ from './screens/FAQ/FAQ.jsx'
import ContactUs from './screens/ContactUs/ContactUs.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <App />
        <ScrollRestoration />
      </>
    ),
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/loginuser",
        element: (
          <Loginuser />
        ),
      },
      {
        path: "/signupuser",
        element: (
          <SignupUser />
        ),
      },
      {
        path: "/selection",
        element: (
          <Orderselection />
        ),
      },
      {
        path: "/addrestaurant",
        element: (
          <AddRestaurant />
        ),
      },
      {
        path: "/restaurant/:slug",
        element: (
          <Restaurant />
        ),
      },
      {
        path: "/*",
        element: <ErrorPage />,
      },
      {
        path: "addfoodItem",
        element: <AddFoodItem />,
      },
      {
        path: "/restaurant",
        element: <Restaurant />,
      },
      {
        path: '/restaurant/edit/:slug',
        element: <EditRestaurant />
      },
      {
        path: '/item/:slug',
        element: <Item />
      },
      {
        path: '/item/edit/:slug',
        element: <EditFoodItem />
      },
      {
        path: '/payment-success',
        element: <Success />
      },
      {
        path: '/about-us',
        element: <AboutUs />
      },
      {
        path: '/faq',
        element: <FAQ />
      },
      {
        path: '/contact-us',
        element: <ContactUs />
      },
      {
        path: '/terms-of-service',
        element: <TermsOfService />
      },
      {
        path: '/privacy-policy',
        element: <PrivacyPolicy />
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}></RouterProvider>
    </Provider>
  </React.StrictMode>,
)
