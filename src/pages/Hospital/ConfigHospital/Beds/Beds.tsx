import React, { SelectHTMLAttributes, useEffect, useState } from 'react'
//Styles
import styles from './Beds.module.css';
//Redux
import { refreshToken } from '../../../../slices/authSlice';
import { list, occupation } from '../../../../slices/bedSlice';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch, AnyAction } from '@reduxjs/toolkit';
import { RootState } from '../../../../store';
//Interface
import { IBed, IStatus, IType } from '../../../../interfaces/Bed';


type Props = {
  sector: string | undefined;
}

const Beds = ({sector}: Props) => {

  const dispatch = useDispatch<ThunkDispatch<RootState, any, AnyAction>>();
  const { beds }: { beds: IBed[] } = useSelector((state: RootState) => state.bed);

  const { 
    statusData,
    typeData
  }: {
    statusData: IStatus[],
    typeData: IType[]
  } = useSelector((state: RootState) => state.formBed);

  useEffect(()=>{
    if(sector){
      dispatch(refreshToken());
      dispatch(list({sector}));
    }
    
  }, [sector]);

  const handleChangeStatus = async ({bed_id, e}:{bed_id:string, e:React.ChangeEvent<HTMLSelectElement>}) => {
    e.preventDefault();

    const data = {
      bed: bed_id,
      data: {
        type_occupation: parseInt(e.target.value)
      }
    };

    await dispatch(refreshToken());
    await dispatch(occupation(data));

  };

  return (
    <div className='p-4'>
      <div className={`${styles.container}`}>
        <a data-bs-toggle="modal" data-bs-target="#add-bed-modal" className={`${styles.item} ${styles.add} d-flex justify-content-center align-items-center`}>
          <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
            <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/>
          </svg>
        </a>
        {
          beds.map((bed)=>{
            return (
              <div className={`${styles.content} ${styles.item} ${styles[bed.type_occupation_status]}`} key={bed.id}>
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 640 512">
                  <path d="M32 32c17.7 0 32 14.3 32 32V320H288V160c0-17.7 14.3-32 32-32H544c53 0 96 43 96 96V448c0 17.7-14.3 32-32 32s-32-14.3-32-32V416H352 320 64v32c0 17.7-14.3 32-32 32s-32-14.3-32-32V64C0 46.3 14.3 32 32 32zm144 96a80 80 0 1 1 0 160 80 80 0 1 1 0-160z"/>
                </svg>    
                <h5>{bed.name}</h5>
                <label className='w-100'>
                  <select
                    className={`${styles.select} form-select`}
                    value={bed.type_occupation_id.toString()}
                    onChange={(e) => handleChangeStatus({bed_id: bed.id.toString(), e})}
                  >
                    {
                      statusData && statusData.map((status,i)=>(
                          <option key={i} value={status.id?.toString()}>{status.description}</option>
                      ))
                    }                  
                  </select>
                </label>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default Beds;