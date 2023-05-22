import React, { useRef, useEffect } from 'react'
//styles
import styles from './Navbar.module.css';
import logo from '../../logo_min.svg';
//Hooks
import { useWindowSize } from 'react-use';

type Props = {
  sidebarRef: React.RefObject<HTMLDivElement>
}

const Navbar = ({sidebarRef}: Props) => {

  const button = useRef<HTMLDivElement>(null); 

  /**
   * Start: Apresentar e ocultar o sidebar em telas inferiores à 768 píxels
   */
  const { width } = useWindowSize();

  useEffect(()=>{
    const show = width < 768? false: true;
    if(sidebarRef){
      if(show){
        sidebarRef.current?.classList.remove('d-none');
        button.current?.classList.remove(styles.active);
      } else {
        sidebarRef.current?.classList.add('d-none');
        button.current?.classList.add(styles.active);
      }
    }    
  }, [width, sidebarRef]);

  //Essa função irá ocultar a barra de navegação a partir da referência sidebar
  const handleShow = (): void => {
    if(sidebarRef){
      sidebarRef.current?.classList.toggle('d-none');
      button.current?.classList.toggle(styles.active); //Ative e desativa o botão da sidebar, indicando que a sidebar está aberta ou fechada.
    }
  };  

  return (
    <div className={styles.container_navbar}>
        <div className={`${styles.menu_open} py-1 px-1 py-sm-1 px-sm-1 py-md-2 px-md-2`}>
            <button className='border-0' type='button' onClick={handleShow}>
                <div className={`${styles.iconArea} ${styles.active}`} ref={button}>
                    <span></span>
                    <span></span>
                    <span></span> 
                </div>
            </button>
        </div>
        <div className={styles.utils}>
          <a className={styles.utils_item}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/>
            </svg>                  
          </a>
        </div> 
    </div>
  )
}

export default Navbar;