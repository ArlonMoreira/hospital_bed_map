import React from 'react'
//styles
import styles from './Authentication.module.css';
import background from '../../background.svg';

type Props = {}

const Authentication = (props: Props) => {
  return (
    <div className={`${styles.coontainer_auth} p-0`}>
        <div className={`${styles.auth_item}`}>
            <div className={`${styles.slogan_area}`}>
                <div className={`${styles.presentation}`}>
                    <img src={background}></img>
                </div>
                <div className={`${styles.logo_area}`}>
                    <h5>Mapa de Leitos</h5>
                    <h5>Hospitalar</h5>
                </div>
            </div>
            <div className={`${styles.auth_form}`}>

            </div>
        </div>
    </div>
  )
}

export default Authentication;