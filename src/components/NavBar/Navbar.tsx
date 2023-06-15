import React, { useRef, useEffect } from 'react'
//styles
import styles from './Navbar.module.css';
//Hooks
import { useWindowSize } from 'react-use';
import { useAuth } from '../../hooks/useAuth';
//Rooter
import { NavLink } from 'react-router-dom';

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
        button.current?.classList.add('active');
      } else {
        sidebarRef.current?.classList.add('d-none');
        button.current?.classList.remove('active');
      }
    }    
  }, [width, sidebarRef]);

  //Essa função irá ocultar a barra de navegação a partir da referência sidebar
  const handleShow = (): void => {
    if(sidebarRef){
      sidebarRef.current?.classList.toggle('d-none');
      button.current?.classList.toggle('active'); //Ative e desativa o botão da sidebar, indicando que a sidebar está aberta ou fechada.
    }
  };

  const { auth } = useAuth();

  return (
    <div className={styles.container_navbar}>
        <div className={`${styles.menu_open} py-1 px-1 py-sm-1 px-sm-1 py-md-2 px-md-2`}>
            <button className='border-0' type='button' onClick={handleShow}>
                <div className='nav_button' ref={button}>
                    <span></span>
                    <span></span>
                    <span></span> 
                </div>
            </button>
        </div>
        <div className={styles.tools}>
          <a className={styles.tools_item}>
            <svg viewBox="0 0 170 169">
              <g transform="translate(0 169) scale(.1 -.1)">
                <path d="m816 1629c-26-20-26-22-26-154s0-134 26-154c35-27 59-26 89 4 24 23 25 30 25 150s-1 127-25 150c-30 30-54 31-89 4z"/><path d="m330 1432c-32-10-50-36-50-70 0-30 11-46 82-118 45-46 90-86 100-90 52-16 106 32 93 83-8 33-148 179-184 191-14 5-33 7-41 4z"/><path d="m1335 1421c-17-10-63-52-102-94-82-84-92-116-50-155 44-41 71-30 168 67 73 72 89 94 89 119 0 60-55 94-105 63z"/><path d="m777 1190c-99-25-191-103-235-198-22-48-27-71-27-142s5-94 27-142c34-73 103-142 176-176 71-33 179-36 260-9 66 23 154 102 190 171 24 46 27 61 27 156s-3 110-27 156c-35 66-124 147-185 168-60 21-156 28-206 16z"/><path d="m81 894c-12-15-21-34-21-44s9-29 21-44c20-26 22-26 148-26 151 0 171 8 171 70s-20 70-171 70c-126 0-128 0-148-26z"/><path d="m1331 894c-12-15-21-34-21-44s9-29 21-44c20-26 22-26 153-26 150 0 166 7 166 72 0 61-18 68-168 68-129 0-131 0-151-26z"/><path d="m368 462c-77-78-88-92-88-124 0-49 29-73 84-69 22 1 162 134 182 173 20 38 18 55-11 83-43 44-69 35-167-63z"/><path d="m1182 527c-40-42-30-71 56-159 42-44 89-86 104-94 49-25 98 10 98 72 0 20-21 48-89 115-98 99-128 110-169 66z"/><path d="m816 379c-26-20-26-22-26-154s0-134 26-154c35-27 59-26 89 4 24 23 25 30 25 150s-1 127-25 150c-30 30-54 31-89 4z"/>
              </g>
            </svg>                 
          </a>
          {
            auth ? (
              <a data-bs-toggle="modal" data-bs-target="#logout-modal" className={`${styles.tools_item} ${styles.auth_item}`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"/>
                </svg>
              </a>             
            ) : (
              <NavLink to='/login' className={`${styles.tools_item} ${styles.auth_item}`}>
                <svg viewBox="0 0 448 512">
                  <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/>
                </svg>                  
              </NavLink>
            )
          }
        </div> 
    </div>
  )
}

export default Navbar;