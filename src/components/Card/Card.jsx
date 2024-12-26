import React from 'react';
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { InputLabel } from '@mui/material';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { Card as AntCard } from 'antd';
import { useDispatch } from 'react-redux';
import {order} from '../../store/orderSlice'
const Card = ({ item }) => {
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
  const handleAddToCart = () => {
    console.log('Add to cart')
    let food=[]
    for(const item of order){
      
    }

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