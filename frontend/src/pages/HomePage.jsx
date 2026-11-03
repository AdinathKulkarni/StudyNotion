import { Link } from "react-router-dom"
import { MdArrowRightAlt } from "react-icons/md";
import Banner from "../assets/Images/banner.mp4"
import ButtonCta from "../components/core/Homepage/ButtonCta";
import GradientHeading from "../components/core/Homepage/GradientHeading";
import LiveCodePlay from "../components/core/Homepage/LiveCodePlay";
import LineItemText from "../components/core/Homepage/LineItemText";
import JourneyCard from "../components/core/Homepage/JourneyCard";
import Logo1 from "../assets/TimeLineLogo/Logo1.svg"
import Logo2 from "../assets/TimeLineLogo/Logo2.svg"
import Logo3 from "../assets/TimeLineLogo/Logo3.svg"
import Logo4 from "../assets/TimeLineLogo/Logo4.svg"
import TimeLineImage from "../assets/Images/TimelineImage.png"
import CompareWithOthers from  "../assets/Images/Compare_with_others.svg"
import PlanYourLessons from  "../assets/Images/Plan_your_lessons.svg"
import KnowYourProgress from  "../assets/Images/Know_your_progress.svg"
import Instructor from  "../assets/Images/Instructor.png"

const htmlCodeblock = [
    "<!DOCTYPE html>",
    '<html lang="en">',
    "<head>",
    '  <meta charset="UTF-8">',
    "  <title>My First Page</title>",
    "</head>",
    "<body>",
    "  <h1>Hello, world!</h1>",
    "  <p>Start learning to code today.</p>",
    "</body>",
    "</html>",
].join("\n");

