import { FormEvent, useState, useRef, ChangeEvent, useEffect } from 'react'
//Styles
import MaskedInput from 'react-input-mask';
//Redux
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { AnyAction } from '@reduxjs/toolkit';
import { reset, register, hideAlerts } from '../../slices/hospitalSlice';
import { refreshToken } from '../../slices/authSlice';
//Interface
import { IHospitalErrors, IHospitalParams } from '../../interfaces/Hospital';
//Components
import Alert from '../Alert/Alert';

type Props = {}

const RegisterHospital = (props: Props) => {
    /**
     * Hospital Slices
     */
    const dispatch = useDispatch<ThunkDispatch<RootState, any, AnyAction>>();
    const { 
        successRegister,
        successRegisterMessage,
        loading,
        errorRegister,
        errorsRegister,
        errorRegisterMessage,
    }: {
        successRegister:boolean | null,
        successRegisterMessage: string | null,
        loading:boolean,
        errorRegister:boolean | null,
        errorsRegister: IHospitalErrors | null,
        errorRegisterMessage: string | null,
    } = useSelector((state: RootState) => state.hospital)

    /**
     * Register Hospital
     */

    const [cnes, setCnes] = useState<string>("");
    const [cnpj, setCnpj] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [acronym, setAcronym] = useState<string>("");
    const [is_active, setIs_active] = useState<boolean>(true);    

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const data:IHospitalParams  = {
            cnes,
            cnpj,
            name,
            acronym,
            is_active
        };
        
        dispatch(reset());
        await dispatch(refreshToken()); //Update token access after to send data
        await dispatch(register(data));
        
    };

    /**
     * Fechar modal e limpar formulário quando o cadastro de hospital for com sucesso.
     */
    const buttonCloseModal = useRef<HTMLInputElement>(null);

    useEffect(()=>{
        if(successRegister) {
            buttonCloseModal.current?.click();
            setCnes('');
            setCnpj('');
            setName('');
            setAcronym('');
            setIs_active(true);
            
        }

    }, [successRegister]);

    /**
     * Alert
     */
    const [ showSuccessAlert, setShowSuccessAlert ] = useState<boolean>(false);
    const [ showErrorAlert, setShowErrorAlert ] = useState<boolean>(false);

    useEffect(()=>{
        if(successRegister && successRegisterMessage){
            setShowSuccessAlert(true);

            const timeout = setTimeout(()=> {
                setShowSuccessAlert(false);
                dispatch(hideAlerts());
            }, 2600);

            return () => {
                clearTimeout(timeout);
            }
        } else {
            setShowSuccessAlert(false);
        }

    }, [successRegister, successRegisterMessage]);

    useEffect(()=>{
        if(errorRegister && errorRegisterMessage){
            setShowErrorAlert(true);

            const timeout = setTimeout(()=>{
                setShowErrorAlert(false);
                dispatch(hideAlerts());
            }, 2600);

            return () => {
                clearTimeout(timeout);
            };

        } else {
            setShowErrorAlert(false);
        }

    }, [errorRegister, errorRegisterMessage]);    

    return (
        <>
            { showSuccessAlert && <Alert message={successRegisterMessage} type='success'/> }
            { showErrorAlert && <Alert message={errorRegisterMessage} type='error'/> }
            <div className='modal fade pb-5' id='register-hospital' data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className='modal-dialog modal-dialog-centered modal-lg'>
                    <div className='modal-content border-0'>
                        <div className='modal-header border-0 modal_header_bg p-4'>
                            <div className='d-flex'>
                                <svg viewBox="0 0 168 166" width="1.5em" height="1.5em">
                                    <path d="M72 4.1c-8.7 1.3-21.7 5.9-28.7 10-7.9 4.8-20.5 16.9-25.7 24.7-17.7 26.8-17.7 61.7 0 88.3 5.3 7.9 17.8 20 25.7 24.8 12.3 7.3 32.3 11.9 46.2 10.6 15.9-1.4 32.6-7.9 44-17.2C152.8 129.6 163 108.1 163 83s-10.2-46.6-29.5-62.3c-7.2-5.8-21.6-12.9-30.6-15.1C94.5 3.5 80.2 2.9 72 4.1zm27 15.5c13.8 3.2 27.6 12.2 36.5 23.8 21.4 27.8 17 67.2-10.2 89.8-12.7 10.6-27.2 15.3-44.3 14.5-17.9-.8-30.7-6.5-43.5-19.2-12.2-12.1-18.6-27.7-18.8-45.5 0-10.5 1.5-17.2 6.3-27.5C31.2 42 40.6 32.2 54.2 25c12.2-6.5 30.6-8.8 44.8-5.4zM79.7 50c-2.6 2-2.6 2.5-2.9 13.8l-.3 11.7-11.7.3c-11.3.3-11.8.4-13.8 2.9-2.5 3.3-2.5 5.3.1 8.7 2 2.5 2.3 2.6 14 2.6H77v11.9c0 11.8 0 12 2.7 14.1 3.2 2.5 6.9 2 9.6-1.2 1.4-1.7 1.7-4 1.7-13.4V90h11.8c13.5 0 15.2-.8 15.2-7.2 0-5.9-1.9-6.8-15.3-6.8H91V64.6c0-9.4-.3-11.7-1.7-13.4-2.7-3.2-6.4-3.7-9.6-1.2z"/>
                                </svg>
                                <h5 className='m-0 mx-1'>
                                    Cadastrar Hospital
                                </h5>
                            </div>
                        </div>
                        <form className='register_form' onSubmit={handleSubmit}>
                            <div className='modal-body p-4 row'>
                                <label className='col-12 col-md-6'>
                                    <span>CNES</span>
                                    <input
                                        className={`form-control ${errorsRegister?.cnes && 'border border-danger'}`}
                                        type='text'
                                        value={cnes}
                                        placeholder='0000000'
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setCnes(e.target.value)}
                                    />
                                    {
                                        errorsRegister?.cnes && (
                                            <ul className='error-message'>
                                                {
                                                    errorsRegister.cnes.map((error, i) => (
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
                                        <label className='col-12 col-md-6'>
                                            <span>CNPJ</span>
                                            <MaskedInput
                                                mask="99.999.999/9999-99"
                                                className={`form-control ${errorsRegister?.cnpj && 'border border-danger'}`}
                                                type='text'
                                                value={cnpj}
                                                placeholder='00.000.000/0000-00'
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => setCnpj(e.target.value)}
                                            />
                                            {
                                                errorsRegister?.cnpj && (
                                                    <ul className='error-message'>
                                                        {
                                                            errorsRegister.cnpj.map((error, i) => (
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
                                        <label className='col-12 col-md-6'>
                                            <span>Nome</span>
                                            <input
                                                className={`form-control ${errorsRegister?.name && 'border border-danger'}`}
                                                type='text'
                                                value={name}
                                                placeholder='Razão Social/Nome Fantasia'
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                                            />
                                            {
                                                errorsRegister?.name && (
                                                    <ul className='error-message'>
                                                        {
                                                            errorsRegister.name.map((error, i) => (
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
                                        <label className='col-12 col-md-6'>
                                            <span>Sigla</span>
                                            <input 
                                                className={`form-control ${errorsRegister?.acronym && 'border border-danger'}`}
                                                type='text'
                                                value={acronym}
                                                placeholder='Sigla/Apelido'
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => setAcronym(e.target.value)}
                                            />
                                            {
                                                errorsRegister?.acronym && (
                                                    <ul className='error-message'>
                                                        {
                                                            errorsRegister.acronym.map((error, i) => (
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
                            </div>
                            <div className='modal-footer border-0 modal_footer_bg px-4'>
                                <input ref={buttonCloseModal} className='cancel col-4' type='cancel' defaultValue='Cancelar' data-bs-dismiss="modal" aria-label="Close"/>
                                {
                                    loading ? (
                                        <div className='col-4'>
                                            <button className='form-control' disabled>
                                                <div className="spinner-border" role="status">
                                                    <span className="sr-only"></span>
                                                </div>
                                            </button>
                                        </div>                                    
                                    ) : (
                                        <input className='col-4' type='submit' value='Cadastrar'/>
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

export default RegisterHospital;