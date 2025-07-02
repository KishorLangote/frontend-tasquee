import React from 'react'
import NOTFOUDN from "../assets/NOTFOUND.png"

const PageNotFound = () => {
  return (
    <>
    <div className='flex h-screen items-center justify-center'>
      {/* <span>404</span>
      <div>Page Not Found</div> */}
      <img src={NOTFOUDN} />
    </div>
    </>
  )
}

export default PageNotFound