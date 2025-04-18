import ReactDom from 'react-dom'

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
  overflow: 'hidden'
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
  return ReactDom.createPortal(
    <>
      <div style={OVERLAY_STYLES} />
      <div
        style={MODAL_STYLES}
        className="rounded-lg"
      >
        <button
          className="absolute top-4 right-4 bg-red-600 text-white text-xl w-8 h-8 rounded hover:bg-red-700 transition-colors z-50"
          onClick={onClose}
        >
          X
        </button>
        <div className="h-full w-full overflow-auto p-8 pt-16">
          {children}
        </div>
      </div>
    </>,
    document.getElementById('cart-root')
  )
}