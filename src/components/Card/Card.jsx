import React, { useRef } from 'react';
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { InputLabel } from '@mui/material';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { Card as AntCard } from 'antd';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { addOrder, updateOrder } from '../../store/orderSlice';
// import {order} from '../../store/orderSlice'
const Card = ({ item, image }) => {
  const options = {
    Half: 100,
    Full: 200
  }
  const sizeOptions = Object.keys(options)
  const dispatch = useDispatch()
  const { Meta } = AntCard;
  const [size, setSize] = React.useState('Half');
  const [qty, setQty] = React.useState(1);
  const foodData = useSelector(state => state.order.userorder)

  const handleSizeChange = (e) => {
    setSize(e.target.value);
    console.log(e.target.value)
  };
  const handleQtyChange = (e) => {
    setQty(e.target.value);
  };
  const handleAddToCart = () => {
    console.log('Add to cart')
    let food = []
    for (const foodItem of foodData) {
      console.log(foodItem)
      console.log(item)
      if (foodItem.id === item.$id) {
        food = foodItem;
      }
    }
    if (food) {
      if (food.size === size) {
        // console.log(size)
        // console.log(food.size)
        dispatch(updateOrder({ id: item.$id, qty: qty, price: finalPrice }))
        return
      } else if (food.size !== size) {
        dispatch(addOrder({ id: item.$id, name: item.name, size: size, qty: qty, price: finalPrice, img: item.image }))
        return
      }
      return
    }
    dispatch(addOrder({ id: item.$id, name: item.name, size: size, qty: qty, price: finalPrice, img: item.image }))
  }
  const finalPrice = options[size] * qty

  return (
    <AntCard
      className="shadow-card"
      style={{ width: 300 }}
      cover={
        <img
          className="w-[250px] h-[250px]"
          alt="foodImg"
          src={image || item.image}
        />
      }
    >
      <Meta
        title={item.name}
        description={item.description}
      />
      <div className="flex flex-row justify-evenly my-4">
        <FormControl>
          <InputLabel id="demo-simple-select-label">Qty</InputLabel>
          <Select sx={{ minWidth: 80 }}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Category"
            placeholder='Select'
            onChange={handleQtyChange}
            value={qty || 1}
          >
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={6}>6</MenuItem>
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel id="demo-simple-select-label">Size</InputLabel>
          <Select sx={{ minWidth: 90 }}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Category"
            placeholder='Select'
            onChange={handleSizeChange}
            value={size || 'Half'}
          >
            <MenuItem value={"Half"} >Half</MenuItem>
            <MenuItem value={"Full"}>Full</MenuItem>
          </Select>
        </FormControl>
        <h2 className='font-bold flex items-center justify-center'>₹{finalPrice}/-</h2>
        <ShoppingCartOutlined className='text-2xl cursor-pointer hover:text-red-300 hover:text-[1.7rem]' onClick=
          {handleAddToCart} key="cart" />
      </div>
    </AntCard>
  )
}

export default Card