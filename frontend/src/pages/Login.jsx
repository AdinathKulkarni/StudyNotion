import { Link } from "react-router-dom"
import LoginImg from '../assets/Images/login.webp'
import LoginInstructorImg from '../assets/Images/image.png'
import AuthHeading from '../components/core/Auth/AuthHeading'
import Pill from '../components/core/Auth/Pill'
import { useAppContext } from '../contexts/AppContext'

const Login = () => {

  const {
    loginFormData,
    loginHandleSubmit,
    handleLoginChange,
    handleLoginRoleChange,
  } = useAppContext();

  return (
    <div className='h-screen flex flex-col-reverse 
    lg:flex-row mx-auto items-center lg:gap-24 pb-12'>
       
       <div>
          <AuthHeading 
          headingTitle={`Welcome Back !`}
          lineItemtext={`Build skills for today, tomorrow and beyond`}
          highlightedtext={`Education to future-proof your career`}
          />

          <div className='mt-8'>
            <Pill
              role={loginFormData.role}
              onRoleChange={handleLoginRoleChange}
            />
          </div> 

          <form onSubmit={loginHandleSubmit} className='mt-6'>
              <div className='flex flex-col text-pure-greys-5'>
                <label className='mb-2' htmlFor='email'>Email Address *</label>
                <input 
                  required
                  id='email'
                  name='email'
                  value={loginFormData.email}
                  placeholder='Enter your email address'
                  type='email'
                  onChange={handleLoginChange}
                  className='w-full min-w-0 rounded-lg border-b mb-4
                  border-b-richblack-400 bg-richblack-800 p-4 text-base text-pure-greys-5 focus:outline-none'
                />
              </div>

              <div className='flex flex-col text-pure-greys-5'>
                <label className='mb-2' htmlFor='email'>Password *</label>
                <input 
                  required
                  id='password'
                  name='password'
                  value={loginFormData.password}
                  placeholder='Enter your password'
                  type='password'
                  onChange={handleLoginChange}
                  className='w-full min-w-0 rounded-lg border-b
                  border-b-richblack-400 bg-richblack-800 p-2 text-base text-pure-greys-5 focus:outline-none'
                /> 
              </div>

              <div className='text-blue-100 text-right mt-2'>
                <Link to={"/forgot-password"} >
                  Forgot password ?
                </Link>
              </div>

              <div className='text-black font-semibold 
              bg-yellow-50 text-center p-3 rounded-lg mt-6'>
                <button
                type='submit'
                >Sign In</button>
              </div>
          </form>

       </div>

       <div className="p-10">
       {
          loginFormData.role === 'Student' ? 
          (
             <img src={LoginImg}
            className="shadow-[12px_12px_0px_0px_rgba(245,245,245,1)]" />
          ) : 
          ( 
          <img src={LoginInstructorImg} width={558} 
          className="shadow-[12px_12px_0px_0px_rgba(245,245,245,1)]" />) 
       }
       </div>

    </div>
  )
}

export default Login