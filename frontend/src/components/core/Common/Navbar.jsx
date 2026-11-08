import React from 'react'
import logo from '../../../assets/Logo/Logo-Full-Light.png'
import { Link, matchPath, useLocation } from 'react-router-dom'
import NavbarLinks from '../../data/navbar-links'

const Navbar = () => {

    const location = useLocation();

    const matchRoute = (route) => {
        return matchPath({path: route}, location.pathname);
    }

  return (
    <div className='flex top w-full bg-richblack-900 z-10 fixed h-14 items-center justify-center border-b border-b-richblack-400 '>
        <div className='flex p- w-11/12 max-w-maxContent items-center justify-between'>
            <Link to="/" >
                <img src={logo}  />
            </Link>

            <nav>
                <ul className='flex gap-x-4 text-pure-greys-5'>
                    {
                        NavbarLinks.map( (link, index) => {
                         return   <li key={index}>
                                {
                                    link.title === 'Catalog' ? ( <div></div> ) : ( 
                                    <Link to={link?.path}>
                                        <p className={`${matchRoute(link?.path) ? "text-yellow-50" : "text-richblack-200"} `} >
                                            {link.title}
                                        </p>
                                    </Link>  
                                    )
                                }
                            </li>
                        } )
                    }
                </ul>
            </nav>

                
            

        </div>
    </div>
  )
}

export default Navbar