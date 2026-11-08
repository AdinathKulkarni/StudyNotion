import React, { useState } from 'react'
import { Link } from "react-router-dom"
import AuthHeading from '../components/core/Auth/AuthHeading'
import { RiArrowLeftLongLine  } from "react-icons/ri";

const ForgotPassword = () => {

    const [getEmail, setGetEmail] = useState('');

    const validateEmail = () => {
        
        const validationErrors = {};

        if(!getEmail || getEmail === 0){
            validationErrors.email = 'Pls enter email address';
        }

        return validationErrors;
    }

    const handleResetPassword = (e) => {
        try{
            e.preventDefault();

            const validateEmailErrors = validateEmail();

            if(Object.keys(validateEmailErrors).length === 0){
                console.log("Email captured and OTP sent successfully");
                console.log(getEmail);
                return;
            }
            
            console.log(validateEmailErrors.email)
        } catch(e){
            console.log("Error capturing email, pls try again")
            console.log(e);
        }
    }

  return (
    <div className='h-screen mx-auto lg:w-[50%] flex flex-col p-6 gap-8 text-pure-greys-5 justify-center'>
        <AuthHeading 
        headingTitle={`Reset Your Password`}
        lineItemtext={`Have no fear. We’ll email you instructions to reset your password. 
                       If you dont have access to your email we can try account recovery`}
        />

        <form onSubmit={handleResetPassword} className='space-y-8'>
            <div className=' gap-2 flex flex-col'>
                <label>Email Address *</label>
                <input
                required
                name='email'
                type='email'
                value={getEmail}
                placeholder='Enter your email'
                onChange={(e) => {setGetEmail(e.target.value)}}
                className='w-full min-w-0 rounded-lg border-b mb-4
                    border-b-richblack-400 bg-richblack-800 p-4 text-base text-pure-greys-5 focus:outline-none'
                />
            </div>

            <div className='bg-yellow-50 text-richblack-800 
                            font-semibold text-center p-4 rounded-lg'>
                <button type='submit'>
                    Reset Password
                </button>
            </div>
        </form>

        <div className='flex gap-3 items-center w-fit'>
            <RiArrowLeftLongLine />
            <Link to={ "/login" } > Back to Login </Link>
        </div>

    </div>
  )
}

export default ForgotPassword