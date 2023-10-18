import React, { useEffect, ChangeEvent, useState } from 'react'
//Styles
import styles from './Beds.module.css';
//Redux
import { sectors } from '../../slices/bedSlice';
import { useDispatch } from 'react-redux';
import { ThunkDispatch, AnyAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
//Hooks
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
//Context
import { useCnesContext } from '../../Context/CnesDefaultContext';
//Interface
import { IHospital } from '../../interfaces/Hospital';

type Props = {
    hospitalList: Array<IHospital>,
};

const Beds = ({hospitalList}: Props) => {

    const dispatch = useDispatch<ThunkDispatch<RootState, any, AnyAction>>();
    /**
     * Navigate
     */
    const navigate = useNavigate();
    const { id } = useParams();
    
    /**
     * Cnes default
     */
    const [ hospitalSelectOptions, setHospitalSelectOptions ] = useState<Array<IHospital>>([]);
    const cnes = useCnesContext();
    
    useEffect(()=>{
        //Irá definir o cnes padrão assim que acessar a página
        //Dessa forma a class active será inclusa pois no navlink estará a mesma url
        //que foi acessada pelo navegador.
        if(id){
            cnes?.setCnesDefault(id);
        }

    }, [id]);

    useEffect(()=>{
        if(hospitalList.length > 0 && hospitalList){
            setHospitalSelectOptions(hospitalList);
        }

    }, [hospitalList, dispatch]);

    const changePage = (e: ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        navigate(`/leitos/${e.target.value}`);
    };

    useEffect(()=>{
        if(cnes && hospitalList.length > 0 && hospitalList){
            const hospital = hospitalList.filter((option) => option.cnes == cnes.cnesDefault)[0];
            if(hospital){
                dispatch(sectors(hospital?.id));
            }

        }

    }, [cnes, hospitalList]);
    
    return (
        <div>
            <label className={styles.container_select}>
                <span>Hospital</span>
                <select className='form-select' onChange={changePage} value={cnes?.cnesDefault ? cnes?.cnesDefault:0}>
                    {
                        hospitalSelectOptions.length > 0 && (
                            hospitalSelectOptions.map((hospital, i) => (
                                <option value={hospital.cnes} key={i}>{hospital.name}</option>
                            ))
                        )
                    }
                </select>
            </label>
            <div className='p-4 px-0'>
                <h5>Editar Cadastro</h5>
            </div>
            <div className={`${styles.container_sector}`}>
                <div className={`${styles.item}`}>
                </div>
                <div className={`${styles.item}`}>
                </div>
                <div className={`${styles.item}`}>
                </div>
                <div className={`${styles.item}`}>
                </div>
                <div className={`${styles.item}`}>
                </div>                                                                
            </div>
        </div>
    )
}

export default Beds