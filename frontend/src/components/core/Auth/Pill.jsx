const Pill = ({ role, onRoleChange }) => {
  return (
    <div className='bg-richblack-800 rounded-full space-x-[10px] text-[20px]
        px-2 py-2 w-fit text-pure-greys-5 border-b border-b-richblack-500'>
        <button
            type='button'
            onClick={() => onRoleChange('Student')}
            className={`${role === 'Student' ? 
            "bg-richblack-900 rounded-full px-[18px] py-[6px]" : 
            "bg-richblack-800 rounded-full px-[18px] py-[6px]"}`}
        >Student
        </button>

        <button
            type='button'
            onClick={() => onRoleChange('Instructor')}
            className={`${role === 'Instructor' ? 
            "bg-richblack-900 rounded-full px-[18px] py-[6px]" : 
            "bg-richblack-800 rounded-full px-[18px] py-[6px]"}`}
            >Instructors
        </button>
    </div>
  )
}

export default Pill