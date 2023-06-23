import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
//styles
import styles from './Hospitals.module.css';
import { Tooltip } from 'react-tooltip';
import MaskedInput from 'react-input-mask';
//Redux
import { register, list, reset, update } from '../../slices/hospitalSlice';
import { refreshToken } from '../../slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { RootState } from '../../store';
//Interface
import { IHospitalParams, IHospital, IHospitalErrors } from '../../interfaces/Hospital';
//Components
import Alert from '../../components/Alert/Alert';
// Router
import { Link } from 'react-router-dom';

const Hospitals = () => {

    const dispatch = useDispatch<ThunkDispatch<RootState, IHospitalParams, AnyAction>>();
    const { successRegister, 
            successRegisterMessage,
            loading,
            hospitals,
            errorRegisterMessage,
            errorsRegister,
            errorUpdateMessage }: { 
                successRegister:boolean | null,
                successRegisterMessage:string | null,
                loading:boolean,
                hospitals: IHospital[],
                errorRegisterMessage: string | null,
                errorsRegister: IHospitalErrors | null,
                errorUpdateMessage: string | null} = useSelector((state: RootState) => state.hospital)

    /**
     * Register Hospital
     */

    const [cnes, setCnes] = useState<string>("");
    const [cnpj, setCnpj] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [acronym, setAcronym] = useState<string>("");
    const [is_active, setIs_active] = useState<boolean>(true);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const data:IHospitalParams  = {
            cnes,
            cnpj,
            name,
            acronym,
            is_active
        };
        
        dispatch(reset());
        await dispatch(refreshToken()); //Update token access after to send data
        await dispatch(register(data));
        
    };

    /**
     * Close modal and clear form when the register hospital is success.
     */

    const buttonCloseModal = useRef<HTMLInputElement>(null);

    useEffect(()=>{
        if(successRegister) {
            buttonCloseModal.current?.click();
            setCnes('');
            setCnpj('');
            setName('');
            setAcronym('');
            setIs_active(true);
        }

    }, [successRegister]);

    /**
     * List all hospital when dispatch update
     */
    useEffect(() => {
        dispatch(reset());

        (async () => {
            await dispatch(refreshToken()); //Update token access after to send data
            await dispatch(list());
            
        })();
        
    }, [dispatch]);

    /**
     * Active and desactive hospital
     */
    const [loadingHospitals, setLoadingHospitals] = useState<Array<boolean> | null>();

    const active = async (hospital: IHospital) => {
        //Updated hospital index
        const indexUpdate = hospitals.findIndex((current) => current.id === hospital.id);
        if(loadingHospitals){ //Loading card hospital start
            loadingHospitals[indexUpdate] = true;
        }
        
        //Active/Desactive hospital
        const newData = {
            ...hospital
        };
        newData.is_active = newData.is_active ? false: true;
        await dispatch(refreshToken()); //Update token access after to send data
        await dispatch(update({data:newData, id:hospital.id.toString()}));

        if(loadingHospitals){ //Loading card hospital end
            loadingHospitals[indexUpdate] = false;
        }
    };

    useEffect(()=>{
        if(hospitals){
            const states:Array<boolean> = [...hospitals.map(() => false)];
            setLoadingHospitals(states);
        }
    }, [hospitals]);

    return (
        <>  
            { errorUpdateMessage && <Alert message={errorUpdateMessage} trigger={errorUpdateMessage} type='error' />}
            { successRegisterMessage && <Alert message={successRegisterMessage} trigger={successRegister} type='success' />}
            { errorRegisterMessage && <Alert message={errorRegisterMessage} trigger={errorsRegister} type='error' /> }
            <div className={`${styles.hospitals_container}`}>
                <div data-bs-toggle="modal" data-bs-target="#register-hospital" className={`card ${styles.item} ${styles.insert_container}`}>
                    <a className={`${styles.insert_body}`}>
                        <svg viewBox="0 0 168 166">
                            <path d="M72 4.1c-8.7 1.3-21.7 5.9-28.7 10-7.9 4.8-20.5 16.9-25.7 24.7-17.7 26.8-17.7 61.7 0 88.3 5.3 7.9 17.8 20 25.7 24.8 12.3 7.3 32.3 11.9 46.2 10.6 15.9-1.4 32.6-7.9 44-17.2C152.8 129.6 163 108.1 163 83s-10.2-46.6-29.5-62.3c-7.2-5.8-21.6-12.9-30.6-15.1C94.5 3.5 80.2 2.9 72 4.1zm27 15.5c13.8 3.2 27.6 12.2 36.5 23.8 21.4 27.8 17 67.2-10.2 89.8-12.7 10.6-27.2 15.3-44.3 14.5-17.9-.8-30.7-6.5-43.5-19.2-12.2-12.1-18.6-27.7-18.8-45.5 0-10.5 1.5-17.2 6.3-27.5C31.2 42 40.6 32.2 54.2 25c12.2-6.5 30.6-8.8 44.8-5.4zM79.7 50c-2.6 2-2.6 2.5-2.9 13.8l-.3 11.7-11.7.3c-11.3.3-11.8.4-13.8 2.9-2.5 3.3-2.5 5.3.1 8.7 2 2.5 2.3 2.6 14 2.6H77v11.9c0 11.8 0 12 2.7 14.1 3.2 2.5 6.9 2 9.6-1.2 1.4-1.7 1.7-4 1.7-13.4V90h11.8c13.5 0 15.2-.8 15.2-7.2 0-5.9-1.9-6.8-15.3-6.8H91V64.6c0-9.4-.3-11.7-1.7-13.4-2.7-3.2-6.4-3.7-9.6-1.2z"/>
                        </svg>
                    </a>
                </div>
                {
                    hospitals && hospitals.map((hospital, i)=>(
                        <div key={hospital.id} className={`card border-0 shadow ${styles.item}`}>
                            <div className={`card-body position-relative d-flex justify-content-between ${!hospital.is_active && 'opacity-50'}`}>
                                {
                                    loadingHospitals && (
                                        loadingHospitals[i] ? (
                                            <div className={`${styles.loading_hospital}`}>
                                                <div className="spinner-border" role="status" style={{'color': 'var(--bs-gray-400)'}}>
                                                    <span className="sr-only"></span>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className='d-block'>
                                                    <div className={`${styles.identity} p-0 px-0`}>
                                                        <h5>
                                                            { hospital.acronym }
                                                        </h5>
                                                        <p>{ hospital.name }</p>
                                                    </div>
                                                    <hr></hr>
                                                    <ul className={`list-group p-0 list-group-flush ${styles.info}`}>
                                                        <li className="list-group-item p-0 border-0">
                                                            <span>00 leitos</span>
                                                        </li>
                                                    </ul>                                   
                                                </div>
                                                <div className={`${styles.actions}`}>
                                                    <ul className='nav justify-content-start'>
                                                        <li className='nav-item'>
                                                            <Tooltip anchorSelect=".edit-tooltip" place="right">
                                                                Editar cadastro
                                                            </Tooltip>
                                                            <Link className="edit-tooltip" to={`/hospitais/editar/${hospital.id}`}>
                                                                <svg viewBox="0 0 512 512" width={'1em'} height={'1em'}>
                                                                    <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"/>
                                                                </svg>
                                                            </Link>
                                                        </li>
                                                        <li className='nav-item'>
                                                            <Tooltip anchorSelect=".active-tooltip" place="right">
                                                                Ativar/Desativar
                                                            </Tooltip>
                                                            {
                                                                <a className="active-tooltip" onClick={() => active(hospital)}>
                                                                    {
                                                                        hospital.is_active ? (
                                                                            <svg viewBox="0 0 448 512" width={'1em'} height={'1em'}>
                                                                                <path d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z"/>
                                                                            </svg>
                                                                        ) : (
                                                                            <svg viewBox="0 0 576 512" width={'1em'} height={'1em'}>
                                                                                <path d="M352 144c0-44.2 35.8-80 80-80s80 35.8 80 80v48c0 17.7 14.3 32 32 32s32-14.3 32-32V144C576 64.5 511.5 0 432 0S288 64.5 288 144v48H64c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V256c0-35.3-28.7-64-64-64H352V144z"/>
                                                                            </svg>
                                                                        )
                                                                    }
                                                                </a>
                                                            }
                
                                                        </li>
                                                        <li className='nav-item'>
                                                            <Tooltip anchorSelect=".add-tooltip" place="right">
                                                                Cadastrar leitos
                                                            </Tooltip>
                                                            <Link className="add-tooltip" to={`/hospitais/cadastrar/${hospital.id}`}>
                                                                <svg viewBox="0 0 448 512" width={'1.2em'} height={'1.2em'}>
                                                                    <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/>
                                                                </svg>
                                                            </Link>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </> 
                                        )
                                    )
                                }
                            </div>
                        </div>                        
                    ))
                }
            </div>
            <div className='modal fade pb-5' id='register-hospital' data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className='modal-dialog modal-dialog-centered modal-lg'>
                    <div className='modal-content border-0'>
                        <div className='modal-header border-0 modal_header_bg p-4'>
                            <div className='d-flex'>
                                <svg viewBox="0 0 168 166" width="1.5em" height="1.5em">
                                    <path d="M72 4.1c-8.7 1.3-21.7 5.9-28.7 10-7.9 4.8-20.5 16.9-25.7 24.7-17.7 26.8-17.7 61.7 0 88.3 5.3 7.9 17.8 20 25.7 24.8 12.3 7.3 32.3 11.9 46.2 10.6 15.9-1.4 32.6-7.9 44-17.2C152.8 129.6 163 108.1 163 83s-10.2-46.6-29.5-62.3c-7.2-5.8-21.6-12.9-30.6-15.1C94.5 3.5 80.2 2.9 72 4.1zm27 15.5c13.8 3.2 27.6 12.2 36.5 23.8 21.4 27.8 17 67.2-10.2 89.8-12.7 10.6-27.2 15.3-44.3 14.5-17.9-.8-30.7-6.5-43.5-19.2-12.2-12.1-18.6-27.7-18.8-45.5 0-10.5 1.5-17.2 6.3-27.5C31.2 42 40.6 32.2 54.2 25c12.2-6.5 30.6-8.8 44.8-5.4zM79.7 50c-2.6 2-2.6 2.5-2.9 13.8l-.3 11.7-11.7.3c-11.3.3-11.8.4-13.8 2.9-2.5 3.3-2.5 5.3.1 8.7 2 2.5 2.3 2.6 14 2.6H77v11.9c0 11.8 0 12 2.7 14.1 3.2 2.5 6.9 2 9.6-1.2 1.4-1.7 1.7-4 1.7-13.4V90h11.8c13.5 0 15.2-.8 15.2-7.2 0-5.9-1.9-6.8-15.3-6.8H91V64.6c0-9.4-.3-11.7-1.7-13.4-2.7-3.2-6.4-3.7-9.6-1.2z"/>
                                </svg>
                                <h5 className='m-0 mx-1'>
                                    Cadastrar Hospital
                                </h5>
                            </div>
                        </div>
                        <form className='register_form' onSubmit={handleSubmit}>
                            <div className='modal-body p-4 row'>
                                <label className='col-6'>
                                    <span>CNES</span>
                                    <input
                                        className={`form-control ${errorsRegister?.cnes && 'border border-danger'}`}
                                        type='text'
                                        value={cnes}
                                        placeholder='0000000'
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setCnes(e.target.value)}
                                    />
                                    {
                                        errorsRegister?.cnes && (
                                            <ul className='error-message'>
                                                {
                                                    errorsRegister.cnes.map((error, i) => (
                                                        <li key={i}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
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
                                <label className='col-6'>
                                    <span>CNPJ</span>
                                    <MaskedInput
                                        mask="99.999.999/9999-99"
                                        className={`form-control ${errorsRegister?.cnpj && 'border border-danger'}`}
                                        type='text'
                                        value={cnpj}
                                        placeholder='00.000.000/0000-00'
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setCnpj(e.target.value)}
                                    />
                                    {
                                        errorsRegister?.cnpj && (
                                            <ul className='error-message'>
                                                {
                                                    errorsRegister.cnpj.map((error, i) => (
                                                        <li key={i}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
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
                                <label className='col-6'>
                                    <span>Nome</span>
                                    <input
                                        className={`form-control ${errorsRegister?.name && 'border border-danger'}`}
                                        type='text'
                                        value={name}
                                        placeholder='Razão Social/Nome Fantasia'
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                                    />
                                    {
                                        errorsRegister?.name && (
                                            <ul className='error-message'>
                                                {
                                                    errorsRegister.name.map((error, i) => (
                                                        <li key={i}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
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
                                <label className='col-6'>
                                    <span>Sigla</span>
                                    <input 
                                        className={`form-control ${errorsRegister?.acronym && 'border border-danger'}`}
                                        type='text'
                                        value={acronym}
                                        placeholder='Sigla/Apelido'
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setAcronym(e.target.value)}
                                    />
                                    {
                                        errorsRegister?.acronym && (
                                            <ul className='error-message'>
                                                {
                                                    errorsRegister.acronym.map((error, i) => (
                                                        <li key={i}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
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
                            <div className='modal-footer border-0 modal_footer_bg px-4'>
                                {
                                    loading ? (
                                        <button className='form-control' disabled>
                                            <div className="spinner-border" role="status">
                                                <span className="sr-only"></span>
                                            </div>
                                        </button>                                        
                                    ) : (
                                        <input type='submit' value='Cadastrar'/>
                                    )
                                }
                                <input ref={buttonCloseModal} className='cancel' type='cancel' defaultValue='Cancelar' data-bs-dismiss="modal" aria-label="Close"/>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Hospitals;