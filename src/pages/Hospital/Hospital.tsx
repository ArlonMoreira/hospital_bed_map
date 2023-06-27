import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
//Router
import { Routes, Route, NavLink } from "react-router-dom";
//Styles
import styles from './Hospital.module.css';
//Router
import { Link } from 'react-router-dom';
//Redux
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { hospital as getDataHospital } from '../../slices/hospitalSlice';
import { list as listTypeAccomodation, reset as resetTypeAccomodation } from '../../slices/typeAccomodationSlice';
import { register, reset as resetSector, list as listSector } from '../../slices/sectorSlice';
import { refreshToken } from '../../slices/authSlice';
//Hooks
import { useParams } from 'react-router-dom';
import { useRef } from 'react';
//Interface
import { IHospital } from '../../interfaces/Hospital';
import { ITypeAccommodation } from '../../interfaces/TypeAccommodation';
import { ISector, ISectorParams, ISectorErrors } from '../../interfaces/Sector';
//Component
import Alert from '../../components/Alert/Alert';
//Pages
import ConfigHospital from './ConfigHospital/ConfigHospital';

type Props = {}

const Hospital = (props: Props) => {

    //Redux dispatch
    const dispatch = useDispatch<ThunkDispatch<RootState, any, AnyAction>>();
    //Params
    const { hospital } = useParams();

    /**
     * Show sidebar
     * When click in fade page, the aside area is closed.
     */

    const pageAside = useRef<HTMLDivElement>(null);

    const handleShow = ():void => {
        pageAside.current?.classList.toggle(styles.open);
    };

    /**
     * Get data hospital
     */
    //Hospital data from hospital slice
    const { hospital: hospitalData }: { hospital: IHospital | null } = useSelector((state: RootState) => state.hospital);
    //Type accomodation data from typeAccomodation slice
    const { typeAccommodation } : { typeAccommodation:ITypeAccommodation[] } = useSelector((state: RootState) => state.typeAccomodation)

    //when open this page, the data contained in the slice of accommodation type and sectors will be cleared
    useEffect(()=>{
        //Clear type accomodation data. Then type accomodation is used in select form.
        dispatch(resetTypeAccomodation());
        //Clear data sector
        dispatch(resetSector());

        const refresh = async() => {
            if(hospital){ //run only when params id is passed
                await dispatch(refreshToken()); //Update authentication tokens to fetch data from the backend
                dispatch(getDataHospital(hospital)); //Update data of hospital
                dispatch(listTypeAccomodation()); //Update data of list select the type accomodation
                dispatch(listSector(hospital)); //Update data of sectors
            }
        }

        refresh();

    }, [dispatch, hospital]);

    /**
     * Submit form Sectors
     */
    const { sectors,
            successRegister,
            errorRegisterMessage,
            loading,
            errorsRegister } : { 
                sectors: ISector[],
                successRegister: boolean | null,
                loading: boolean,
                errorRegisterMessage: string | null,
                errorsRegister: ISectorErrors | null
            } = useSelector((state: RootState) => state.sector);

    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [tip_acc, setTip_acc] = useState<string>('');
    const [is_active, setIs_active] = useState<boolean>(false);
    const buttonClose = useRef<HTMLInputElement>(null);

    //Populate tip_acc state with fist data in typeAccommodation like default
    useEffect(()=>{
        if(typeAccommodation.length > 0){
            setTip_acc(typeAccommodation[0].description);
        }
    }, [typeAccommodation]);
    
    //Register sector
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) =>{
        e.preventDefault();

        const data: ISectorParams = {
            name,
            description,
            tip_acc,
            is_active
        };
        
        if (hospitalData){
            dispatch(resetSector());
            await dispatch(refreshToken());
            await dispatch(register({hospital: hospitalData.id.toString(), data}));
        }

    };

    //Clear data form when registered is success
    useEffect(()=>{
        if(successRegister){
            buttonClose.current?.click();
            setName('');
            setDescription('');
            setIs_active(false);
        }
    }, [successRegister, typeAccommodation]);

    /**
     * Navigate first type accomodation default
     */
    const navigate = useNavigate();
    
    useEffect(() => {
        const lastSectorIndex = sectors.indexOf(sectors[0]);
        if(lastSectorIndex !== -1){
            navigate(`configurar/${sectors[lastSectorIndex].id}/leitos`);
        } else {
            navigate(``);
        }

      }, [sectors]);
    
    return (
        <>
            { errorRegisterMessage && <Alert message={errorRegisterMessage} trigger={errorRegisterMessage} type='error'/> }
            <div className={`${styles.open} ${styles.container}`} ref={pageAside}>
                <div className={`${styles.fade}`} onClick={handleShow}></div>
                <div className='d-flex'>
                    <div className={`${styles.aside} shadow`}>
                        <div className={`p-4 pt-3 ${styles.contentAside}`}>
                            <div className={`${styles.navBarAside} px-0 d-flex justify-content-between align-items-center position-relative`}>
                                <Link to='/hospitais'>
                                    <svg width="1.16em" height="1.16em" version="1.0" viewBox="0 0 148 130">
                                        <g transform="translate(0 130) scale(.1 -.1)">
                                        <path d="m338 962c-220-219-288-293-288-312 0-18 67-91 282-307 156-156 291-286 301-289 21-7 57 21 57 43 0 8-106 123-235 256l-235 242 600 5c638 5 620 4 620 50s18 45-620 50l-600 5 235 242c129 133 235 248 235 256 0 17-32 47-51 47-7 0-143-129-301-288z"/>
                                        </g>
                                    </svg>
                                    Hospitais
                                </Link>
                                <div className='top-0 end-0'>
                                    <button className='border-0 bg-transparent p-0' onClick={handleShow}>
                                        <svg width="1.2em" height="1.2em" version="1.0" viewBox="0 0 108 108">
                                            <g transform="translate(0 108) scale(.1 -.1)">
                                                <path d="m52 1028c-34-34-16-58 200-275l212-212-212-214c-170-170-212-218-212-240 0-26 23-47 51-47 7 0 110 97 229 215l215 215 205-206c113-113 213-210 223-215 25-14 67 14 67 43 0 15-66 88-212 234l-211 213 211 216c122 125 212 224 212 235 0 23-26 50-48 50-10 0-71-54-137-121-66-66-164-161-218-211l-98-91-212 211c-210 209-236 229-265 200z"/>
                                            </g>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className='d-flex justify-content-between align-items-center position-relative'>
                                <div className={`${styles.title}`}>
                                    <span>{hospitalData?.cnes}</span>
                                    <h5 className='m-0'>{hospitalData?.acronym}</h5>
                                    <p>{hospitalData?.name}</p>
                                </div>
                            </div>
                            <div className={`w-100 mt-3 mb-3 ${styles.addButton}`}>
                                <button className='form-control' data-bs-toggle="modal" data-bs-target="#register-sector">
                                    <svg height="1em" viewBox="0 0 448 512" style={{'fill': '#fff'}}><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>
                                    <span>Setores</span>
                                </button>
                            </div>
                            <p className='pt-2 mb-0' style={{color: 'var(--secundary-color)', fontSize: '.86rem', fontWeight: '500'}}>SETORES</p>
                            <div className={`w-100 d-flex flex-column flex-shrink-0 pt-3 ${styles.navigate}`}>
                                <ul className='nav nav-pills flex-column mb-auto'>
                                    {
                                        sectors.map((sector)=>(
                                            <li className='nav-item mb-2 sub-item' key={sector.id}>
                                                <NavLink to={`configurar/${sector.id}`} className={`nav-link ${styles.navSector}`}>
                                                    <div className={`${styles.label_navSector}`}>
                                                        <svg version="1.0" viewBox="0 0 207 164" width='1.6em' height='1.6em'>
                                                            <path d="M145.8 3.2c-1.4 1.1-6.3 12.5-17 39.8-.9 2.3-1.3 1.8-6-7.5-2.8-5.5-5.7-10.8-6.6-11.8-1.4-1.5-3.9-1.7-24.9-1.7-14.2 0-24.2.4-25.4 1-1.2.7-1.9 2.1-1.9 4s.7 3.3 1.9 4c1.2.6 10.5 1 23.3 1h21.3l7.3 14.4c7.1 14.2 8.9 16.4 12.5 15 .9-.3 5-9.2 9.7-21 4.5-11.2 8.5-20.4 8.9-20.4.4 0 1.8 2.3 3.1 5.1s3.2 5.5 4.1 6c1 .5 11.2.9 22.8.9 22.3 0 24.1-.4 24.1-5s-1.9-5-22.6-5H161l-4.1-8.3C151 2 149.4.5 145.8 3.2z"/><path d="M5.8 23.1C4.1 24 4 28.4 4 92c0 66.1.1 68 1.9 69 2.7 1.4 3.7 1.3 5.5-.6 1.2-1.2 1.6-3.6 1.6-10V142h181v9c0 8 .2 9 2 10 2.8 1.5 5.9.4 6.6-2.4.3-1.2.4-19.7.2-41.2l-.3-38.9-3.3-6.7c-3.8-7.7-9.2-13-17.1-16.6-5.1-2.4-7-2.7-20.3-3l-14.8-.4-2 4.7c-1.1 2.6-2 4.9-2 5.1 0 .2 6.9.4 15.3.4 10.1.1 16.5.5 19 1.4 5.8 2.1 10.5 6.2 13.4 11.9 2.5 4.9 2.7 6.2 3.1 20.9l.4 15.8H93V88.6c0-20 .2-23.7 1.6-25 1.2-1.2 3.6-1.6 10-1.6 4.6 0 8.4-.2 8.4-.5 0-.2-1-2.5-2.2-5l-2.2-4.5h-6c-7.7 0-13.9 2.7-16.6 7.2-1.9 3.1-2 5-2 28V112H13V68.6c0-38.2-.2-43.6-1.6-45-1.8-1.8-3.2-2-5.6-.5zM194 127v5H13v-10h181v5z"/><path d="M40.6 53.6c-6.2 2-13.7 9.3-15.4 15-2.9 9.9-.8 18.8 5.9 25.6 17 17.1 45.1 2.4 41.5-21.7-2.1-13.7-18.2-23.3-32-18.9zm18 12.4c6.6 6.5 6.6 15.5 0 21.9-6.4 6.2-17.6 5.1-22.8-2.2-3.2-4.4-3.4-11.3-.6-16.1 3.2-5.4 7.9-7.8 14.6-7.3 4.3.3 5.9 1 8.8 3.7z"/>
                                                        </svg>
                                                        <span>{sector.name}</span>
                                                    </div>
                                                    <div className={`${styles.begde}`}>
                                                        00
                                                    </div>
                                                </NavLink>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className={`${styles.containerBody}`}>
                        <div className={`${styles.menu} shadow`}>
                            <button className={`${styles.menuButton}`} onClick={handleShow}>
                                <div className='nav_button'>
                                    <span></span>
                                    <span></span>
                                    <span></span> 
                                </div>
                            </button>
                        </div>
                        <div className={`${styles.contentBody} p-2`}>
                            <Routes>
                                <Route path="configurar/:sector/*" element={<ConfigHospital/>}/>
                            </Routes>
                        </div>
                    </div>
                </div>
            </div>
            <div className='modal fade pb-5' id='register-sector' data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className='modal-dialog modal-dialog-centered modal-lg'>
                    <div className='modal-content border-0'>
                        <div className='modal-header border-0 modal_header_bg p-4'>
                            <div className='d-flex'>
                                <svg viewBox="0 0 168 166" width="1.5em" height="1.5em">
                                    <path d="M72 4.1c-8.7 1.3-21.7 5.9-28.7 10-7.9 4.8-20.5 16.9-25.7 24.7-17.7 26.8-17.7 61.7 0 88.3 5.3 7.9 17.8 20 25.7 24.8 12.3 7.3 32.3 11.9 46.2 10.6 15.9-1.4 32.6-7.9 44-17.2C152.8 129.6 163 108.1 163 83s-10.2-46.6-29.5-62.3c-7.2-5.8-21.6-12.9-30.6-15.1C94.5 3.5 80.2 2.9 72 4.1zm27 15.5c13.8 3.2 27.6 12.2 36.5 23.8 21.4 27.8 17 67.2-10.2 89.8-12.7 10.6-27.2 15.3-44.3 14.5-17.9-.8-30.7-6.5-43.5-19.2-12.2-12.1-18.6-27.7-18.8-45.5 0-10.5 1.5-17.2 6.3-27.5C31.2 42 40.6 32.2 54.2 25c12.2-6.5 30.6-8.8 44.8-5.4zM79.7 50c-2.6 2-2.6 2.5-2.9 13.8l-.3 11.7-11.7.3c-11.3.3-11.8.4-13.8 2.9-2.5 3.3-2.5 5.3.1 8.7 2 2.5 2.3 2.6 14 2.6H77v11.9c0 11.8 0 12 2.7 14.1 3.2 2.5 6.9 2 9.6-1.2 1.4-1.7 1.7-4 1.7-13.4V90h11.8c13.5 0 15.2-.8 15.2-7.2 0-5.9-1.9-6.8-15.3-6.8H91V64.6c0-9.4-.3-11.7-1.7-13.4-2.7-3.2-6.4-3.7-9.6-1.2z"/>
                                </svg>
                                <h5 className='m-0 mx-1'>
                                    Cadastrar Setor
                                </h5>
                            </div>
                        </div>
                        <form className='register_form' onSubmit={handleSubmit}>
                            <div className='modal-body p-4 row'>
                                <label className='col-4'>
                                    <span>Nome</span>
                                    <input
                                        className={`form-control ${errorsRegister?.name && 'border border-danger'}`}
                                        value={name}
                                        placeholder='Setor'
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
                                <label className='col-8'>
                                    <span>Descrição</span>
                                    <input
                                        className={`form-control ${errorsRegister?.description && 'border border-danger'}`}
                                        value={description}
                                        placeholder='Descrição do Setor'
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
                                    />
                                    {
                                        errorsRegister?.description && (
                                            <ul className='error-message'>
                                                {
                                                    errorsRegister.description.map((error, i) => (
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
                                    <span>Tipo de acomodação</span>
                                    <select 
                                        className='form-select'
                                        value={tip_acc}
                                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setTip_acc(e.target.value)}
                                        >
                                        {
                                            typeAccommodation && typeAccommodation.map((type_acc)=>(
                                                <option key={type_acc.id} value={type_acc.description}>{type_acc.description}</option>
                                            ))
                                        }
                                    </select>
                                </label>
                                <label className='col-2 d-flex flex-column'>
                                    <span>Ativo:</span>
                                    <label className='switch mb-0'>
                                        <input  type='checkbox'
                                                checked={is_active}
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => setIs_active(e.target.checked)}
                                                />
                                        <span className="slider round"></span>
                                    </label>                                    
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
                                    ): (
                                        <input type='submit' value='Cadastrar'/>
                                    )
                                }
                                <input 
                                    className='cancel'
                                    type='cancel'
                                    defaultValue='Cancelar'
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                    ref={buttonClose}
                                    />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Hospital;