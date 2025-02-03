import React from 'react'
import ReactDom from 'react-dom'
import AuthService from "./appwrite/auth"
import { useDispatch } from 'react-redux'
import { login, logout } from './store/authSlice'
const MODAL_STYLES = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  backgroundColor: 'rgb(10 15 17)',
  transform: 'translate(-50%, -50%)',
  zIndex: 1000,
  height: '90%',
  width: '90%'
}

const OVERLAY_STYLES = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, .7)',
  zIndex: 1000
}
export default function Modal({ children, onClose }) {
  // const [loading, setLoading] = React.useState(true)
  // const dispatch = useDispatch()
  // React.useEffect(() => {
  //   AuthService.getCurrentUser()
  //     .then((userData) => {
  //       if (userData) {
  //         dispatch(login({ userData }))
  //       } else {
  //         dispatch(logout())
  //       }
  //     }).finally(() => setLoading(false))

  // }, [])
  return ReactDom.createPortal(
    <>
      <div style={OVERLAY_STYLES} />
      <div style={MODAL_STYLES}>
        <button style={{ marginLeft: "90%", marginTop: "-35px", backgroundColor: "#e53935", fontSize: "20px", height: "35px", width: "35px", borderRadius: "5px" }} onClick={onClose}> X </button>
        {children}
      </div>
    </>,
    document.getElementById('cart-root')
  )
}