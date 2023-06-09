import React, { ChangeEvent, useEffect, useState } from 'react'
//Styles
import styles from './EditHospital.module.css';
import MaskedInput from 'react-input-mask';
//Router
import { Link } from 'react-router-dom';
//Redux
import { useDispatch, useSelector } from 'react-redux';
import { hospital, reset } from '../../slices/hospitalSlice';
import { refreshToken } from '../../slices/authSlice';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { RootState } from '../../store';
//Hooks
import { useParams } from 'react-router-dom';
//Interface
import { IHospital } from '../../interfaces/Hospital';

type Props = {}

const EditHospital = (props: Props) => {

  /**
   * Get data Hospital
   */
  const { id } = useParams();
  const dispatch = useDispatch<ThunkDispatch<RootState, number, AnyAction>>();
  const { hospital: hospitalData }: { hospital: IHospital | null } = useSelector((state: RootState) => state.hospital);
  const [cnes, setCnes] = useState<string>("");
  const [cnpj, setCnpj] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [acronym, setAcronym] = useState<string>("");

  useEffect(()=>{
    //Reset data
    dispatch(reset());

    const update = async () => {
      if(id){
        await dispatch(refreshToken());
        await dispatch(hospital(id));
      }
    };

    update();
    
  }, [dispatch, id]);

  useEffect(()=>{
    if(hospitalData){
      setCnes(hospitalData.cnes);
      setCnpj(hospitalData.cnpj);
      setName(hospitalData.name);
      setAcronym(hospitalData.acronym);
    }
 
  }, [hospitalData]);

  return (
    <div className={`${styles.page} p-4`}>
      <div className={`${styles.navigate} px-0`}>
        <Link to='/hospitais'>
        <svg width="1.16em" height="1.16em" version="1.0" viewBox="0 0 148 130">
          <g transform="translate(0 130) scale(.1 -.1)">
            <path d="m338 962c-220-219-288-293-288-312 0-18 67-91 282-307 156-156 291-286 301-289 21-7 57 21 57 43 0 8-106 123-235 256l-235 242 600 5c638 5 620 4 620 50s18 45-620 50l-600 5 235 242c129 133 235 248 235 256 0 17-32 47-51 47-7 0-143-129-301-288z"/>
          </g>
        </svg>
          Hospitais
        </Link>
      </div>
      <div className='p-4 px-0'>
        <h5 className='fw-bold'>Editar Cadastro</h5>
      </div>
      <div className={`card ${styles.form_edit} shadow px-2`}>
        <form className={`${styles.register_form}`}>
          <div className='card-body row p-4'>
            <label className='col-12'>
              <span>CNES</span>
              <input
                className='form-control'
                type='text'
                value={cnes}
                placeholder='0000000'
                onChange={(e: ChangeEvent<HTMLInputElement>) => setCnes(e.target.value)}
              />
            </label>
            <label className='col-12'>
              <span>CNPJ</span>
              <MaskedInput
                mask="99.999.999/9999-99"
                className='form-control'
                type='text'
                value={cnpj}
                placeholder='00.000.000/0000-00'
                onChange={(e: ChangeEvent<HTMLInputElement>) => setCnpj(e.target.value)}
              />
            </label>
            <label className='col-12'>
              <span>Sigla</span>
              <input
                className='form-control'
                type='text'
                value={acronym}
                placeholder='Sigla/Apelido'
                onChange={(e: ChangeEvent<HTMLInputElement>) => setAcronym(e.target.value)}
              />
            </label>
            <label className='col-12'>
              <span>Nome</span>
              <input
                className='form-control'
                type='text'
                value={name}
                placeholder='Razão Social/Nome Fantasia'
                onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              />
            </label>
          </div>
          <div className='card-footer border-0 bg-transparent'>

          </div>
        </form>
      </div>
    </div>
  )
}

export default EditHospital;