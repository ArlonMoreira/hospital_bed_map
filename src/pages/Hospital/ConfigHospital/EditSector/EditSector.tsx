import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
//Styles
import styles from './EditSector.module.css'
//Redux
import { update, reset } from '../../../../slices/sectorSlice';
import { refreshToken } from '../../../../slices/authSlice'; 
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store';
//Hooks
import { useParams } from 'react-router-dom';
//Interface
import { ISector } from '../../../../interfaces/Sector';
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
            loading
        }: { 
            sectors: ISector[], 
            successUpdate: boolean,
            successUpdateMessage: string | null,
            errorUpdateMessage: string | null,
            errorUpdate: boolean,
            loading: boolean
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
            setName(sectorSelect?.name);
            setDescription(sectorSelect?.description); 
            setTip_acc(sectorSelect.tip_acc);           
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
        if(successUpdate){
            setShowSucessAlert(true);

            const timeout = setTimeout(() => {
                setShowSucessAlert(false);
                dispath(reset());
            }, 2600);
            
            return () =>{
                clearTimeout(timeout);
            }

        } else {
            setShowSucessAlert(false);
        }

    }, [successUpdate]);

    useEffect(()=>{
        if(errorUpdate){
            setShowErrorAlert(true);

            const timeout = setTimeout(() => {
                setShowErrorAlert(false);
                dispath(reset());
            }, 2600);

            return () => {
                clearTimeout(timeout);
            }

        } else {
            setShowErrorAlert(false);
        }
        
    }, [errorUpdate]);

    return (
        <>
            {showSucessAlert && <Alert type='success' message={successUpdateMessage}></Alert>}
            {showErrorAlert && <Alert type='error' message={errorUpdateMessage}></Alert>}
            <div className={`${styles.container}`}>
                <div className={`${styles.toolarea}`}>
                    <button>Desativar</button>
                    <button>Deletar</button>
                </div>
                <div className={`${styles.content}`}>
                    <div className='card w-50 border-0 m-0 mt-4'>
                        <h5>Editar dados do Setor</h5>
                        <form className='register_form' onSubmit={handleSubmit}>
                            <div className='card-body row ps-0 pb-0'>
                                <label>
                                    <span>Nome</span>
                                    <input
                                        className='form-control'
                                        placeholder='Setor'
                                        value={name}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                                    />
                                </label>
                                <label>
                                    <span>Descrição</span>
                                    <input
                                        className='form-control'
                                        placeholder='Descrição do Setor'
                                        value={description}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
                                    />
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