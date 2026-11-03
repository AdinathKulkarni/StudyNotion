const JourneyCard = ({ icon, title, description }) => {
  return (
    <div className='flex items-center gap-6'>
      <div className='flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white'>
        <img src={icon} alt='' className='h-6 w-6' />
      </div>
      <div>
        <h3 className='font-semibold'>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default JourneyCard;
