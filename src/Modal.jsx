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
  width: '95%',
  height: '95%',
  maxWidth: '1200px',
  maxHeight: '800px',
  '@media (min-width: 640px)': {
    width: '85%',
    height: '85%'
  },
  '@media (min-width: 768px)': {
    width: '80%',
    height: '80%'
  },
  '@media (min-width: 1024px)': {
    width: '70%',
    height: '70%'
  }
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
        <button 
          className="absolute top-4 right-4 bg-red-600 text-white text-xl w-8 h-8 rounded hover:bg-red-700 transition-colors"
          onClick={onClose}
        >
          X
        </button>
        {children}
      </div>
    </>,
    document.getElementById('cart-root')
  )
}