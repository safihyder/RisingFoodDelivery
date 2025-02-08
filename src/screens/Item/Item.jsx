import React from 'react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import Card from '../../components/card/Card';
import AppwriteitemService from '../../appwrite/itemsconfig'
import AppwriteResService from '../../appwrite/config'
import { useSelector } from 'react-redux';
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
        // async function fetchData() {
        //     if (slug) {
        //         await AppwriteitemService.getItem(slug).then((data) => {
        //             if (data) {
        //                 console.log(data.image)
        //                 setItem(data)
        //                 setImg(AppwriteitemService.getFilePreview(data.image))
        //             } else {
        //                 navigate('/')
        //             }
        //         })
        //     } else {
        //         navigate('/')
        //     }
        //     await AppwriteResService.getRestaurant(Item.resid).then((data) => {
        //         if (data) {
        //             setRestaurant(data)
        //             console.log(data)
        //             setresImg(AppwriteResService.getFilePreview(data.image))
        //         }
        //     })
        // }
        // fetchData()
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
        <div className="flex justify-center">
            <div className={`w-[95%] mx-auto h-[90vh] rounded-md flex items-center justify-evenly`} style={{ backgroundImage: `url(${resimg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div>
                    <Card item={Item} image={img} />
                </div>
                <div>
                    <h1 className={`text-3xl bg-slate-300 rounded-md p-2`}>{Restaurant.name}</h1>
                </div>
            </div>
        </div>
    )
}

export default Item