import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
//Styles
import styles from './EditSector.module.css'
//Redux
import { update, reset, hideAlert, active } from '../../../../slices/sectorSlice';
import { refreshToken } from '../../../../slices/authSlice'; 
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store';
//Hooks
import { useParams } from 'react-router-dom';
//Interface
import { ISector, ISectorErrors } from '../../../../interfaces/Sector';
import { ITypeAccommodation } from '../../../../interfaces/TypeAccommodation';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
//Componenets
import Alert from '../../../../components/Alert/Alert';

type Props = {}

const EditSector = (props: Props) => {

    //Dispath
    const dispath = useDispatch<ThunkDispatch<RootState, any, AnyAction>>();
    //Params
    const { sector } = useParams();

    useEffect(()=>{
        dispath(hideAlert());
    }, []);

    useEffect(()=>{
        dispath(reset());
    }, [dispath])

    /**
     * Get data of current sector
     */
    const { sectors,
            successUpdate,
            successUpdateMessage,
            errorUpdateMessage,
            errorUpdate,
            loading,
            errorsUpdate
        }: { 
            sectors: ISector[], 
            successUpdate: boolean,
            successUpdateMessage: string | null,
            errorUpdateMessage: string | null,
            errorUpdate: boolean,
            loading: boolean,
            errorsUpdate: ISectorErrors | null
        } = useSelector((state: RootState) => state.sector);
    const [ sectorSelect, setSectorSelect ] = useState<ISector>();

    useEffect(()=>{
        if(sector){
            setSectorSelect(sectors.filter((s) => s.id === parseInt(sector)).pop());
        }
    
    }, [sectors, sector]);

    /**
     * Update data
     */
    const { typeAccommodation }: { typeAccommodation: ITypeAccommodation[] } = useSelector((state: RootState) => state.typeAccomodation);

    const [ name, setName ] = useState<string>('');
    const [ description, setDescription ] = useState<string>('');
    const [ tip_acc, setTip_acc ] = useState<string>('');

    useEffect(()=>{
        if(sectorSelect) {
            setName(sectorSelect.name!);
            setDescription(sectorSelect.description!); 
            setTip_acc(sectorSelect.tip_acc!);
        }
        
    }, [sectorSelect]);

    const [showSucessAlert, setShowSucessAlert] = useState<boolean>(false);
    const [showErrorAlert, setShowErrorAlert] = useState<boolean>(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const data: ISector = {
            id: sector!,
            name,
            description,
            tip_acc
        };

        await dispath(refreshToken());
        await dispath(update(data));
        
    };

    //Caso ocorrer sucesso na requisição a mensagem de alert será disparada e depois
    //de alguns segundos a mesma será removida.
    useEffect(()=>{
        if(successUpdate && successUpdateMessage){
            setShowSucessAlert(true);

            const timeout = setTimeout(() => {
                setShowSucessAlert(false);
                dispath(hideAlert());
            }, 2600);
            
            return () =>{
                clearTimeout(timeout);
            }

        } else {
            setShowSucessAlert(false);
        }

    }, [successUpdate, successUpdateMessage]);

    useEffect(()=>{
        if(errorUpdate && errorUpdateMessage){
            setShowErrorAlert(true);

            const timeout = setTimeout(() => {
                setShowErrorAlert(false);
                dispath(hideAlert());
            }, 2600);

            return () => {
                clearTimeout(timeout);
            }

        } else {
            setShowErrorAlert(false);
        }
        
    }, [errorUpdate, errorUpdateMessage]);

    const handleActiveDeactive = async (e: FormEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if(sectorSelect){
            const data: ISector = {
                id: sectorSelect.id,
                is_active: sectorSelect.is_active ? false: true
            };

            await dispath(refreshToken());
            await dispath(active({sector: data.id!, active: data.is_active!}));
        }

    };

    return (
        <>
            {showSucessAlert && <Alert type='success' message={successUpdateMessage}></Alert>}
            {showErrorAlert && <Alert type='error' message={errorUpdateMessage}></Alert>}
            <div className={`${styles.container}`}>
                <div className='w-100'>
                    <p className='fs-6 mb-1'>Ações:</p>
                    <div className={`${styles.toolarea}`}>
                        {
                            sectorSelect?.is_active ? (
                                <button onClick={handleActiveDeactive}>
                                    <svg viewBox="0 0 448 512" width={'1.1em'} height={'1.1em'}>
                                        <path d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z"/>
                                    </svg>
                                    <span>Desativar</span>
                                </button>
                            ) : (
                                <button onClick={handleActiveDeactive}>
                                    <svg viewBox="0 0 576 512" width={'1.1em'} height={'1.1em'}>
                                        <path d="M352 144c0-44.2 35.8-80 80-80s80 35.8 80 80v48c0 17.7 14.3 32 32 32s32-14.3 32-32V144C576 64.5 511.5 0 432 0S288 64.5 288 144v48H64c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V256c0-35.3-28.7-64-64-64H352V144z"/>
                                    </svg>
                                    <span>Ativar</span>
                                </button>
                            )
                        }
                        <button data-bs-toggle="modal" data-bs-target="#exclude-sector-modal">
                            <svg xmlns="http://www.w3.org/2000/svg" width={'1.1em'} height={'1.1em'} viewBox="0 0 448 512">
                                <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/>
                            </svg>
                            <span>Deletar</span>
                        </button>
                    </div>
                </div>
                <div className={`${styles.content}`}>
                    <div className='card w-50 border-0 m-0 mt-4'>
                        <h5>Editar dados do Setor</h5>
                        <form className='register_form' onSubmit={handleSubmit}>
                            <div className='card-body row ps-0 pb-0'>
                                <label>
                                    <span>Nome</span>
                                    <input
                                        className={`form-control ${errorsUpdate?.name && 'border border-danger'}`}
                                        placeholder='Setor'
                                        value={name}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                                    />
                                    {
                                        errorsUpdate?.name && (
                                            <ul className='error-message'>
                                                {
                                                    errorsUpdate.name.map((error, i) => (
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
                                <label>
                                    <span>Descrição</span>
                                    <input
                                        className={`form-control ${errorsUpdate?.description && 'border border-danger'}`}
                                        placeholder='Descrição do Setor'
                                        value={description}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
                                    />
                                    {
                                        errorsUpdate?.description && (
                                            <ul className='error-message'>
                                                {
                                                    errorsUpdate.description.map((error, i) => (
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
                                <label>
                                    <span>Tipo de acomodação</span>
                                    <select className='form-select'
                                            onChange={(e: ChangeEvent<HTMLSelectElement>) => setTip_acc(e.target.value)}
                                            value={tip_acc}
                                    >
                                        {
                                            typeAccommodation.map((tip_acc)=>(
                                                <option key={tip_acc.id} value={tip_acc.description}>{tip_acc.description}</option>
                                            ))
                                        }
                                    </select>
                                </label>
                            </div>
                            <div className='card-footer bg-transparent border-0 ps-0 pe-0'>
                                {
                                    loading ? (
                                        <button className='w-25 form-control' disabled>
                                            <div className='spinner-border' role="status">
                                                <span className='sr-only'></span>
                                            </div>
                                        </button>
                                    ) : (
                                        <input className='w-25' type='submit' value='Salvar'/>
                                    )
                                }
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>

    )
}

export default EditSector;