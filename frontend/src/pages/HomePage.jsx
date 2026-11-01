import { Link } from "react-router-dom"
import { MdArrowRightAlt } from "react-icons/md";
import Banner from "../assets/Images/banner.mp4"
import ButtonCta from "../components/core/Homepage/ButtonCta";
import GradientHeading from "../components/core/Homepage/GradientHeading";
import LiveCodePlay from "../components/core/Homepage/LiveCodePlay";
import LineItemText from "../components/core/Homepage/LineItemText";

const HomePage = () => {
  return (
        <div className="w-full px-4 flex flex-col items-center">
            <div className="w-full max-w-maxContent mx-auto flex flex-col items-center">
                {/* Button link */}
                <Link to={"/signup"}>
                    <div className="bg-richblack-800 rounded-full text-richblack-200 border-b border-richblack-400
                    flex items-center gap-1 px-8 py-2 w-fit mt-16 hover:scale-95 transition-all mb-11">
                        <p>Become an Instructor</p>
                        <MdArrowRightAlt />
                    </div>
                </Link>

                {/* Title and subheading */}
                <div className="w-[90%] flex flex-col items-center">
                    <GradientHeading
                        segments={[
                            "Empower Your Future with ",
                            { text: "Coding Skills", gradient: true },
                        ]}
                    />

                    <LineItemText text={`With our online coding courses, 
                        you can learn at your own pace, from anywhere in the world, 
                        and get access to a wealth of resources, including hands-on projects, 
                        quizzes, and personalized feedback from instructors.` }  center={true}
                    />
                </div>

                {/* Learn more and book a demo BTN */}
                <div className="flex gap-16 mt-8">
                    <ButtonCta active={true} text={"Learn More"} linkTo={"/signup"}/>
                    <ButtonCta active={false} text={"Book a Demo"} linkTo={"/login"}/>
                </div>
            </div>

            {/* Video container */}
            <div className="mt-14 mx-3 my-7 max-w-7xl shadow-[20px_20px_0px_0px_rgba(245,245,245,1)]">
                <video loop autoPlay muted>
                    <div className="absolute inset-0 bg-white translate-x-4 translate-y-4 rounded-sm shadow-xl"></div>
                    <source src={Banner} type="video/mp4" />
                </video>
            </div>

            {/* code play wala section */}
            <div className="flex flex-col">
                 <LiveCodePlay swap={true}/>
                 <LiveCodePlay swap={false} />
            </div>

        </div>
  )
}

export default HomePage 