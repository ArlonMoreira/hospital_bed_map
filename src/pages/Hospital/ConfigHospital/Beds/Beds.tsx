import React, { SelectHTMLAttributes, useEffect, useState, FormEvent } from 'react'
//Styles
import styles from './Beds.module.css';
//Redux
import { refreshToken } from '../../../../slices/authSlice';
import { list, occupation, active, reset } from '../../../../slices/bedSlice';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch, AnyAction } from '@reduxjs/toolkit';
import { RootState } from '../../../../store';
//Interface
import { IBed, IStatus, IType, IBedParams } from '../../../../interfaces/Bed';
//Context
import { useBedContext } from '../../../../components/Context/BedContext';

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

  /**
   * Listar todos os leitos
   */
  useEffect(()=>{
    if(sector){
      dispatch(refreshToken());
      dispatch(list({sector}));
    }
    
  }, [sector]);

  /**
   * Alterar status
  */

  const handleChangeStatus = async ({bed, e}:{bed:IBed, e:React.ChangeEvent<HTMLSelectElement>}) => {
    e.preventDefault();

    const indexUpdate = beds.findIndex((current) => current.id === bed.id);

    //Loading start
    if (loadingActive) {
      const updatedLoadingActive = [...loadingActive]; // Crie uma cópia do estado
      updatedLoadingActive[indexUpdate] = true; // Faça a modificação na cópia
      setLoadingActive(updatedLoadingActive); // Atualize o estado com a nova cópia
    }

    const data = {
      bed: bed.id.toString(),
      data: {
        type_occupation: parseInt(e.target.value)
      }
    };

    await dispatch(refreshToken());
    await dispatch(occupation(data));

    //Loading end
    if (loadingActive) {
      const updatedLoadingActive = [...loadingActive]; // Crie uma cópia do estado
      updatedLoadingActive[indexUpdate] = false; // Faça a modificação na cópia
      setLoadingActive(updatedLoadingActive); // Atualize o estado com a nova cópia
    } 

  };

  /**
   * Ativar desativar
   */

  const [loadingActive, setLoadingActive] = useState<Array<boolean> | null>();

  const handleActiveDeactive = async ({bed, e}:{bed: IBed, e: FormEvent<HTMLButtonElement>}) => {
    e.preventDefault();

    const indexUpdate = beds.findIndex((current) => current.id === bed.id);

    //Loading start
    if (loadingActive) {
      const updatedLoadingActive = [...loadingActive]; // Crie uma cópia do estado
      updatedLoadingActive[indexUpdate] = true; // Faça a modificação na cópia
      setLoadingActive(updatedLoadingActive); // Atualize o estado com a nova cópia
    }

    const data = {
      bed: bed.id.toString(),
      data: {
        is_active: bed.is_active ? false : true,
      },
    };
  
    await dispatch(refreshToken());
    await dispatch(active(data));
  
    //Loading end
    if (loadingActive) {
      const updatedLoadingActive = [...loadingActive]; // Crie uma cópia do estado
      updatedLoadingActive[indexUpdate] = false; // Faça a modificação na cópia
      setLoadingActive(updatedLoadingActive); // Atualize o estado com a nova cópia
    }

  };

  //beds é chamado também no active, porque o selector beds recebe um update dentro do slice.
  useEffect(()=>{
    if(beds && !loadingActive){
      const state:Array<boolean> = [...beds.map(() => false)];
      setLoadingActive(state);
    }
 
  }, [beds, loadingActive]);

  /**
   * Remover leito
   * Como o componente de abertura do modal é instanciado no componente pai, o leito marcado para ser deletado foi passado
   * por um contexto.
   */

  const bedSelected = useBedContext();

  const handleSetBed = async ({bed, e}:{bed: IBed, e: FormEvent<HTMLButtonElement>}) => {
    e.preventDefault();
    bedSelected?.setBedSelected(bed.id.toString());
  };
  
  /**
   * Limpar modal
   */

  const clearModal = () => {
    dispatch(reset());
  };  

  return (
    <div className='p-0 p-lg-4'>
      <div className={`${styles.container}`}>
        <div className={`${styles.item} ${styles.add}`}>
          <a data-bs-toggle="modal" data-bs-target="#add-bed-modal" className={`w-100 h-100 d-flex justify-content-center align-items-center`} onClick={clearModal}>
            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
              <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/>
            </svg>
          </a>
        </div>
        {
          beds.map((bed, i)=>(
            (loadingActive && loadingActive.length > 0) && 
            loadingActive[i] ? (
              <div className={`${styles.loading_bed}`} key={i}>
                <div className="spinner-border" role="status" style={{'color': 'var(--bs-body-bg)'}}>
                    <span className="sr-only"></span>
                </div>
              </div>
            ): (
                <div className={`${styles.content} ${styles.item} ${styles[bed.type_occupation_status]} ${!bed.is_active && styles.disabled}`} key={bed.id} style={{'animationDelay': `${i/20}s`}}>
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 640 512">
                      <path d="M32 32c17.7 0 32 14.3 32 32V320H288V160c0-17.7 14.3-32 32-32H544c53 0 96 43 96 96V448c0 17.7-14.3 32-32 32s-32-14.3-32-32V416H352 320 64v32c0 17.7-14.3 32-32 32s-32-14.3-32-32V64C0 46.3 14.3 32 32 32zm144 96a80 80 0 1 1 0 160 80 80 0 1 1 0-160z"/>
                    </svg>    
                    <h5>{bed.name}</h5>
                  </div>
                  <label className='w-100'>
                    <select
                      className={`${styles.select} form-select`}
                      value={bed.type_occupation_id.toString()}
                      onChange={(e) => handleChangeStatus({bed, e})}
                      disabled={bed.is_active? false: true}
                    >
                      {
                        statusData && statusData.map((status,i)=>(
                            <option key={i} value={status.id?.toString()} className='text-dark'>{status.description}</option>
                        ))
                      }                  
                    </select>
                  </label>
                  <div className='d-flex'>
                    <button onClick={(e) => handleActiveDeactive({bed, e})}>
                      {                                   
                        bed.is_active ? (
                          <svg viewBox="0 0 576 512" width={'1em'} height={'1em'}>
                            <path d="M352 144c0-44.2 35.8-80 80-80s80 35.8 80 80v48c0 17.7 14.3 32 32 32s32-14.3 32-32V144C576 64.5 511.5 0 432 0S288 64.5 288 144v48H64c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V256c0-35.3-28.7-64-64-64H352V144z"/>
                          </svg>
                        ) : (
                          <svg viewBox="0 0 448 512" width={'.86em'} height={'.86em'}>
                              <path d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z"/>
                          </svg>
                        )                                 
                      }
                    </button>
                    <button data-bs-toggle="modal" data-bs-target="#exclude-bed-modal" onClick={(e) => handleSetBed({bed, e})}>
                      <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512">
                        <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
                      </svg>
                    </button>
                  </div>
                </div>
            )
          ))
        }
      </div>
    </div>
  )
}

export default Beds;