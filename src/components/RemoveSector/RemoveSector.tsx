import React, {useState, useRef, useEffect} from 'react'
//Router
import { useNavigate } from 'react-router-dom';
//Redux
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { refreshToken } from '../../slices/authSlice';
import { remove, hideAlert } from '../../slices/sectorSlice';
//Context
import { useSectorContext } from '../../components/Context/SectorContext';
//Interface
import { ISector } from '../../interfaces/Sector';
//Components
import Alert from '../../components/Alert/Alert';

const RemoveSector = () => {
    //Navigate
    const navigate = useNavigate();
    //Setor selecionado
    const sectorSelected = useSectorContext();
    //Redux dispatch
    const dispatch = useDispatch<ThunkDispatch<RootState, any, AnyAction>>();
    //Show alert
    const [showErrrorRemoveAlert, setShowErrrorRemoveAlert] = useState<boolean>(false);
    //Cancel button
    const cancelButton = useRef<HTMLInputElement>(null);
    //State data
    const {
        sectors,
        successRemove,
        errorRemove,
        errorRemoveMessage,
    }: {
        sectors: ISector[],
        successRemove: boolean,
        errorRemove: boolean,
        errorRemoveMessage: string | null
    } = useSelector((state: RootState) => state.sector);

    const handleExcludeSector = async (e: React.MouseEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(sectorSelected?.sectorSelected){
            await dispatch(refreshToken());
            await dispatch(remove(sectorSelected?.sectorSelected));
            cancelButton.current?.click();
        }
    };

    useEffect(()=>{
        if(successRemove){
            if(sectors.length > 0){
                navigate(`configurar/${sectors[0].id}/leitos`);
            }
            
        }
    }, [successRemove]);

    useEffect(()=>{
        if(errorRemove && errorRemoveMessage){
            setShowErrrorRemoveAlert(true);
            
            const timeout = setTimeout(()=>{
                setShowErrrorRemoveAlert(false);
                dispatch(hideAlert());
            }, 2700);

            return () => {
                clearTimeout(timeout);
            }
        } else {
            setShowErrrorRemoveAlert(false);
        }

    }, [errorRemove, errorRemoveMessage]);

    return (
        <>
            {showErrrorRemoveAlert && <Alert message={errorRemoveMessage} type='error'/>}
            <div className='modal fade pb-5' id='exclude-sector-modal' data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className='modal-dialog modal-dialog-centered'>
                    <div className='modal-content border-0'>
                        <form onSubmit={handleExcludeSector}>
                            <div className='modal-body pb-0 text-center'>
                                <h5>Deseja remover este setor?</h5>
                                <p>Cuidado. Ao deletar o setor todos os leitos relacionados ao mesmo também serão deletados.</p>
                            </div>
                            <div className='modal-footer border-0 modal_footer_bg px-4'>
                                <input  className='cancel col-4'
                                        type='cancel'
                                        ref={cancelButton}
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                        defaultValue='Cancelar'/>
                                <input className='bg-danger col-4' type='submit' defaultValue='Deletar'/>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default RemoveSector