import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
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
import { ITypeAccommodation } from '../../../../interfaces/TypeAccommodation';

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

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const data = {
            name,
            description,
            tip_acc
        };

        console.log(data);

    };

    return (
        <div>
            <div className={`${styles.toolarea}`}>
                <button>Desativar</button>
                <button>Deletar</button>
            </div>
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
                        <input className='w-25' type='submit' value='Salvar'/>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditSector;