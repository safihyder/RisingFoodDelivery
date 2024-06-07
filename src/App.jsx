import './App.css'
import {
  Routes,
  Route,
} from "react-router-dom";
import Home from './screens/Home/Home';
import Loginuser from './screens/LoginUser/Loginuser';
import SignupUser from './screens/SignUpUser/SignupUser';
import Orderselection from './screens/OrderSelection/Orderselection';
import AddRestaurant from './screens/AddRestaurant/AddRestaurant';
import ErrorPage from './screens/ErrorPage/ErrorPage';
import AddFoodItem from './screens/AddFoodItem/AddFoodItem';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/signupuser' element={<SignupUser/>}/>
        <Route path='/loginuser' element={<Loginuser/>}/>
        <Route path='/selection' element={<Orderselection/>}/>
        <Route path='/addrestaurant' element={<AddRestaurant/>}/>
        <Route path='/*' element={<ErrorPage/>}/>
        <Route path='/addfoodItem' element={<AddFoodItem/>}/>
      </Routes>
    </>
  )
}

export default App
