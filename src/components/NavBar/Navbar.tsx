import React, { useRef, useEffect } from 'react'
//styles
import styles from './Navbar.module.css';
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
    <div>
        <div className={`${styles.menu_open} py-1 px-1 py-sm-1 px-sm-1 py-md-2 px-md-2`}>
            <button className='border-0' type='button' onClick={handleShow}>
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

export default Navbar;