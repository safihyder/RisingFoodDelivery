import React from 'react'
import AppwriteItemService from '../../appwrite/itemsconfig'
import { useParams, useNavigate } from 'react-router-dom'
import AddFoodItem from '../AddFoodItem/AddFoodItem'
import Loading from '../../components/Loading'

const EditFoodItem = () => {
    const { slug } = useParams()
    const navigate = useNavigate()
    const [foodItem, setFoodItem] = React.useState(null)
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        if (slug) {
            AppwriteItemService.getItem(slug)
                .then((data) => {
                    if (data) {
                        setFoodItem(data)
                    }
                })
                .finally(() => {
                    setLoading(false)
                })
        } else {
            navigate('/')
        }
    }, [slug, navigate])

    if (loading) {
        return <Loading />
    }

    return foodItem ? (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
            <AddFoodItem foodItem={foodItem} />
        </div>
    ) : (
        <div className="w-full h-screen flex justify-center items-center">
            <p className="text-lg text-gray-600">Food item not found</p>
        </div>
    )
}

export default EditFoodItem