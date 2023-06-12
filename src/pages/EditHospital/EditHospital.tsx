import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
//Styles
import styles from './EditHospital.module.css';
import MaskedInput from 'react-input-mask';
//Components
import Alert from '../../components/Alert/Alert';
//Router
import { Link } from 'react-router-dom';
//Redux
import { useDispatch, useSelector } from 'react-redux';
import { hospital, reset, update } from '../../slices/hospitalSlice';
import { refreshToken } from '../../slices/authSlice';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { RootState } from '../../store';
//Hooks
import { useParams } from 'react-router-dom';
//Interface
import { IHospital, IHospitalParams } from '../../interfaces/Hospital';

type Props = {}

const EditHospital = (props: Props) => {
  //Params
  const { id } = useParams();
  //dispatch
  const dispatch = useDispatch<ThunkDispatch<RootState, any, AnyAction>>();

  /**
   * Get data Hospital
   */
  const { hospital: hospitalData, successUpdate, successUpdateMessage, loading }: { 
    hospital: IHospital | null,
    successUpdate: boolean | null,
    successUpdateMessage: string | null,
    loading: boolean } = useSelector((state: RootState) => state.hospital);

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

  /**
   * Updatedata
   */

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data:IHospitalParams = {
      cnes,
      cnpj,
      name,
      acronym
    };

    if(id){
      await dispatch(reset());
      await dispatch(update({data, id}));
    }

  };

  return (
    <>
      {successUpdateMessage && <Alert trigger={successUpdate} message={successUpdateMessage} type='success'/>}
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
          <form className={`${styles.register_form}`} onSubmit={handleSubmit}>
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
              {
                loading ? (
                  <button className='form-control w-25' disabled>
                    <div className="spinner-border" role="status">
                      <span className="sr-only"></span>
                    </div>
                  </button> 
                ) : (
                  <input type='submit' className='form-control w-25'  value="Atualizar"/>
                )
              }
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default EditHospital;