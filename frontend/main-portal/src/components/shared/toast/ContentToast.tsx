import React from 'react'
import './style.scss'
import { TToastType } from './type'

interface ContentToastProps {
  title?: string
  type?: TToastType
  closeToast?: () => void
}

const ContentToast: React.FC<ContentToastProps> = ({ 
  title = 'Thành công!', 
  type = 'success', 
}) => {
  const icons: Record<TToastType, string> = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
  }

  return (
    <div className={`my-toast my-toast--${type}`}>
      <span className="my-toast__status">
        {icons[type]} {title}
      </span>
    </div>
  )
}

export default ContentToast
