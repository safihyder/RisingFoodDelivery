import React from 'react'
import AppwriteResService from '../../appwrite/config'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import AddRestaurant from '../AddRestaurant/AddRestaurant'
const EditRestaurant = () => {
    const [restaurant, setRestaurant] = React.useState(null)
    const { slug } = useParams()
    const navigate = useNavigate()
    React.useEffect(() => {
        if (slug) {
            AppwriteResService.getRestaurant(slug).then((data) => {
                if (data) {
                    console.log(data)
                    setRestaurant(data)
                }
            })
        } else {
            navigate('/')
        }
    }, [slug, navigate])

    return restaurant ? (
        <div>
            <AddRestaurant restaurant={restaurant} />
        </div>
    ) :
        null
}

export default EditRestaurant