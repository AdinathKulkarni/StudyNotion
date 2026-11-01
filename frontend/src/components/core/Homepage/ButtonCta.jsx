import React from 'react'
import { Link } from 'react-router-dom'

const ButtonCta = ({text, active, linkTo}) => {
  return (
        <div className={` ${active ? "bg-yellow-50 rounded-lg p-3 text-black hover:scale-95 transition-all border-b border-r border-richblack-50" : 
        "bg-richblack-800 rounded-lg p-3 text-richblack-5 hover:scale-95 transition-all border-b border-r border-richblack-400"} flex`} >
                    <Link to={linkTo}>{text}</Link>
        </div>
  )
}

export default ButtonCta