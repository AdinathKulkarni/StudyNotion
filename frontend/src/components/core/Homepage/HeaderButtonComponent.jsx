import React from 'react'
import GradientHeading from './GradientHeading'
import LineItemText from './LineItemText'
import ButtonCta from './ButtonCta'

const HeaderButtonComponent = ({heading1, heading2, gradient, lineItem, btn1txt, btn2txt, link1, link2}) => {
  return (
        <div className='flex flex-col'>
            <GradientHeading segments={[`${heading1}`,{ text: `${gradient}`, gradient: true }, `${heading2}` ]} />
            <LineItemText text={`${lineItem}`}/>

            <div className='flex gap-[24px] pt-[52px]'>
                 <ButtonCta active={true} linkTo={`${link1}`} text={`${btn1txt}`} />
                 <ButtonCta active={false} linkTo={`${link2}`} text={`${btn2txt}`}  />
            </div>
        </div>
  )
}

export default HeaderButtonComponent