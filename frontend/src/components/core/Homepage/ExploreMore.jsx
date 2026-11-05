import { useState } from 'react';
import HomepageExplore from '../../data/homepage-explore.js';
import GradientHeading from './GradientHeading';
import LineItemText from './LineItemText';
import { FaBookOpen } from "react-icons/fa";
import ButtonCta from './ButtonCta.jsx';

const ExploreMore = () => {
  const [currentTab, setCurrentTab] = useState(HomepageExplore[0].tag);
  const selectedCategory = HomepageExplore.find(({ tag }) => tag === currentTab);
  const courses = selectedCategory?.courses ?? [];
  const [activeCard, setActiveCard] = useState(HomepageExplore[0].courses[0].heading);

  return (
    <section className='flex w-full flex-col items-center p-8'>
      <div className='text-center'>
        <GradientHeading
          active={true}
          segments={["Unlock the ", { text: "Power of Code", gradient: true }]}
        />
        <LineItemText center={true} text='Learn to build anything you can imagine.' />
      </div>

      <div
        aria-label='Course categories'
        className='mt-10 flex w-full max-w-full gap-2 rounded-full bg-richblack-800 p-2 sm:w-fit sm:gap-4 sm:p-3'
      >
        {HomepageExplore.map(({ tag }) => (
          <button
            key={tag}
            type='button'
            aria-pressed={currentTab === tag}
            onClick={() => {
              const nextCourses = HomepageExplore.find((category) => category.tag === tag)?.courses ?? [];
              setCurrentTab(tag);
              setActiveCard(nextCourses[0]?.heading ?? '');
            }}
            className={` rounded-full p-2 text-sm transition-colors sm:px-5 sm:text-base ${
              currentTab === tag
                ? 'bg-richblack-900 text-white'
                : 'text-richblack-300 hover:text-white'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className='mt-8 grid w-full max-w-maxContent grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {courses.map((course) => {
          const isActive = activeCard === course.heading;

          return (
            <button 
              key={course.heading}
              type='button'
              aria-pressed={isActive}
              onClick={() => setActiveCard(course.heading)}
              className={`flex h-full w-full flex-col border p-6 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-50 ${
                isActive
                  ? 'border-white bg-white shadow-[10px_10px_0px_0px_rgba(255,214,10,1)]'
                  : 'border-richblack-700 bg-richblack-800 hover:border-richblack-400'
              }`}
            >
              <span
                role='heading'
                aria-level='2'
                className={`text-xl font-semibold ${isActive ? 'text-richblack-900' : 'text-white'}`}
              >
                {course.heading}
              </span>
              <span className={`mt-3 flex-1 text-sm leading-6 ${isActive ? 'text-richblack-700' : 'text-richblack-200'}`}>
                {course.description}
              </span>
              <span className={`mt-6 flex w-full items-center justify-between border-t border-dashed border-richblack-400 pt-4 text-sm ${isActive ? 'text-richblack-700' : 'text-richblack-200'}`}>
                <span>{course.level}</span>
                <span className='flex items-center gap-3'>
                  <FaBookOpen aria-hidden='true' />
                  {course.lessonNumber} lessons
                </span>
              </span>
            </button>
          );
        })}
      </div>

        <div className='flex gap-8 mt-12'> 
            <ButtonCta active={true} linkTo={"/signup"} text={"Explore Full Catalog"} />
            <ButtonCta active={false} linkTo={"/login"} text={"Learn More"} />
        </div>
      
    </section>
  );
};

export default ExploreMore;
