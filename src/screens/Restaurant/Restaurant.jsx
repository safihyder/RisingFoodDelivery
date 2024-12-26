import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './Restaurant.css'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem';
import AppwriteResService from '../../appwrite/config'
import AppwriteItemService from '../../appwrite/itemsconfig'
import Select from '@mui/material/Select';
import { InputLabel } from '@mui/material';
import Items from '../Items/Items';
import { useSelector } from 'react-redux';
import { Query } from 'appwrite';
const Restaurant = () => {
    const [resData, setResData] = useState(null)
    const [items, setItems] = useState([])
    const [category, setCategory] = useState('')
    const { slug } = useParams()
    const navigate = useNavigate()
    const userData = useSelector(state => state.auth.userData)
    const isManager = resData && userData ? resData.userId === userData.$id : false;
    const handleChange = (e) => {
        setCategory(e.target.value)
    }
    console.log(category)
    useEffect(() => {
        if (slug) {
            AppwriteResService.getRestaurant(slug).then((data) => {
                if (data) {
                    setResData(data)
                } else navigate('/')
            })
        } else {
            navigate('/')
        }
        AppwriteItemService.getItems([Query.contains('resid', slug), category ? Query.equal('category', category) : Query.contains('category', category)])
            .then((data) => {
                data?.documents.map((item) => {
                    item.image = AppwriteItemService.getFilePreview(item.image)
                }
                )
                setItems(data.documents)
            })
    }, [slug, navigate, category])
    console.log(resData)

    return resData ? (
        <div className='mx-5 my-5 flex flex-col gap-5 '>
            <div className='h-[80vh] bg-slate-500 rounded-md relative'>
                <img className="w-[100%] h-[100%] rounded-[inherit]" src={AppwriteResService.getFilePreview(resData.image)} alt="" />
                {isManager &&
                    <Link className='shadow-card gap-1 w-[150px] h-[50px] absolute top-[20px] left-[20px] bg-slate-100 rounded-md flex justify-center items-center' to='/addfoodItem'>
                        <img className='w-[30px] h-[30px]' src="/Images/addItem.png" alt="" />
                        <h2 className='font-semibold'>Add Item</h2>
                    </Link>}
                {isManager &&
                    <Link to={`/restaurant/edit/${slug}`}>
                        <button className='gap-2 shadow-card w-[100px] h-[50px] absolute top-[20px] right-[20px] bg-slate-100 rounded-md flex justify-center items-center'>
                            <img className='w-[30px] h-[30px]' src="/Images/pen.png" alt="" />
                            <h2 className='font-semibold'>Edit</h2>
                        </button>
                    </Link>
                }
                <div className='shadow-card absolute bottom-1 left-2/4 transform -translate-x-1/2 -translate-y-1/2  bg-black bg-opacity-50 px-4 py-2 rounded-md flex flex-row items-center gap-2'>
                    <img className=' h-[30px]' src={AppwriteResService.getFilePreview(resData.image)} alt="" />
                    <h1 className=" text-white text-4xl">{resData.name}</h1>
                </div>
            </div>
            <div>
                <p className='desc text-justify'>{resData.description}</p>
            </div>
            <div className=' mt-5 flex flex-col gap-3'>
                <div className='flex flex-row items-center justify-center gap-3'>
                    <h1 className='text-center text-4xl text-orange-400'>Menu</h1>
                    <FormControl>
                        <InputLabel id="demo-simple-select-label">Category</InputLabel>
                        <Select sx={{ minWidth: 120 }}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Category"
                            placeholder='Select'
                            onChange={handleChange}
                            value={category}
                        >
                            <MenuItem value={'vegetarian'} >Vegetarian</MenuItem>
                            <MenuItem value={'nonVegetarian'}>Non Vegetarian</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div >
                </div>
                <Items items={items} />
            </div>
        </div>
    ) :
        null;
}


export default Restaurant
