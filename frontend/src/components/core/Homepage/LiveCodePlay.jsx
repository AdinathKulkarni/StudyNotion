import HeaderButtonComponent from './HeaderButtonComponent';

const LiveCodePlay = ({ swap }) => {
  return (
    <>
      {swap ? (
        <div className='flex gap-[98px] m-12'>
          {/* text button div */}
          <HeaderButtonComponent 
            btn1txt={"Try it Yourself"} 
            btn2txt={"Learn More"} 
            gradient={" coding potential"} 
            heading1={"Unlock your"} 
            heading2={" with our online courses"} 
            lineItem={"Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."}
            link1={"/signup"} 
            link2={"/login"}
          />

          {/* live code play wala div */}
          <div className='w-full bg-white'>
            {/* placeholder */}
          </div>
        </div>
      ) : (
          <div className='flex gap-[98px] m-14'>
            
            {/* live code play wala div */}
            <div className='w-[70%] bg-white'>
              {/* placeholder */}
            </div>

              {/* Button text wala div */}
            <HeaderButtonComponent 
              btn1txt={"Continue Lesson"} 
              btn2txt={"Learn More"} 
              gradient={"coding in\n seconds "} 
              heading1={"Start "} 
              heading2={""} 
              lineItem={"Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."}
              link1={"/signup"} 
              link2={"/login"}
            />            
        </div>
      )}
    </>
  );
};

export default LiveCodePlay;
