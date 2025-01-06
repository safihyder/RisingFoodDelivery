import React from 'react';
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { InputLabel } from '@mui/material';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { Card as AntCard } from 'antd';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { addOrder, updateOrder } from '../../store/orderSlice';
const Card = ({ item }) => {
  const options={
    
  }
  const dispatch = useDispatch()
  const userOrder = useSelector(state => state.order.userorder)
  const { Meta } = AntCard;
  const [size, setSize] = React.useState('');
  const [qty, setQty] = React.useState('');
  const handleSizeChange = (e) => {
    setSize(e.target.value);
    console.log(e.target.value)
  };
  const handleQtyChange = (e) => {
    setQty(e.target.value);
  };
  const handleAddToCart = async () => {
    console.log('Add to cart')
    let food = []
    for (const fooditem of userOrder) {
      if (fooditem.id === item.id) {
        food.push({ ...item, qty: qty, size: size })
        break;
      }
    }
    if (food) {
      if (food.size === size) {
        dispatch(updateOrder({ id: item.id, qty: qty, price: item.price }))
        return
      } else if (food.size !== size) {
        dispatch(addOrder({ id: item.id, name: item.name, size: size, qty: qty, price: item.price, img: item.image }))
        return
      }
      return
    }
    dispatch(addOrder({ id: item.id, name: item.name, size: size, qty: qty, price: item.price, img: item.image }))
  }
  return (
    <AntCard
      className="shadow-card"
      style={{ width: 300 }}
      cover={
        <img
          className="w-[250px] h-[250px]"
          alt="foodImg"
          src={item.image}
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
            value={qty}
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
            value={size}
          >
            <MenuItem value={"Full"} >Half</MenuItem>
            <MenuItem value={"Half"}>Full</MenuItem>
          </Select>
        </FormControl>
        <h2 className='font-bold flex items-center justify-center'>₹{item.price}</h2>
        <ShoppingCartOutlined className='text-2xl cursor-pointer hover:text-red-300 hover:text-[1.7rem]' onClick={handleAddToCart} key="cart" />
      </div>
    </AntCard>
  )
}
export default Card