import React, { useEffect, useState } from 'react'
//styles
import styles from './Navbar.module.css';

type Props = {}

const Navbar = (props: Props) => {

  const [show, setShow] = useState<boolean>(false);

  const handleShow = () => {
    if(show) {
      setShow(false);
    } else {
      setShow(true);
    }
  };

  useEffect(()=>{
    console.log(show)
  }, [show]);

  return (
    <div>
        <div className={`${styles.menu_open} p-2`}>
            <button className='border-0' type='button' onClick={handleShow}>
                <div className={`${styles.iconArea}`}>
                    <span></span>
                    <span></span>
                    <span></span> 
                </div>
            </button>
        </div>
        <div>
            
        </div>
    </div>
  )
}

export default Navbar