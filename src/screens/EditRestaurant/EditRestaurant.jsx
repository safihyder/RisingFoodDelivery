import React from 'react'
import AppwriteResService from '../../appwrite/config'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import AddRestaurant from '../AddRestaurant/AddRestaurant'
import Loading from '../../components/Loading'

const EditRestaurant = () => {
    const [restaurant, setRestaurant] = React.useState(null)
    const [loading, setLoading] = React.useState(true)
    const { slug } = useParams()
    const navigate = useNavigate()

    React.useEffect(() => {
        if (slug) {
            AppwriteResService.getRestaurant(slug)
                .then((data) => {
                    if (data) {
                        setRestaurant(data)
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

    return restaurant ? (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
            <AddRestaurant restaurant={restaurant} />
        </div>
    ) : (
        <div className="w-full h-screen flex justify-center items-center">
            <p className="text-lg text-gray-600">Restaurant not found</p>
        </div>
    )
}

export default EditRestaurant