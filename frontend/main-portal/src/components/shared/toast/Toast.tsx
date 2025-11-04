import React from 'react'
import { IToastProps } from './type'
import { toast } from 'react-toastify'
import ContentToast from './ContentToast'

const Toast : React.FC<IToastProps> = ({ title, type }) => {

  const toastRender = {
    success: toast.success(<ContentToast title={title} type={'success'} />),
    error: toast.error(<ContentToast title={title} type={'error'} />),
    info: toast.info(<ContentToast title={title} type={'info'} />),
  }

  return (
    toastRender[type || 'info']
  )
}

export default Toast
