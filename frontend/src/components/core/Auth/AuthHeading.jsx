const AuthHeading = ({headingTitle, lineItemtext, highlightedtext}) => {
  return (
    <div>
        <h1 className='text-3xl font-bold leading-tight text-pure-greys-5 sm:text-4xl'>{headingTitle}</h1>
        <p className='mt-3 text-lg text-richblack-300 sm:text-xl'>{lineItemtext}</p>
        <p className='font-mono text-base font-semibold italic text-blue-200 sm:text-lg'>{highlightedtext}</p>
    </div>
  )
}

export default AuthHeading