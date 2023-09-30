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
import { hospital as getDataHospital, reset, update, hideAlerts } from '../../slices/hospitalSlice';
import { refreshToken } from '../../slices/authSlice';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { RootState } from '../../store';
//Hooks
import { useParams } from 'react-router-dom';
//Interface
import { IHospital, IHospitalParams, IHospitalErrors } from '../../interfaces/Hospital';

type Props = {}

const EditHospital = (props: Props) => {
  //Params
  const { hospital } = useParams();
  //dispatch
  const dispatch = useDispatch<ThunkDispatch<RootState, any, AnyAction>>();

  /**
   * Get data Hospital
   */
  const { 
      hospital: hospitalData,
      successUpdate,
      successUpdateMessage,
      loading,
      errorsUpdate,
      errorUpdateMessage,
      errorUpdate
    }: { 
    hospital: IHospital | null,
    successUpdate: boolean | null,
    successUpdateMessage: string | null,
    errorsUpdate: IHospitalErrors | null,
    errorUpdateMessage: string | null,
    errorUpdate: boolean | null,
    loading: boolean } = useSelector((state: RootState) => state.hospital);

  const [cnes, setCnes] = useState<string>("");
  const [cnpj, setCnpj] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [acronym, setAcronym] = useState<string>("");

  useEffect(()=>{
    //Reset data
    dispatch(reset());
    //Reset alerts
    dispatch(hideAlerts());

    const update = async () => {
      if(hospital){
        await dispatch(refreshToken());
        await dispatch(getDataHospital(hospital));
      }
    };

    update();
    
  }, [dispatch, hospital]);

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

    if(hospital){
      dispatch(reset());
      await dispatch(refreshToken()); //Update token access after to send data
      await dispatch(update({data, hospital}));
    }

  };

  /**
   * Apresentar alerta de erro.
   */
  const [showErrorAlert, setShowErrorAlert] = useState<boolean>();
  const [showSuccessAlert, setShowSuccessAlert] = useState<boolean>();

  useEffect(()=>{
    if(errorUpdate && errorUpdateMessage){
      setShowErrorAlert(true);

      const timeout = setTimeout(()=>{
        setShowErrorAlert(false);
        dispatch(hideAlerts());
      }, 3200);

      return () => {
        clearTimeout(timeout)
      };

    } else {
      setShowErrorAlert(false);
    }

  }, [errorUpdate, errorUpdateMessage]);

  useEffect(()=>{
    if(successUpdate && successUpdateMessage){
      setShowSuccessAlert(true);

      const timeout = setTimeout(()=>{
        setShowSuccessAlert(false);
        dispatch(hideAlerts());
      }, 3200);

      return () => {
        clearTimeout(timeout)
      };

    } else {
      setShowSuccessAlert(false);
    }

  }, [successUpdate, successUpdateMessage]);

  return (
    <>
      {showErrorAlert && <Alert message={errorUpdateMessage} type='error'/>}
      {showSuccessAlert && <Alert message={successUpdateMessage} type='success'/>}
      <div className={`${styles.page} p-2`}>
        <div className={`${styles.navigate} px-0`}>
          <Link to='/hospitais'>
            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
              <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 288 480 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-370.7 0 73.4-73.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-128 128z"/>
            </svg>
            <span>Hospitais</span>    
          </Link>
        </div>
        <div className='p-4 px-0'>
          <h5 className='fw-bold'>Editar Cadastro</h5>
        </div>
        <div className={`card ${styles.form_edit} px-2`}>
          <form className='register_form' onSubmit={handleSubmit}>
            <div className='card-body row p-4 pb-0'>
              <label className='col-12 col-lg-6'>
                <span>CNES</span>
                <input
                  className={`form-control ${errorsUpdate?.cnes && 'border border-danger'}`}
                  type='text'
                  value={cnes}
                  placeholder='0000000'
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setCnes(e.target.value)}
                />
                {
                  errorsUpdate?.cnes && (
                    <ul className='error-message'>
                    {
                      errorsUpdate.cnes.map((error, i)=>(
                        <li key={i}>
                          <svg viewBox="0 0 512 512">
                              <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/>
                          </svg>
                          <p>{error}</p>
                        </li>
                      ))
                    }
                    </ul>
                  )
                }
              </label>
              <label className='col-12 col-lg-6'>
                <span>CNPJ</span>
                <MaskedInput
                  mask="99.999.999/9999-99"
                  className={`form-control ${errorsUpdate?.cnpj && 'border border-danger'}`}
                  type='text'
                  value={cnpj}
                  placeholder='00.000.000/0000-00'
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setCnpj(e.target.value)}
                />
                {
                  errorsUpdate?.cnpj && (
                    <ul className='error-message'>
                      {
                        errorsUpdate.cnpj.map((error, i)=>(
                          <li key={i}>
                            <svg viewBox="0 0 512 512">
                                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/>
                            </svg>
                            <p>{error}</p>
                          </li>
                        ))
                      }
                    </ul>
                  )
                }
              </label>
              <label className='col-12 col-lg-6'>
                <span>Sigla</span>
                <input
                  className={`form-control ${errorsUpdate?.acronym && 'border border-danger'}`}
                  type='text'
                  value={acronym}
                  placeholder='Sigla/Apelido'
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setAcronym(e.target.value)}
                />
                {
                  errorsUpdate?.acronym && (
                    <ul className='error-message'>
                      {
                        errorsUpdate.acronym.map((error, i)=>(
                          <li key={i}>
                            <svg viewBox="0 0 512 512">
                                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/>
                            </svg>
                            <p>{error}</p>
                          </li>
                        ))
                      }
                    </ul>
                  )
                }
              </label>
              <label className='col-12 col-lg-6'>
                <span>Nome</span>
                <input
                  className={`form-control ${errorsUpdate?.name && 'border border-danger'}`}
                  type='text'
                  value={name}
                  placeholder='Razão Social/Nome Fantasia'
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                />
                {
                  errorsUpdate?.name && (
                    <ul className='error-message'>
                      {
                        errorsUpdate.name.map((error, i)=>(
                          <li key={i}>
                            <svg viewBox="0 0 512 512">
                                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/>
                            </svg>
                            <p>{error}</p>
                          </li>
                        ))
                      }
                    </ul>
                  )
                }
              </label>
            </div>
            <div className='card-footer border-0 bg-transparent'>
              {
                loading ? (
                  <div className='col-12 col-md-4'>
                    <button className='form-control' disabled>
                      <div className="spinner-border" role="status">
                        <span className="sr-only"></span>
                      </div>
                    </button>                     
                  </div>
                ) : (
                  <input type='submit' className='col-12 col-md-4'  value="Atualizar"/>
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