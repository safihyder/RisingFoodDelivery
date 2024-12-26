import React from 'react'
import AppwriteItemService from '../../appwrite/itemsconfig'
import { useParams, useNavigate } from 'react-router-dom'
import AddFoodItem from '../AddFoodItem/AddFoodItem'
const EditFoodItem = () => {
    const { slug } = useParams()
    const navigate = useNavigate()
    const [foodItem, setFoodItem] = React.useState(null)
    React.useEffect(() => {
        if (slug) {
            AppwriteItemService.getItem(slug)
                .then((data) => {
                    console.log(data)
                    if (data) {
                        setFoodItem(data)
                    }
                })
        } else {
            navigate('/')
        }
    }, [slug, navigate])
    return foodItem ? (
        <div>
            <AddFoodItem foodItem={foodItem} />
        </div>
    ) :
        null
}

export default EditFoodItem