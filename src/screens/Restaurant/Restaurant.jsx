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
import Loading from '../../components/Loading';

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
        <div className='px-4 sm:px-6 md:px-8 lg:px-12 my-4 sm:my-5 flex flex-col gap-4 sm:gap-5 w-[100vw]'>
            <div className='h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] bg-slate-500 rounded-md relative'>
                <img className="w-full h-full object-cover rounded-[inherit]" src={AppwriteResService.getFilePreview(resData.image)} alt={resData.name} />
                {isManager &&
                    <Link className='shadow-card gap-1 w-[120px] sm:w-[150px] h-[40px] sm:h-[50px] absolute top-[10px] sm:top-[20px] left-[10px] sm:left-[20px] bg-slate-100 rounded-md flex justify-center items-center hover:bg-slate-200 transition-colors' to='/addfoodItem'>
                        <img className='w-[24px] h-[24px] sm:w-[30px] sm:h-[30px]' src="/Images/addItem.png" alt="" />
                        <h2 className='font-semibold text-sm sm:text-base'>Add Item</h2>
                    </Link>}
                {isManager &&
                    <Link to={`/restaurant/edit/${slug}`}>
                        <button className='gap-2 shadow-card w-[80px] sm:w-[100px] h-[40px] sm:h-[50px] absolute top-[10px] sm:top-[20px] right-[10px] sm:right-[20px] bg-slate-100 rounded-md flex justify-center items-center hover:bg-slate-200 transition-colors'>
                            <img className='w-[24px] h-[24px] sm:w-[30px] sm:h-[30px]' src="/Images/pen.png" alt="" />
                            <h2 className='font-semibold text-sm sm:text-base'>Edit</h2>
                        </button>
                    </Link>
                }
                <div className='shadow-card absolute bottom-1 left-2/4 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-50 px-3 sm:px-4 py-1 sm:py-2 rounded-md flex flex-row items-center gap-2'>
                    <img className='h-[20px] sm:h-[30px]' src={AppwriteResService.getFilePreview(resData.image)} alt="" />
                    <h1 className="text-white text-2xl sm:text-3xl md:text-4xl">{resData.name}</h1>
                </div>
            </div>
            <div className='max-w-3xl mx-auto w-full'>
                <p className='desc text-justify text-sm sm:text-base'>{resData.description}</p>
            </div>
            <div className='mt-3 sm:mt-5 flex flex-col gap-3'>
                <div className='flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3'>
                    <h1 className='text-center text-2xl sm:text-3xl md:text-4xl text-orange-400'>Menu</h1>
                    <FormControl size="small" className='min-w-[120px] sm:min-w-[150px]'>
                        <InputLabel id="demo-simple-select-label">Category</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Category"
                            placeholder='Select'
                            onChange={handleChange}
                            value={category}
                        >
                            <MenuItem value={'vegetarian'}>Vegetarian</MenuItem>
                            <MenuItem value={'nonVegetarian'}>Non Vegetarian</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <Items items={items} />
            </div>
        </div>
    ) :
        <Loading />;
}

export default Restaurant
