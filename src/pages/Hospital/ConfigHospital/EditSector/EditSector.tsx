import React, { useEffect, useState } from 'react'
//Styles
import styles from './EditSector.module.css'
//Redux
import { list } from '../../../../slices/sectorSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store';
//Hooks
import { useParams } from 'react-router-dom';
//Interface
import { ISector } from '../../../../interfaces/Sector';

type Props = {}

const EditSector = (props: Props) => {

    //Dispath
    const dispath = useDispatch();
    //Params
    const { sector } = useParams();

    /**
     * Get data of current sector
     */
    const { sectors }: { sectors: ISector[] } = useSelector((state: RootState) => state.sector);
    const [ sectorSelect, setSectorSelect ] = useState<ISector>();

    useEffect(()=>{
        if(sector){
            setSectorSelect(sectors.filter((s) => s.id === parseInt(sector)).pop());
        }
    
    }, [sectors, sector]);

    return (
        <div>
            <div className={`${styles.toolarea}`}>
                <button>Desativar</button>
                <button>Deletar</button>
            </div>
        </div>
    )
}

export default EditSector;