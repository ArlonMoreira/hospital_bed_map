import React, { ChangeEvent, useState } from 'react'
//styles
import styles from './Hospitals.module.css';

type Props = {}

const Hospitals = (props: Props) => {

    const [name, setName] = useState<string>('');
    const [acronym, setAcronym] = useState<string>('');
    const [is_active, setIs_active] = useState<boolean>(true);

    return (
        <div>
            <div className={`${styles.hospitals_container}`}>
                <div data-bs-toggle="modal" data-bs-target="#register-hospital" className={`card ${styles.item} ${styles.insert_container}`}>
                    <a className={`${styles.insert_body}`}>
                        <svg viewBox="0 0 168 166">
                            <path d="M72 4.1c-8.7 1.3-21.7 5.9-28.7 10-7.9 4.8-20.5 16.9-25.7 24.7-17.7 26.8-17.7 61.7 0 88.3 5.3 7.9 17.8 20 25.7 24.8 12.3 7.3 32.3 11.9 46.2 10.6 15.9-1.4 32.6-7.9 44-17.2C152.8 129.6 163 108.1 163 83s-10.2-46.6-29.5-62.3c-7.2-5.8-21.6-12.9-30.6-15.1C94.5 3.5 80.2 2.9 72 4.1zm27 15.5c13.8 3.2 27.6 12.2 36.5 23.8 21.4 27.8 17 67.2-10.2 89.8-12.7 10.6-27.2 15.3-44.3 14.5-17.9-.8-30.7-6.5-43.5-19.2-12.2-12.1-18.6-27.7-18.8-45.5 0-10.5 1.5-17.2 6.3-27.5C31.2 42 40.6 32.2 54.2 25c12.2-6.5 30.6-8.8 44.8-5.4zM79.7 50c-2.6 2-2.6 2.5-2.9 13.8l-.3 11.7-11.7.3c-11.3.3-11.8.4-13.8 2.9-2.5 3.3-2.5 5.3.1 8.7 2 2.5 2.3 2.6 14 2.6H77v11.9c0 11.8 0 12 2.7 14.1 3.2 2.5 6.9 2 9.6-1.2 1.4-1.7 1.7-4 1.7-13.4V90h11.8c13.5 0 15.2-.8 15.2-7.2 0-5.9-1.9-6.8-15.3-6.8H91V64.6c0-9.4-.3-11.7-1.7-13.4-2.7-3.2-6.4-3.7-9.6-1.2z"/>
                        </svg>
                    </a>
                </div>
                <div className={`card ${styles.item} ${styles.hospital_area}`}>
                    
                </div>            
            </div>
            <div className='modal fade pb-5' id='register-hospital' data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className='modal-dialog modal-dialog-centered'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <p className='m-0'>
                                Cadastrar Hospital
                            </p>
                            <button type='button' className="small-button" data-bs-dismiss="modal" aria-label="Close">
                                <i className="bi bi-x fs-2"></i>
                            </button>
                        </div>
                        <div className='modal-body'>
                            <form className={`${styles.register_form}`}>
                                <label>
                                    <span>Nome:</span>
                                    <input
                                        className='form-control'
                                        type='text'
                                        value={name}
                                        placeholder='Razão Social/Nome Fantasia'
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                                    />
                                </label>
                                <label>
                                    <span>Sigla:</span>
                                    <input 
                                        className='form-control'
                                        type='text'
                                        value={acronym}
                                        placeholder='Sigla/Apelido'
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setAcronym(e.target.value)}
                                    />
                                </label>
                                <label>
                                    <span>Ativo:</span>
                                </label>
                            </form>
                        </div>
                        <div className='modal-footer'>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Hospitals;