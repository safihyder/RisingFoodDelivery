import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem';
import AppwriteResService from '../../appwrite/config'
import AppwriteItemService from '../../appwrite/itemsconfig'
import Select from '@mui/material/Select';
import { InputLabel } from '@mui/material';
import { useSelector } from 'react-redux';
import { Query } from 'appwrite';
import Loading from '../../components/Loading';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../../components/Card/Card';

const Restaurant = () => {
    const [resData, setResData] = useState(null)
    const [items, setItems] = useState([])
    const [category, setCategory] = useState('')
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredItems, setFilteredItems] = useState([]);
    const [isImageLoaded, setIsImageLoaded] = useState(false)
    const [activeTab, setActiveTab] = useState('menu')
    const [showFullDescription, setShowFullDescription] = useState(false)
    const { slug } = useParams()
    const navigate = useNavigate()
    const userData = useSelector(state => state.auth.userData)
    const isManager = resData && userData ? resData.userId === userData.$id : false;

    const handleChange = (e) => {
        setCategory(e.target.value)
    }

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
                if (data?.documents) {
                    const processedItems = data.documents.map((item) => ({
                        ...item,
                        image: AppwriteItemService.getFilePreview(item.image)
                    }));
                    setItems(processedItems);
                    setFilteredItems(processedItems);
                }
            })
    }, [slug, navigate, category])

    useEffect(() => {
        if (!items) return;

        let filtered = [...items];

        // Apply search filter
        if (searchQuery.trim()) {
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredItems(filtered);
    }, [searchQuery, items]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                when: "beforeChildren"
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
    };

    const tabVariants = {
        inactive: { borderBottom: "2px solid transparent" },
        active: { borderBottom: "2px solid #f97316", transition: { duration: 0.3 } }
    };

    return resData ? (
        <motion.div
            className='px-4 sm:px-6 md:px-8 lg:px-12 my-4 sm:my-5 flex flex-col gap-4 sm:gap-5'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div
                className='h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] bg-slate-200 rounded-md relative overflow-hidden'
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <motion.img
                    className={`w-full h-full object-cover rounded-[inherit] ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    src={AppwriteResService.getFilePreview(resData.image)}
                    alt={resData.name}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: isImageLoaded ? 1 : 1.1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    onLoad={() => setIsImageLoaded(true)}
                />
                {!isImageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}

                {isManager && (
                    <motion.div
                        className="absolute top-[10px] sm:top-[20px] left-[10px] sm:left-[20px] flex gap-2"
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        <Link className='shadow-lg gap-1 w-[120px] sm:w-[150px] h-[40px] sm:h-[50px] bg-white rounded-md flex justify-center items-center hover:bg-slate-100 transition-colors' to='/addfoodItem'>
                            <img className='w-[24px] h-[24px] sm:w-[30px] sm:h-[30px]' src="/Images/addItem.png" alt="" />
                            <h2 className='font-semibold text-sm sm:text-base'>Add Item</h2>
                        </Link>
                    </motion.div>
                )}

                {isManager && (
                    <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        <Link to={`/restaurant/edit/${slug}`}>
                            <button className='gap-2 shadow-lg w-[80px] sm:w-[100px] h-[40px] sm:h-[50px] absolute top-[10px] sm:top-[20px] right-[10px] sm:right-[20px] bg-white rounded-md flex justify-center items-center hover:bg-slate-100 transition-colors'>
                                <img className='w-[24px] h-[24px] sm:w-[30px] sm:h-[30px]' src="/Images/pen.png" alt="" />
                                <h2 className='font-semibold text-sm sm:text-base'>Edit</h2>
                            </button>
                        </Link>
                    </motion.div>
                )}

                <motion.div
                    className='shadow-xl absolute bottom-1 left-2/4 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-70 px-4 sm:px-6 py-2 sm:py-3 rounded-md flex flex-row items-center gap-3'
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                >
                    <img className='h-[25px] sm:h-[35px] rounded-full' src={AppwriteResService.getFilePreview(resData.image)} alt="" />
                    <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold">{resData.name}</h1>
                </motion.div>
            </motion.div>

            <motion.div
                className='max-w-3xl mx-auto w-full bg-white p-5 rounded-lg shadow-md'
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
            >
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-bold text-gray-800">About</h2>
                    <button
                        onClick={() => setShowFullDescription(!showFullDescription)}
                        className="text-orange-500 hover:text-orange-600 text-sm font-medium"
                    >
                        {showFullDescription ? 'Show Less' : 'Show More'}
                    </button>
                </div>
                <motion.p
                    className='text-justify text-sm sm:text-base text-gray-600'
                    initial={false}
                    animate={{ height: showFullDescription ? 'auto' : '80px' }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: 'hidden' }}
                >
                    {resData.description}
                </motion.p>
            </motion.div>

            <motion.div
                className='mt-3 sm:mt-5 flex flex-col gap-3'
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div className='flex flex-col items-center justify-center gap-4' variants={itemVariants}>
                    <div className="flex space-x-4 border-b border-gray-200 w-full max-w-md mx-auto">
                        <motion.button
                            className={`py-2 px-4 font-medium text-lg ${activeTab === 'menu' ? 'text-orange-500' : 'text-gray-500'}`}
                            onClick={() => setActiveTab('menu')}
                            variants={tabVariants}
                            animate={activeTab === 'menu' ? 'active' : 'inactive'}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Menu
                        </motion.button>
                        <motion.button
                            className={`py-2 px-4 font-medium text-lg ${activeTab === 'reviews' ? 'text-orange-500' : 'text-gray-500'}`}
                            onClick={() => setActiveTab('reviews')}
                            variants={tabVariants}
                            animate={activeTab === 'reviews' ? 'active' : 'inactive'}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Reviews
                        </motion.button>
                        <motion.button
                            className={`py-2 px-4 font-medium text-lg ${activeTab === 'info' ? 'text-orange-500' : 'text-gray-500'}`}
                            onClick={() => setActiveTab('info')}
                            variants={tabVariants}
                            animate={activeTab === 'info' ? 'active' : 'inactive'}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Info
                        </motion.button>
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === 'menu' && (
                            <motion.div
                                key="menu"
                                className="w-full"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="max-w-4xl mx-auto mb-8 px-4">
                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-6">
                                        <h1 className='text-center text-2xl sm:text-3xl md:text-4xl text-orange-400 font-bold'>Menu</h1>
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
                                                <MenuItem value={''}>All</MenuItem>
                                                <MenuItem value={'vegetarian'}>Vegetarian</MenuItem>
                                                <MenuItem value={'nonVegetarian'}>Non Vegetarian</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </div>

                                    {/* Search Bar */}
                                    <div className="relative flex-1 w-full max-w-md mx-auto mb-4">
                                        <input
                                            type="text"
                                            placeholder="Search food items..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        />
                                        <svg
                                            className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                            />
                                        </svg>
                                    </div>

                                    {/* Results Count */}
                                    <p className="text-sm text-gray-500 text-center mb-4">
                                        {filteredItems.length} items found
                                    </p>
                                </div>

                                {/* Items Grid */}
                                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 justify-items-center">
                                    {filteredItems.length > 0 ? (
                                        filteredItems.map((item, index) => (
                                            <Card key={index} item={item} />
                                        ))
                                    ) : (
                                        <div className="col-span-full text-center py-12">
                                            <svg
                                                className="mx-auto h-12 w-12 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            <h3 className="mt-2 text-lg font-medium text-gray-900">No items found</h3>
                                            <p className="mt-1 text-gray-500">Try adjusting your search or filters</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'reviews' && (
                            <motion.div
                                key="reviews"
                                className="w-full p-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="text-center p-8">
                                    <div className="mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-medium text-gray-700">No Reviews Yet</h3>
                                    <p className="mt-2 text-gray-500">Be the first to review this restaurant!</p>
                                    <button className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors">
                                        Write a Review
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'info' && (
                            <motion.div
                                key="info"
                                className="w-full p-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4">Restaurant Information</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 mt-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-700">Opening Hours</p>
                                                <p className="text-sm text-gray-500">Monday - Sunday: 10:00 AM - 10:00 PM</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 mt-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-700">Contact</p>
                                                <p className="text-sm text-gray-500">+91 9876543210</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 mt-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-700">Address</p>
                                                <p className="text-sm text-gray-500">123 Food Street, Foodie City, India</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 mt-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                </svg>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-700">Payment Methods</p>
                                                <p className="text-sm text-gray-500">Cash, Credit Card, UPI</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </motion.div>
        </motion.div>
    ) : <Loading />;
}

export default Restaurant
