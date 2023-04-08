import React, { useRef, MouseEventHandler } from 'react'
//styles
import styles from './Navbar.module.css';

type Props = {
  handleShow(buttonRef: React.RefObject<HTMLDivElement>, activeClass: any): MouseEventHandler<HTMLButtonElement>
}

const Navbar = ({handleShow}: Props) => {

  const button = useRef<HTMLDivElement>(null);

  const handleClick = handleShow(button, styles.active);

  return (
    <div>
        <div className={`${styles.menu_open} p-2`}>
            <button className='border-0' type='button' onClick={handleClick}>
                <div className={`${styles.iconArea}`} ref={button}>
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