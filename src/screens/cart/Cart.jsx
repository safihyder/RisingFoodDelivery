import { useSelector } from "react-redux";
import "./Cart.css"
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { removeOrder } from "../../store/orderSlice";
const Cart = () => {
  const dispatch = useDispatch();
  const foodData = useSelector(state => state.order.userorder)
  console.log(foodData)
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
          {/* <tbody>
            <tr>
              <th scope='row' >1</th>
              <td >Chicken Biryani</td>
              <td>1</td>
              <td>full</td>
              <td>250</td>
              <td ><button type="button"><DeleteIcon color='error' /></button> </td></tr>
          </tbody> */}
          <tbody>
            {foodData && foodData.map((food, index) => (
              <tr key={index}>
                <th scope='row' >{index + 1}</th>
                <td >{food.name}</td>
                <td>{food.qty}</td>
                <td>{food.size}</td>
                <td>{food.price}</td>
                <td ><button type="button"><DeleteIcon onClick={() => { dispatch(removeOrder(index)) }} color='error' /></button> </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* <div><h1 className='fs-2 text-white'>Total Price: {totalPrice}/-</h1></div>
    <div>
      <button className='btn bg-success mt-5 ' onClick={handleCheckOut} > Check Out </button>
    </div> */}
      </div>
    </div>
  )
}

export default Cart