const journeyItems = [
    { icon: Logo1, title: "Leadership", description: "Fully committed to our students' success" },
    { icon: Logo2, title: "Responsibility", description: "Students are always our top priority" },
    { icon: Logo3, title: "Flexibility", description: "Adaptability is an important skill" },
    { icon: Logo4, title: "Problem solving", description: "Build problem-solving skills through code" },
];

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
                        ]} active={true}
                    />

                    <LineItemText text={`With our online coding courses, 
                        you can learn at your own pace, from anywhere in the world, 
                        and get access to a wealth of resources, including hands-on projects, 
                        quizzes, and personalized feedback from instructors.` }  center={false} 
                    />
                </div>

                {/* Learn more and book a demo BTN */}
                <div className="flex gap-16 mt-8">
                    <ButtonCta active={true} text={"Learn More"} linkTo={"/signup"}/>
                    <ButtonCta active={false} text={"Book a Demo"} linkTo={"/login"}/>
                </div>
            </div>

            {/* Video container */}
            <div className="relative mx-3 mb-7 mt-14 w-full max-w-7xl shadow-[20px_20px_0px_0px_rgba(245,245,245,1)]">
                <video className="block h-auto w-full" loop autoPlay muted playsInline aria-hidden="true">
                    <source src={Banner} type="video/mp4" />
                </video>
            </div>

            {/* code play wala section */}
            <div className="flex flex-col">
                 <LiveCodePlay swap={true} codeblock={htmlCodeblock}/>
                 <LiveCodePlay swap={false} codeblock={htmlCodeblock}/>
            </div>


            {/* Pending Card section */}


            {/* Tab switch wala section - PENDING */}
            <div className="bg-pure-greys-5 text-richblack-700">
                <div className="homepage_bg h-[333px] w-screen">
                    <div className="w-11/12 max-w-maxContent flex items-center gap-5 mx-auto justify-center">
                        <div className="flex flex-row gap-7 text-white mt-20 ">
                            <ButtonCta active={true} linkTo={"/signup"} text={"Explore Full Catalog"} />
                            <ButtonCta active={false} linkTo={"/login"} text={"Learn More"} />
                        </div>

                    </div>

                </div>

            </div>

            {/* Get the skills u need Section */}
            <div className="w-screen bg-pure-greys-5">

                {/* Gradient Heading wiht lineitemtext and button div */}
                <div className="mx-auto my-10 flex flex-col gap-12 md:my-16 md:w-[55%] md:flex-row p-4">
                    <div>
                        <GradientHeading segments={["Get the skills you need for a ",
                        { text: "job that is in demand", gradient: true }]} active={false} />
                    </div>

                    <div className="sm:flex-col">
                        <div>
                            <LineItemText text="A changing job market demands adaptability. To stay competitive, professionals need more than technical skills." />
                        </div>

                        <div className="w-fit mt-9">
                            <ButtonCta active={true} linkTo={"/signup"} text={"Learn More"}  />
                        </div>
                    </div>
                </div>


                {/* Image with Card wala comp */}
                <div className="mx-auto grid w-full max-w-maxContent grid-cols-1 items-center gap-10 mb-10 
                                p-4 pb-16 md:grid-cols-2 md:gap-16 lg:grid-cols-2 lg:gap-16">
                    <div className="flex flex-col gap-8">
                        {journeyItems.map((item) => (
                            <JourneyCard
                                key={item.title}
                                icon={item.icon}
                                title={item.title}
                                description={item.description}
                            />
                        ))}
                    </div>

                    <div className="relative isolate flex flex-col w-full items-center justify-center">
                        <div
                            aria-hidden="true"
                            className="absolute -inset-4 z-0 rounded-full bg-gradient-to-l from-blue-300 to-blue-500 opacity-20 blur-2xl" />
                        <img
                            src={TimeLineImage}
                            alt="Student learning at a computer"
                            loading="lazy"
                            className="relative z-10 block h-auto w-full max-w-[600px] object-cover shadow-[20px_20px_0px_0px_rgba(245,245,245,1)]" />

                        {/* Green Card */}
                        <div className="flex bg-caribbeangreen-700 p-10 justify-center items-center uppercase absolute -bottom-20 z-10">

                            <div className="gap-4 flex whitespace-pre-line">
                                <p className="font-bold text-white text-4xl">10</p>
                                <p className="text-caribbeangreen-300 text-[14px]">{`Years\n Experience`}</p>
                            </div>

                            <div className="bg-caribbeangreen-500 w-[1px] h-[44px] mx-8 "></div>

                            <div className="flex gap-4 whitespace-pre-line">
                                <p className="font-bold text-white text-4xl">250</p>
                                <span className="text-caribbeangreen-300 text-[14px]">{`Types of\n Courses`}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Swiss Knife Component */}
                <div className="flex flex-col w-11/12 mx-auto mt-24 justify-center items-center mb-24">
                    {/* title */}
                    <div className="flex flex-col justify-center items-center mb-12">
                        <GradientHeading segments={[`Your swiss knife for `, {text: "learning any language", gradient: true}]} />
                        <LineItemText center={true}
                        text={"Make learning multiple languages easy with realistic voice-overs in 20+ languages, progress tracking, custom schedules, and more."}
                        />
                    </div>
                    
                    {/* images */}
                    <div className="flex">
                        <div className="z-10 -mr-12">
                            <img src={KnowYourProgress} alt="Learning progress dashboard" loading="lazy" />
                        </div>

                        <div  className="z-20 -ml-16 -mt-10">
                            <img src={CompareWithOthers} alt="Compare learning progress with other students" loading="lazy" />
                        </div>

                        <div  className="z-30 -ml-36 -mt-10">
                            <img src={PlanYourLessons} alt="Plan lessons with a calendar" loading="lazy" />
                        </div>
                    </div>

                    {/* learn more */}
                    <div className="w-fit ">
                        <ButtonCta active={true} linkTo={"/signup"} text={"Learn More"} />
                    </div>
                </div>


            </div>

            <div className="w-screen bg-pure-greys-800">
                <div className="mx-auto grid w-full max-w-maxContent grid-cols-1 items-center gap-10 px-4 py-16 md:grid-cols-2 md:gap-16 md:py-24">
                    <div className="w-full shadow-[-12px_-12px_0px_0px_rgba(245,245,245,1)] md:shadow-[-20px_-20px_0px_0px_rgba(245,245,245,1)]">
                        <img
                            src={Instructor}
                            alt="Instructor holding a clipboard"
                            loading="lazy"
                            className="block h-auto w-full object-cover"
                        />
                    </div>

                    <div className="mx-auto flex w-full max-w-xl flex-col justify-center">
                        <GradientHeading
                            active={true}
                            segments={["Become an ", { text: "Instructor", gradient: true }]}
                        />
                        <LineItemText
                            center={false}
                            text="Instructors from around the world teach millions of students on StudyNotion. We provide the tools and skills to teach what you love."
                        />
                        <div className="mt-6 w-fit">
                            <ButtonCta active={true} linkTo={"/signup"} text={"Start Teaching Today"} />
                        </div>
                    </div>
                </div>
            </div>

        </div>
  )
}

export default HomePage