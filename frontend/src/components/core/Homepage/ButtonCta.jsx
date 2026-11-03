import { Link } from 'react-router-dom'
import { MdArrowRightAlt } from 'react-icons/md'

const ButtonCta = ({text, active, linkTo}) => {
  const variantStyles = active
    ? "border-richblack-50 bg-yellow-50 text-black"
    : "border-richblack-400 bg-richblack-800 text-richblack-5";

  return (
    <Link
      to={linkTo}
      className={`inline-flex items-center gap-2 rounded-lg border-b border-r px-4 py-3 font-bold transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-50 focus-visible:ring-offset-2 focus-visible:ring-offset-richblack-900 ${variantStyles}`}
    >
      {text}
      {active && <MdArrowRightAlt aria-hidden="true" />}
    </Link>
  )
}

export default ButtonCta