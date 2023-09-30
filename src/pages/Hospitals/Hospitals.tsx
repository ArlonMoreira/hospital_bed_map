import { useEffect, useState } from 'react'
//styles
import styles from './Hospitals.module.css';
import { Tooltip } from 'react-tooltip';
//Redux
import { list, reset, update, hideAlerts } from '../../slices/hospitalSlice';
import { refreshToken } from '../../slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { RootState } from '../../store';
//Interface
import { IHospital } from '../../interfaces/Hospital';
//Components
import Alert from '../../components/Alert/Alert';
import RegisterHospital from '../../components/RegisterHospital/RegisterHospital';
// Router
import { Link } from 'react-router-dom';

const Hospitals = () => {
    /**
     * Hospital Slices
    */

    const dispatch = useDispatch<ThunkDispatch<RootState, any, AnyAction>>();
    const { 
            hospitals,
            errorUpdate,
            errorUpdateMessage
            }: { 
                hospitals: IHospital[],
                errorUpdate: boolean | null,
                errorUpdateMessage: string | null,
            } = useSelector((state: RootState) => state.hospital)

    /**
     * List all hospital when dispatch update
     */
    useEffect(()=>{
        dispatch(hideAlerts());
    }, []);

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
        await dispatch(update({data:newData, hospital:hospital.id.toString()}));
    
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

    /**
     * Alert
     */
    const [ showErrorUpdateAlert, setErrorUpdateAlert ] = useState<boolean>(false);

    useEffect(()=>{
        if(errorUpdate && errorUpdateMessage){
            setErrorUpdateAlert(true);

            const timeout = setTimeout(()=> {
                setErrorUpdateAlert(false);
                dispatch(hideAlerts());
            }, 2600);

            return () => {
                clearTimeout(timeout);
            } 
        } else {
            setErrorUpdateAlert(false);
        }

    }, [errorUpdate, errorUpdateMessage]);

    const clearModal = () => {
        dispatch(reset());
    };

    return (
        <>
            { showErrorUpdateAlert && <Alert message={errorUpdateMessage} type='error'/> }
            <div className={`${styles.hospitals_container}`}>
                <div data-bs-toggle="modal" data-bs-target="#register-hospital" className={`card ${styles.item} ${styles.insert_container}`} onClick={clearModal}>
                    <a className={`${styles.insert_body}`}>
                        <svg viewBox="0 0 168 166">
                            <path d="M72 4.1c-8.7 1.3-21.7 5.9-28.7 10-7.9 4.8-20.5 16.9-25.7 24.7-17.7 26.8-17.7 61.7 0 88.3 5.3 7.9 17.8 20 25.7 24.8 12.3 7.3 32.3 11.9 46.2 10.6 15.9-1.4 32.6-7.9 44-17.2C152.8 129.6 163 108.1 163 83s-10.2-46.6-29.5-62.3c-7.2-5.8-21.6-12.9-30.6-15.1C94.5 3.5 80.2 2.9 72 4.1zm27 15.5c13.8 3.2 27.6 12.2 36.5 23.8 21.4 27.8 17 67.2-10.2 89.8-12.7 10.6-27.2 15.3-44.3 14.5-17.9-.8-30.7-6.5-43.5-19.2-12.2-12.1-18.6-27.7-18.8-45.5 0-10.5 1.5-17.2 6.3-27.5C31.2 42 40.6 32.2 54.2 25c12.2-6.5 30.6-8.8 44.8-5.4zM79.7 50c-2.6 2-2.6 2.5-2.9 13.8l-.3 11.7-11.7.3c-11.3.3-11.8.4-13.8 2.9-2.5 3.3-2.5 5.3.1 8.7 2 2.5 2.3 2.6 14 2.6H77v11.9c0 11.8 0 12 2.7 14.1 3.2 2.5 6.9 2 9.6-1.2 1.4-1.7 1.7-4 1.7-13.4V90h11.8c13.5 0 15.2-.8 15.2-7.2 0-5.9-1.9-6.8-15.3-6.8H91V64.6c0-9.4-.3-11.7-1.7-13.4-2.7-3.2-6.4-3.7-9.6-1.2z"/>
                        </svg>
                    </a>
                </div>
                {
                    hospitals && hospitals.map((hospital, i)=>(
                        <div key={hospital.id} className={`card border-0 ${styles.item}`} style={{'animationDelay': `${i/20}s`}}>
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
            <RegisterHospital/>
        </>
    )
}

export default Hospitals;