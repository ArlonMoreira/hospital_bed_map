import React, { useEffect, useState } from 'react'
//Styles
import styles from './Beds.module.css';

type Props = {}

const Beds = (props: Props) => {

  return (
    <div className='p-4'>
      <div className={`${styles.container}`}>
        <a data-bs-toggle="modal" data-bs-target="#add-bed-modal" className={`${styles.item} ${styles.add} d-flex justify-content-center align-items-center`}>
          <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
            <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/>
          </svg>
        </a>
      </div>
    </div>
  )
}

export default Beds;