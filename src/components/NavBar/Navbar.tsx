import React, { useRef, MouseEventHandler, useEffect } from 'react'
//styles
import styles from './Navbar.module.css';
//Hooks
import { useWindowSize } from 'react-use';

type Props = {
  handleShow(buttonRef: React.RefObject<HTMLDivElement>, activeClass: any): MouseEventHandler<HTMLButtonElement>,
  resizeShow(buttonRef: React.RefObject<HTMLDivElement>, activeClass: any, show: boolean): void
}

const Navbar = ({handleShow, resizeShow}: Props) => {

  const button = useRef<HTMLDivElement>(null);
  const handleClick = handleShow(button, styles.active);
  const { width } = useWindowSize();

  useEffect(()=>{
    resizeShow(button, styles.active, width < 768? false: true);
  }, [width]);

  return (
    <div>
        <div className={`${styles.menu_open} py-1 px-1 py-sm-1 px-sm-1 py-md-2 px-md-2`}>
            <button className='border-0' type='button' onClick={handleClick}>
                <div className={`${styles.iconArea} ${styles.active}`} ref={button}>
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