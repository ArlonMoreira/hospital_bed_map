import { useEffect, ChangeEvent, useState, useRef } from 'react'
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
        const free = status.filter((s) => s.status == 'VAGO')[0];

        if(!free){
            return 100;
        }

        return (total - free.beds)/total * 100;
    };

    /**
     * Carrocel scroll horizontal
     */

    const sectorContainer = useRef<HTMLDivElement>(null);
    const [elements, setElements] = useState<Array<Element>>();

    //Os elementos HTML precisam ser alimentados em um array, pois para cada elemento diferente uma ação deve ser empregada.
    useEffect(()=>{
        if (sectorContainer.current && sectorContainer.current.children.length !== 0) {
            const childrenArray = Array.from(sectorContainer.current.children);
            setElements(childrenArray);
            
        }

    }, [sectorContainer, sectors]);
    
    //Ao clicar no botão de navegação do carrossel irá mover o scroll na direção horizontal
    const eventScroll = ({ element, type, value }: { element: Element; type: 'next' | 'previous'; value: number }) => {
        const dom = element as HTMLDivElement;
        const scrollArea = dom.querySelector('.scroll-area');

        if (scrollArea) {
            scrollArea.scrollLeft = type === 'next' ? scrollArea.scrollLeft + value : scrollArea.scrollLeft - value;
        }

    };

    //Irá habilitar e desabilitar o botão do scroll ao chegar ao fim da área de rolagem
    useEffect(()=>{
        if(elements){
            elements.forEach((element)=>{

                const dom = element as HTMLDivElement
                const scrollArea = dom.querySelector('.scroll-area');

                const previousButton = dom.querySelector('.previous-button-scroll') as HTMLButtonElement;
                const nextButton = dom.querySelector('.next-button-scroll') as HTMLButtonElement;

                if(scrollArea){
                    //Quando expandir e retornará o scroll para 0, caso contrário.
                    //O botão ficará divergente em relação ao scroll. Por esse motivo esse hook está escutando expandSectors                 
                    scrollArea.scrollLeft = 0;

                    const maxScroll = scrollArea.scrollWidth - scrollArea.clientWidth;
                    
                    //Caso a área de scroll for pequena ao ponto de não permitir a rolagem, os botões serão desabilitados.
                    if(maxScroll === 0) {
                        nextButton.classList.add(styles.disabled);
                    }
                    
                    //Quando acionado o evento de scroll habilita ou desabilita os botões caso não tiver mais pra onde rolar.
                    scrollArea.addEventListener('scroll', () => {
                        if(scrollArea.scrollLeft == 0){
                            previousButton.classList.add(styles.disabled);
                        } else {
                            previousButton.classList.remove(styles.disabled);
                        }

                        if(maxScroll <= scrollArea.scrollLeft + 1){
                            nextButton.classList.add(styles.disabled);
                        } else {
                            nextButton.classList.remove(styles.disabled);
                        }



                    });
                }

            });
        }

    }, [elements, expandSectors]);

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
                <h5 className='m-0'>Setores</h5>
            </div>
            <div className={`${styles.container_sector}`} ref={sectorContainer}>
                {
                    sectors.map((sector, i)=>(
                        <div    className={`${styles.item} ${expandSectors[i] ? styles.expand: ''}`} key={sector.id} id={`box-${sector.id}`}>
                            <div className={`${styles.header}`}>
                                <div className={`${styles.title}`}>
                                    <span>{sector.name}</span>
                                </div>
                                <div className={`${styles.tools}`}>
                                    {
                                        elements && 
                                        <>
                                            <button 
                                                className={`${expandSectors[i] && 'd-none'} previous-button-scroll ${elements[i] && elements[i].scrollLeft == 0 && styles.disabled}`}
                                                onClick={() => eventScroll({element: elements[i], type: 'previous', value: 500})}
                                                >
                                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 320 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"/></svg>
                                            </button>
                                            <button className={`${expandSectors[i] && 'd-none'} next-button-scroll`}
                                                onClick={() => eventScroll({element: elements[i], type: 'next', value: 500})}>
                                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 320 512"><path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/></svg>                                    
                                            </button>                                        
                                        </>                                      
                                    }
                                    <a onClick={() => expand(sector)} className="ms-3 ms-md-0">
                                        <svg height="1em" viewBox="0 0 448 512"><path d="M32 32C14.3 32 0 46.3 0 64v96c0 17.7 14.3 32 32 32s32-14.3 32-32V96h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H32zM64 352c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7 14.3 32 32 32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H64V352zM320 32c-17.7 0-32 14.3-32 32s14.3 32 32 32h64v64c0 17.7 14.3 32 32 32s32-14.3 32-32V64c0-17.7-14.3-32-32-32H320zM448 352c0-17.7-14.3-32-32-32s-32 14.3-32 32v64H320c-17.7 0-32 14.3-32 32s14.3 32 32 32h96c17.7 0 32-14.3 32-32V352z"/></svg>
                                    </a>
                                </div>
                            </div>
                            <div className={`${styles.dashboard} ${expandSectors[i] && 'd-none'}`}>
                                <div className={`${styles.container} scroll-area`}>
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
                                            <div className={styles.bignumber} key={i}>
                                                <div className={styles.iconArea}>
                                                    <svg className={`${status.status}-fill`} height="1em" viewBox="0 0 640 512"><path d="M32 32c17.7 0 32 14.3 32 32V320H288V160c0-17.7 14.3-32 32-32H544c53 0 96 43 96 96V448c0 17.7-14.3 32-32 32s-32-14.3-32-32V416H352 320 64v32c0 17.7-14.3 32-32 32s-32-14.3-32-32V64C0 46.3 14.3 32 32 32zm144 96a80 80 0 1 1 0 160 80 80 0 1 1 0-160z"/></svg>                                                    
                                                </div>
                                                <div className={styles.textArea}>
                                                    <span className={styles.label}>{status.status}</span>
                                                    <span className={styles.number}>{status.beds}</span>
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