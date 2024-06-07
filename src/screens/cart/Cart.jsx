import React from 'react'
import "./Cart.css"
// import Delete from '@material-ui/icons/Delete';

const Cart = () => {
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
          <th scope='col' ></th>
        </tr>
      </thead>
      <tbody>
          <tr>
            <th scope='row' >1</th>
            <td >Chicken Biryani</td>
            <td>1</td>
            <td>full</td>
            <td>250</td>
            <td ><button type="button"></button> </td></tr>
      </tbody>
      {/* <tbody>
        {data.map((food, index) => (
          <tr>
            <th scope='row' >{index + 1}</th>
            <td >{food.name}</td>
            <td>{food.qty}</td>
            <td>{food.size}</td>
            <td>{food.price}</td>
            <td ><button type="button" className="btn p-0"><Delete onClick={() => { dispatch({ type: "REMOVE", index: index }) }} /></button> </td></tr>
        ))}
      </tbody> */}
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