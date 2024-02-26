import { useState } from 'react'
import  {navbarData,NavbarItem}from "./NavbarData.ts";
import { IonIcon } from '@ionic/react';
import { Link } from 'react-router-dom';


function Navbar():JSX.Element {

  const [slidebar,setSlidebar] = useState<boolean>(false);

  const buttonHandler = () => {setSlidebar(!slidebar)};

  return (
    <div className={`w-[200px] h-[100%] bg-[#7b312D] duration-75 transition absolute ${!slidebar && "left-[-145px]"} shadow-[0_0px_10px_rgba(0,0,0,0.6)] z-[1]`} >
      <div>
        <button onClick={buttonHandler} className='relative left-[155px] top-[5px]'>
        {slidebar ? <IonIcon className='text-4xl' name='close-outline'/> : <IonIcon className='text-4xl' name="menu-outline"/>}
        </button>
      </div>
      <div className='my-[35px] mx-[10px]'>
        <ul>
          {slidebar && navbarData.map((item: NavbarItem,index:number) => {
            return (<li key={index} >
              <Link to={item.path} className='flex my-[35px] gap-3 text-[#a1eff3]'>
              <div>
              <IonIcon className='text-2xl' name={item.icon} />
              </div>
              <span className='text-xl'>{item.title}</span>
              </Link>
            </li>);
          })}
        </ul>
      </div>
    </div>
  );
}

export default Navbar