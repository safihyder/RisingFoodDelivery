import { useState } from 'react';
import PropTypes from 'prop-types';
import './AddRestaurant.css';
import { useDispatch, useSelector } from 'react-redux';
import AppwriteResService from '../../appwrite/config'
import { useNavigate } from 'react-router-dom';
import { restaurants } from '../../store/restSlice';
const AddRestaurant = ({ restaurant }) => {
  const dispatch = useDispatch()
  const userData = useSelector(state => state.auth.userData)
  const [formData, setFormData] = useState({
    name: restaurant?.name,
    address: restaurant?.address || '',
    description: restaurant?.description || '',
  });
  const [img, setImg] = useState(null);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((formData) => ({ ...formData, [name]: value }));
    console.log(value)
  };
  const setimgfile = (e) => {
    setImg(e.target.files[0])
    console.log(img)
  }
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(e)
    if (restaurant) {
      console.log(restaurant)
      const file = img ? await AppwriteResService.uploadFile(img) : null
      if (file) {
        AppwriteResService.deleteFile(restaurant.image)
      }
      const dbRest = await AppwriteResService.updateDetail(restaurant.$id, {
        ...formData,
        image: file ? file.$id : undefined
      })
      if (dbRest) {
        navigate(`/restaurant/${restaurant.$id}`)
      }
    } else {
      const file = await AppwriteResService.uploadFile(img)
      if (file) {
        const fileId = file.$id
        formData.image = fileId
      }
      const session = await AppwriteResService.AddRestaurant({ ...formData, userId: userData.$id })
      console.log(session)
      const dbPost = await AppwriteResService.getRestaurant(session.$id)
      if (dbPost) {
        dispatch(restaurants({ restaurant: dbPost }))
        navigate(`/restaurant/${dbPost.$id}`)
      }
    }
  }

  return (
    <>
      <div className="addrestaurant">
        <div className="add-restaurant-form-container">
          <h2><img src="/Images/logo.png" alt="" />Add Your Restaurant</h2>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            {/* ... your input fields (name, cuisine, address, phoneNumber, website, description) ... */}

            <div className="input-group">
              <label htmlFor="name">Restaurant Name</label>
              <input type="text" id="name" name="name" onChange={handleChange} value={formData.name} />
            </div>
            <div className="input-group">
              <label htmlFor="address">Restaurant Full Address</label>
              <input type="text" id="address" name="address" onChange={handleChange} value={formData.address} />
            </div>
            <div className="input-group">
              <label htmlFor="description">Restaurant Description</label>
              <textarea cols={10} rows={5} type="text" id="description" name="description" onChange={handleChange} value={formData.description} />
            </div>
            <div className="input-group">
              <label htmlFor="image">Restaurant Image</label>
              <input type="file" id="image" name="image" onChange={setimgfile} />
            </div>
            <button type="submit">{restaurant ? "Update Restaurant" : "Add Restaurant"}</button>
          </form>
        </div>


      </div>
    </>
  );
}
AddRestaurant.propTypes = {
  restaurant: PropTypes.shape({
    name: PropTypes.string,
    address: PropTypes.string,
    description: PropTypes.string,
    $id: PropTypes.string,
    image: PropTypes.string,
  }),
};
// export default AddRestaurant;
export default AddRestaurant;
