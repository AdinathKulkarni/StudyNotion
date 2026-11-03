import HeaderButtonComponent from './HeaderButtonComponent';
import { TypeAnimation } from 'react-type-animation';
import '../../../index.css'

const LiveCodePlay = ({ swap, codeblock }) => {
  const codePanel = (
    <div className='relative isolate min-w-0'>
      <div
        aria-hidden='true'
        className='absolute -inset-4 z-0 rounded-full bg-gradient-to-tr from-blue-200 to-pink-200 blur-3xl'
      />
      <div className='relative z-10 flex h-[320px] min-w-0 overflow-auto rounded-lg codeblock bg-richblack-800 px-4 py-5 font-mono text-sm leading-6 text-yellow-5'>
        <div aria-hidden='true' className='mr-4 select-none text-right text-richblack-400'>
          {Array.from({ length: 11 }, (_, index) => (
            <div key={index}>{index + 1}</div>
          ))}
        </div>

        <div className='min-w-0 flex-1 overflow-hidden'>
          <TypeAnimation
            sequence={[codeblock, 3000, ""]}
            repeat={Infinity}
            cursor={true}
            style={{
              whiteSpace: "pre",
              display: "block"
            }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {swap ? (
        <div className='mx-auto my-12 grid w-full max-w-maxContent grid-cols-1 items-center gap-8 px-4 md:grid-cols-2 md:gap-[98px]'>
          <div className='w-full min-w-0'>
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
          </div>

          {codePanel}
        </div>
      ) : (
        <div className='mx-auto my-12 grid w-full max-w-maxContent grid-cols-1 items-center gap-8 px-4 md:grid-cols-2 md:gap-[98px]'>
          <div className='order-2 w-full min-w-0 md:order-1'>
            {codePanel}
          </div>

          <div className='order-1 w-full min-w-0 md:order-2'>
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
        </div>
      )}
    </>
  );
};

export default LiveCodePlay;
