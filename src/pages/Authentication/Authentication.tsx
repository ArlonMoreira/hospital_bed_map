import React from 'react'
//styles
import styles from './Authentication.module.css';

type Props = {}

const Authentication = (props: Props) => {
  return (
    <div className={`${styles.coontainer_auth} p-0 p-sm-2 p-md-3 p-lg-4 p-xxl-5`}>
        <div className={`${styles.auth_item}`}>
            <div className={`${styles.slogan_area}`}>
                <div className={`${styles.logo_area}`}>
                    <div className='position-absolute w-100 h-100'>
                        <svg viewBox="0 0 220 192" width="180" height="180" fill="none" style={{right: 0}}><defs><pattern id="837c3e70-6c3a-44e6-8854-cc48c737b659" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="4" height="4" fill="currentColor"></rect></pattern></defs><rect width="220" height="192" fill="url(#837c3e70-6c3a-44e6-8854-cc48c737b659)"></rect></svg>
                        <svg viewBox="0 0 960 540" style={{width: '100%', height: '100%'}} preserveAspectRatio="xMidYMax slice"><g fill="none" stroke="currentColor" strokeWidth="100"><circle r="234" cx="196" cy="23"></circle><circle r="234" cx="790" cy="491"></circle></g></svg>                    
                    </div>                    
                    <div className='text-start'>
                        <h5>Mapa de Leitos</h5>
                        <h5>Hospitalar</h5>
                    </div>
                </div>
            </div>
            <div className={`${styles.auth_form}`}>

            </div>
        </div>
    </div>
  )
}

export default Authentication;