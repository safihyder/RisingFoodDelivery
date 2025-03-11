import React from 'react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import Card from '../../components/Card/Card';
import AppwriteitemService from '../../appwrite/itemsconfig'
import AppwriteResService from '../../appwrite/config'
import { useSelector } from 'react-redux';
import Loading from '../../components/Loading';
const Item = () => {
    const navigate = useNavigate();
    const { slug } = useParams();
    const ItemData = useSelector(state => state.item.item.items.documents)
    const [Item, setItem] = React.useState([])
    const [Restaurant, setRestaurant] = React.useState([])
    const [img, setImg] = React.useState([])
    const [resimg, setresImg] = React.useState([])
    console.log(ItemData)
    useEffect(() => {
        if (slug) {
            let filterData = ItemData?.filter((item) => {
                return item.$id === slug
            })
            console.log(filterData[0])
            setItem(filterData[0])
            setImg(AppwriteitemService.getFilePreview(filterData[0].image))
        } else {
            navigate('/')
        }
        AppwriteResService.getRestaurant(Item.resid).then((data) => {
            if (data) {
                setRestaurant(data)
                console.log(data)
                setresImg(AppwriteResService.getFilePreview(data.image))
            }
        })
    }
        , [Item.resid, navigate, slug])
    return (
        <div className="flex justify-center p-4">
            <div className={`w-full md:w-[95%] mx-auto min-h-[90vh] rounded-md flex flex-col md:flex-row items-center justify-evenly gap-8 p-4 md:p-8`}
                style={{
                    backgroundImage: `url(${resimg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed'
                }}>
                <div className="w-full md:w-auto">
                    <Card item={Item} image={img} />
                </div>
                <div className="w-full md:w-auto text-center">
                    <h1 className={`text-xl md:text-3xl bg-slate-300 bg-opacity-90 rounded-md p-2 break-words`}>
                        {Restaurant.name}
                    </h1>
                </div>
            </div>
        </div>
    )
}

export default Item
