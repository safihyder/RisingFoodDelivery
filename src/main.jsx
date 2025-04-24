import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './store/store.js'
import './index.css'
import { RouterProvider, createBrowserRouter, ScrollRestoration } from "react-router-dom"
import { Toaster } from 'react-hot-toast'
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
import RestaurantsList from './screens/RestaurantsList/RestaurantsList.jsx'
import Items from './screens/Items/Items.jsx'
import Cookies from './screens/Cookies/Cookies.jsx'
import UserOrders from './screens/UserOrders/UserOrders.jsx'
import DeliveryPartnerRegistration from './screens/DeliveryPartnerRegistration/DeliveryPartnerRegistration.jsx'
import DeliveryPartnerDashboard from './screens/DeliveryPartnerDashboard/DeliveryPartnerDashboard.jsx'
import RestaurantOrders from './screens/RestaurantOrders/RestaurantOrders.jsx'
import AdminDashboard from './screens/Admin/AdminDashboard.jsx'
import { checkAndRequestLocationPermissions } from './utils/PermissionManager'

// Conditionally import Capacitor plugins
let CapacitorPlugins = {
  SplashScreen: null,
  App: null,
  StatusBar: null,
  Geolocation: null
};

// Only initialize Capacitor on native platforms
if (window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()) {
  // Instead of using top-level await, we'll create and immediately invoke an async function
  const loadCapacitorPlugins = async () => {
    try {
      CapacitorPlugins = {
        SplashScreen: (await import('@capacitor/splash-screen')).SplashScreen,
        App: (await import('@capacitor/app')).App,
        StatusBar: (await import('@capacitor/status-bar')).StatusBar,
        Geolocation: (await import('@capacitor/geolocation')).Geolocation
      };

      console.log('Capacitor plugins loaded for native platform');

      // Initialize native settings
      const initializeCapacitor = async () => {
        try {
          // Request geolocation permissions early using our utility
          await checkAndRequestLocationPermissions();

          // Configure status bar to be visible with light content
          if (CapacitorPlugins.StatusBar) {
            // Set status bar style (light text for dark backgrounds, dark text for light backgrounds)
            await CapacitorPlugins.StatusBar.setStyle({ style: 'light' });

            // Make status bar background transparent or a specific color
            if (CapacitorPlugins.StatusBar.setBackgroundColor) {
              await CapacitorPlugins.StatusBar.setBackgroundColor({ color: '#ffffff' });
            }

            // Ensure status bar is visible and doesn't overlay the WebView
            await CapacitorPlugins.StatusBar.setOverlaysWebView({ overlay: false });
            await CapacitorPlugins.StatusBar.show();
          }

          // Hide splash screen with fade
          await CapacitorPlugins.SplashScreen.hide({
            fadeOutDuration: 500
          });

          // Handle Android back button
          CapacitorPlugins.App.addListener('backButton', ({ canGoBack }) => {
            if (!canGoBack) {
              CapacitorPlugins.App.exitApp();
            } else {
              window.history.back();
            }
          });

          console.log('Capacitor initialized successfully');
        } catch (error) {
          console.error('Error initializing Capacitor:', error);
        }
      };

      initializeCapacitor();
    } catch (error) {
      console.error('Failed to load Capacitor plugins:', error);
    }
  };

  // Execute the async function
  loadCapacitorPlugins();
}

// Register the service worker
// registerServiceWorker();

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
        path: "/items",
        element: <Items />,
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
        path: "/restaurants/:slug",
        element: (
          <Restaurant />
        ),
      },
      {
        path: "/restaurants",
        element: <RestaurantsList />,
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
        path: '/items/:slug',
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
        path: '/faqs',
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
      {
        path: '/cookies',
        element: <Cookies />
      },
      {
        path: '/user-orders',
        element: <UserOrders />
      },
      {
        path: '/delivery-partner-registration',
        element: <DeliveryPartnerRegistration />
      },
      {
        path: '/delivery-partner-dashboard',
        element: <DeliveryPartnerDashboard />
      },
      {
        path: '/restaurant-orders/:slug',
        element: <RestaurantOrders />
      },
      {
        path: '/admin',
        element: <AdminDashboard />
      }
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <Toaster position="top-center" reverseOrder={false} />
      <RouterProvider router={router}></RouterProvider>
    </Provider>
  </React.StrictMode>,
)
