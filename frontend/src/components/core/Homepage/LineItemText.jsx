import React from 'react'

const LineItemText = ({text, center}) => {
  return (
        <div  className={`text-richblack-300 mx-auto ${center ? "text-center" : ""} mt-4 text-lg`}>
            {text}
        </div>
  )
}

export default LineItemText