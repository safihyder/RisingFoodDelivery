import React from "react";
import { useSelector } from "react-redux";
import "./Cart.css"
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { removeOrder, dropOrders } from "../../store/orderSlice";
import AppwriteOrderService from '../../appwrite/orderconfig'
import { Query } from "appwrite";
const Cart = () => {
  const dispatch = useDispatch();
  const [dbData, setDbData] = React.useState([])
  useEffect(() => {
    AppwriteOrderService.getOrders([Query.equal("email", userEmail)]).then((data) => {
      setDbData(data?.documents[0])
      console.log(dbData?.orderdata)
    })
  }, [])
  const foodData = useSelector(state => state.order.userorder);
  const userEmail = useSelector(state => state.auth.userData.email)
  let totalPrice = foodData.reduce((total, food) => total + food.price, 0);

  // if (dbData) {
  //   console.log(dbData)  
  //   console.log('Order already exists')
  // }
  const handleCheckOut = async (e) => {
    console.log('Check Out')
    e.preventDefault();
    if (dbData) {
      const dborderdata = dbData?.orderdata
      console.log('Order already exists')
      const updatedData = await AppwriteOrderService.updateOrder(dbData?.$id, { orderdata: dborderdata, newdata: foodData })
      if (updatedData) {
        dispatch(dropOrders())
        console.log('Order Updated')
      }
    }
    else {
      const dbOrder = await AppwriteOrderService.AddOrder({ email: userEmail, orderdata: foodData })
      console.log(dbOrder);
      if (dbOrder) {
        dispatch(dropOrders())
      }
    }
  }
  if (foodData.length === 0) {
    return (
      <div>
        <div className='m-5 w-100 text-center fs-3 text-white'>The Cart is Empty!</div>
      </div>
    )
  }
  return (
    <div>
      <div className='container m-auto mt-5 table-responsive  table-responsive-sm table-responsive-md' >
        <table className='table table-hover '>
          <thead className=' text-success fs-4'>
            <tr>
              <th scope='col' >#</th>
              <th scope='col' >Name</th>
              <th scope='col' >Quantity</th>
              <th scope='col' >Option</th>
              <th scope='col' >Amount</th>
              <th scope='col' >Delete</th>
            </tr>
          </thead>
          <tbody>
            {foodData && foodData.map((food, index) => (
              <tr key={index}>
                <th scope='row' >{index + 1}</th>
                <td >{food.name}</td>
                <td>{food.qty}</td>
                <td>{food.size}</td>
                <td>{food.price}</td>
                <td><button type="button"><DeleteIcon onClick={() => { dispatch(removeOrder(index)) }} color='error' /></button> </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-5"><h1 className='text-2xl text-white'>Total Price: {totalPrice}/-</h1></div>
        <div>
          <button type="button" className='p-2 rounded-md hover:inset-1 hover:bg-green-500 mt-5 text-white bg-green-600' onClick={handleCheckOut}> Check Out </button>
        </div>
      </div>
    </div>
  )
}

export default Cart