import React, { useEffect, ChangeEvent, useState } from 'react'
//Styles
import styles from './Beds.module.css';
//Redux
import { getSectors } from '../../slices/bedSlice';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch, AnyAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
//Route
import { useParams, useNavigate } from 'react-router-dom';
//Context
import { useCnesContext } from '../../Context/CnesDefaultContext';
//Interface
import { IHospital } from '../../interfaces/Hospital';
import { IBed, ISector } from '../../interfaces/Bed';
//Components
import ProgressBar from '../../components/ProgressBar/ProgressBar';

type Props = {
    hospitalList: Array<IHospital>,
};

type resumeStatus = {
    status: string,
    beds: number
};

const memoryGroupByCount = ({ object, index }: { object: Array<any>; index: Array<any> }) => {
    const helper: { [key: string]: any } = {};

    object.forEach((o) => {
      const key = index.map((i) => o[i]).join('_');

      if (!helper[key]) {
        helper[key] = { ...o, count: 1 };
      } else {
        helper[key].count += 1;
      }
    });

    return Object.values(helper);
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

    /**
     * Obter setores
     */
    const {
        sectors,
        sectorsLoading,
    } : {
        sectors: ISector[],
        sectorsLoading: boolean
    } = useSelector((state: RootState) => state.bed);

    useEffect(()=>{
        if(cnes && hospitalList.length > 0 && hospitalList){
            const hospital = hospitalList.filter((option) => option.cnes == cnes.cnesDefault)[0];
            if(hospital){
                dispatch(getSectors(hospital?.cnes));
            }

        }

    }, [cnes, hospitalList]);

    /**
     * Expandir
     */
    const [expandSectors, setExpandSectors] = useState<Array<boolean>>([]);
    const [resumeStatus, setResumeStatus] =  useState<Array<Array<resumeStatus>>>([]);

    useEffect(()=>{
        if(sectors.length > 0){
            setExpandSectors(Array(sectors.length).fill(false));

            //Contabilizar por setor quantos leitos existem por status.
            const forStatusBeds = sectors.map((sector)=>{
                const groupedData = memoryGroupByCount({
                    object: sector.beds,
                    index: ['type_occupation_status']
                });
                  
                return [...groupedData.map((data)=>{
                    return {
                        'status': data.type_occupation_status as string,
                        'beds': data.count as number
                    };
                })] as resumeStatus[];

            });
            
            setResumeStatus(forStatusBeds);

        } else {
            setResumeStatus([]);
        }

    }, [sectors])

    const expand = (sector: ISector) => {
        // Encontre o índice do setor selecionado
        const indexUpdate = sectors.findIndex((current) => current.id === sector.id);
        // Crie um novo array com todos os elementos definidos como false
        const newExpandSectors = Array(sectors.length).fill(false);        

        if(!expandSectors[indexUpdate]) {
            // Defina apenas o setor selecionado como true
            newExpandSectors[indexUpdate] = true;          
        }

        // Atualize o estado
        setExpandSectors(newExpandSectors);        

    };

    const calcOcupation = (status: Array<resumeStatus>):number => {
        const total = status.reduce((c, v) => c + v.beds, 0);
        const free = status.filter((s) => s.status == 'VAGO')[0].beds;
        return (total - free)/total * 100;
    };
    
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
                <h5>Setores</h5>
            </div>
            <div className={`${styles.container_sector}`}>
                {
                    sectors.map((sector, i)=>(
                        <div className={`${styles.item} ${expandSectors[i] && styles.expand}`} key={sector.id}>
                            <div className={`${styles.header}`}>
                                <div className={`${styles.title}`}>
                                    <span>{sector.name}</span>
                                </div>
                                <div className={`${styles.tools}`}>
                                    <a onClick={() => expand(sector)}>
                                        <svg height="1em" viewBox="0 0 448 512"><path d="M32 32C14.3 32 0 46.3 0 64v96c0 17.7 14.3 32 32 32s32-14.3 32-32V96h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H32zM64 352c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7 14.3 32 32 32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H64V352zM320 32c-17.7 0-32 14.3-32 32s14.3 32 32 32h64v64c0 17.7 14.3 32 32 32s32-14.3 32-32V64c0-17.7-14.3-32-32-32H320zM448 352c0-17.7-14.3-32-32-32s-32 14.3-32 32v64H320c-17.7 0-32 14.3-32 32s14.3 32 32 32h96c17.7 0 32-14.3 32-32V352z"/></svg>
                                    </a>
                                </div>
                            </div>
                            <div className={`${styles.dashboard} ${expandSectors[i] && 'd-none'}`}>
                                <div className={`${styles.container}`}>
                                    {
                                        resumeStatus[i] && (
                                            <div className={`${styles.bignumber} text-center`} key={i}>
                                                <span className={`${styles.label}`}>Ocupação</span>
                                                <ProgressBar value={calcOcupation(resumeStatus[i])}></ProgressBar>                                       
                                            </div>
                                        )
                                    }
                                    {
                                        resumeStatus[i] &&
                                        resumeStatus[i].map((status, i) => (
                                            <div className={`${styles.bignumber} d-flex align-items-center`} key={i}>
                                                <div className={`${styles.iconArea}`}>
                                                    <svg className={`${status.status}-fill`} height="1em" viewBox="0 0 640 512"><path d="M32 32c17.7 0 32 14.3 32 32V320H288V160c0-17.7 14.3-32 32-32H544c53 0 96 43 96 96V448c0 17.7-14.3 32-32 32s-32-14.3-32-32V416H352 320 64v32c0 17.7-14.3 32-32 32s-32-14.3-32-32V64C0 46.3 14.3 32 32 32zm144 96a80 80 0 1 1 0 160 80 80 0 1 1 0-160z"/></svg>                                                    
                                                </div>
                                                <div className={`${styles.textArea}`}>
                                                    <span className={`${styles.label}`}>{status.status}</span>
                                                    <span className={`${styles.number}`}>{status.beds}</span>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    ))
                }                                                              
            </div>
        </div>
    )
}

export default Beds