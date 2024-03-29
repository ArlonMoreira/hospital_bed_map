import React, { useEffect, useRef } from 'react'
//Styles
import styles from './Alert.module.css';

type Props = {
    message: string | null,
    type: 'error' | 'success';
}

const Alert = ({message, type}: Props) => {

    const alertRef = useRef<HTMLDivElement | null>(null);

    const showAlert = ():void => {
        alertRef.current?.classList.remove(styles.hide);
    };

    const hideAlert = ():void => {
        alertRef.current?.classList.add(styles.hide);
    };    

    useEffect(()=>{
        showAlert();

    }, [message]);

    return (
        <div className={`${styles.alert} ${type === 'success' && styles.success} ${type === 'error' && styles.error} ${styles.hide}`} ref={alertRef}>
            <div className={styles.alert_header}>
                <button className="small-button" type="button" onClick={hideAlert}>
                    <i className="bi bi-x fs-5"></i>
                </button>
            </div>
            <div className={styles.alert_body}>
                <div className={styles.icon_area}>
                    {type === 'success' && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
                        </svg>
                    )}
                    {type === 'error' && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/>
                        </svg>
                    )}
                </div>
                <div className={styles.message_area}>
                    <p>{message}</p>
                </div>
            </div>
        </div>
    )
}

export default Alert