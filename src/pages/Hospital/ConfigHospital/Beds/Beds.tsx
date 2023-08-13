import React, { useEffect, useState } from 'react'
//Styles
import styles from './Beds.module.css';
//Redux
import { list } from '../../../../slices/bedSlice';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch, AnyAction } from '@reduxjs/toolkit';
import { RootState } from '../../../../store';
//Interface
import { IBed } from '../../../../interfaces/Bed';

type Props = {
  sector: string | undefined;
}

const Beds = ({sector}: Props) => {

  const dispatch = useDispatch<ThunkDispatch<RootState, any, AnyAction>>();
  const { beds }: { beds: IBed[] } = useSelector((state: RootState) => state.bed);

  useEffect(()=>{
    if(sector){
      dispatch(list({sector}));
    }
    
  }, [sector]);
  
  return (
    <div className='p-4'>
      <div className={`${styles.container}`}>
        <a data-bs-toggle="modal" data-bs-target="#add-bed-modal" className={`${styles.item} ${styles.add} d-flex justify-content-center align-items-center`}>
          <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
            <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/>
          </svg>
        </a>
        {
          beds.map((bed)=>(
            <div className={`${styles.item} ${styles[bed.type_occupation_status]}`} key={bed.id}>

            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Beds;