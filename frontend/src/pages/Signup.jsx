import { useAppContext } from '../contexts/AppContext.js'
import AuthHeading from '../components/core/Auth/AuthHeading'
import Pill from '../components/core/Auth/Pill'
import SignupImg from '../assets/Images/signup.webp'
import LoginInstructorImg from '../assets/Images/image.png'

const Signup = () => {
  const { formData,loginFormData, signupHandleSubmit, handleChange, handleRoleChange } = useAppContext()

  return (
    <main className='flex w-full flex-1 items-center px-4 py-8 text-left sm:px-6 lg:px-8'>
      {/* CHANGE MADE HERE: flex-col-reverse for small/medium, lg:flex-row for large screen */}
      <div className=' flex  w-full  flex-col-reverse items-center justify-center gap-10 xl:gap-16 lg:flex-row'>
        
        <section className='w-full max-w-2xl'>
          <AuthHeading
            headingTitle='Join the millions learning to code with StudyNotion for free'
            lineItemtext='Build skills for today, tomorrow and beyond.'
            highlightedtext='Education to future-proof your career'
          />

          <div className='mt-6 sm:mt-8'>
            <Pill role={formData.role} onRoleChange={handleRoleChange} />
          </div>

          <form onSubmit={signupHandleSubmit} className='mt-8 text-pure-greys-5 sm:mt-10'>
            <div className='space-y-5 sm:space-y-6'>
              <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6'>
                <div className='flex min-w-0 flex-col'>
                  <label className='mb-2' htmlFor='firstName'>First Name *</label>
                  <input
                    className='w-full min-w-0 rounded-lg border-b border-b-richblack-400 bg-richblack-800 p-4 text-base text-pure-greys-5 focus:outline-none '
                    placeholder='Enter your first name'
                    required
                    id='firstName'
                    name='firstName'
                    autoComplete='given-name'
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>

                <div className='flex min-w-0 flex-col'>
                  <label className='mb-2' htmlFor='lastName'>Last Name *</label>
                  <input
                    className='w-full min-w-0 rounded-lg border-b border-b-richblack-400 bg-richblack-800 p-4 text-base text-pure-greys-5 focus:outline-none '
                    placeholder='Enter your last name'
                    required
                    id='lastName'
                    name='lastName'
                    autoComplete='family-name'
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className='flex flex-col'>
                <label className='mb-2' htmlFor='email'>Email Address *</label>
                <input
                  className='w-full min-w-0 rounded-lg border-b border-b-richblack-400 bg-richblack-800 p-4 text-base text-pure-greys-5 focus:outline-none '
                  required
                  id='email'
                  name='email'
                  value={formData.email}
                  type='email'
                  autoComplete='email'
                  onChange={handleChange}
                  placeholder='Enter your email'
                />
              </div>

              <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6'>
                <div className='flex min-w-0 flex-col'>
                  <label className='mb-2' htmlFor='password'>Password *</label>
                  <input
                    className='w-full min-w-0 rounded-lg border-b border-b-richblack-400 bg-richblack-800 p-4 text-base text-pure-greys-5 focus:outline-none '
                    placeholder='Enter a password'
                    required
                    type='password'
                    id='password'
                    name='password'
                    autoComplete='new-password'
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>

                <div className='flex min-w-0 flex-col'>
                  <label className='mb-2' htmlFor='confirmPassword'>Confirm Password *</label>
                  <input
                    className='w-full min-w-0 rounded-lg border-b border-b-richblack-400 bg-richblack-800 p-4 text-base text-pure-greys-5 focus:outline-none '
                    placeholder='Confirm your password'
                    required
                    type='password'
                    id='confirmPassword'
                    name='confirmPassword'
                    autoComplete='new-password'
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button
                type='submit'
                className='w-full rounded-lg bg-yellow-50 p-4 text-center text-lg font-semibold text-black transition-colors hover:bg-yellow-25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-50 focus-visible:ring-offset-2 '
              >
                Create an Account
              </button>
            </div>
          </form>
        </section>

        <div className='w-full flex lg:w-[35%] p-6'>
          {
            formData.role === 'Student' ? 
            (
              <img
                src={SignupImg}
                alt='Student learning online'
                className='w-full object-contain z-10 shadow-[15px_15px_0px_0px_rgba(255,255,255,1)]'
              />
            ) : 
            (
              <img
                src={LoginInstructorImg}
                alt='Instructor signup'
                className='w-full object-contain z-10 shadow-[15px_15px_0px_0px_rgba(255,255,255,1)]'
              />
            )
          }
        </div>
      </div>
    </main>
  )
}

export default Signup
