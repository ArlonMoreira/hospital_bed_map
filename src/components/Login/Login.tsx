import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
//styles
import styles from './Login.module.css'
//interface
import { ILogin, IAuthError, AuthHookResult, IAuthentication } from '../../interfaces/Authentication'
//Redux
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { AnyAction } from 'redux'; // Importe o tipo AnyAction do pacote 'redux'
import { login } from '../../slices/authSlice';
import { RootState } from '../../store';
//hooks
import { useAuth } from '../../hooks/useAuth';
//components
import Alert from '../Alert/Alert';

type Props = {
    openModalLoading: boolean
}

const Login = ({openModalLoading}: Props) => {

    const buttonCloseRef = useRef<HTMLButtonElement>(null);
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');    

    /**
     * Start: Detectar autenticação
     */
    const { auth }:AuthHookResult  = useAuth(); //Hook que retorna situação de autenticação.

    useEffect(()=>{
        if(auth){ //Caso autenticado.
            buttonCloseRef.current?.click(); //Fechar modal de login. Utiliza uma referência pois, só quero fechar o modal caso o login for bem sucedido.

            setUsername(''); //Limpar campo username; 
            setPassword(''); //Limpar campo password;    
            setErrors(null); //Limpar campo de errors;        
        }
    }, [auth]);

    /**
     * Start: Tratando erros de autenticação
     */
    const [errors, setErrors] = useState<IAuthError | null>(null);
    //const { error, loading }: {error:IAuthentication | null, loading: boolean} = useSelector((state: RootState) => state.auth);
    /*
    useEffect(()=>{
        if(error){ //Caso ocorrer um erro o stado errors como formato IAuthError será definido, assim será possível recuperar o motivo específico do erro de username e password
            setErrors(error.data as IAuthError);
        }
    }, [error]);*/

    /**
     * Start: Submissão do login.
     */
    const dispatch = useDispatch<ThunkDispatch<RootState, ILogin, AnyAction>>();
    
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const data:ILogin = {
            username,
            password
        };

        if(!auth){ //Permitir que o login ocorra apenas se não estiver autenticado.
            await dispatch(login(data));        
        }

    };

    /**
     * Start: revelar senha
     */
    const [typeInputPassword, setTypeInputPassword] = useState<'password' | 'text'>('password');

    const handleRevealPassword = ():void => {
        setTypeInputPassword((current) => current === 'password' ? 'text': 'password');
    };    

    /**
     * Start: Limpa o modal quando o mesmo for aberto
     */

    useEffect(()=>{
        setUsername('');
        setPassword('');    
        setErrors(null);
        setTypeInputPassword('password');
    }, [openModalLoading]);

    return (
        <>
            {/*   error && <Alert message={error.message} trigger={error} type={'error'} />  */} 
            <div className='modal fade pb-5' id="login-modal" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className='modal-content modal_custom'>
                        <div className="modal-header border-0">
                            <p className='m-0'>Faça a autenticação para acessar a área de cadastro de leitos.</p>
                            <button type="button" ref={buttonCloseRef} className="small-button" data-bs-dismiss="modal" aria-label="Close">
                                <i className="bi bi-x fs-2"></i>
                            </button>
                        </div>
                        <form className={`${styles.login_form}`} onSubmit={handleSubmit}>
                            <div className='modal-body text-center'>
                                <label>
                                    <span>Usuário</span>
                                    <input
                                        className='form-control'
                                        type='text'
                                        value={username}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                                    />
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                        <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/>
                                    </svg>                                    
                                    {
                                        errors?.username && (
                                            <ul className={styles.warning}>
                                                {
                                                    errors?.username.map((erro, i) => (
                                                        <li key={i}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                                                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/>
                                                            </svg>
                                                            <p className='warning'>{erro}</p>
                                                        </li>
                                                    )) 
                                                }                                               
                                            </ul>
                                        )
                                    }
                                </label>
                                <label>
                                    <span>Senha</span>
                                    <input
                                        className='form-control'
                                        type={typeInputPassword}
                                        placeholder='********'
                                        value={password}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                    />
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                        <path d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z"/>
                                    </svg>                                    
                                    {
                                        errors?.password && (
                                            <ul className={styles.warning}>
                                                {
                                                    errors?.password.map((erro, i) => (
                                                        <li key={i}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                                                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/>
                                                            </svg>
                                                            <p className='warning'>{erro}</p>
                                                        </li>
                                                    )) 
                                                }                                               
                                            </ul>
                                        ) 
                                    }
                                    <a className={styles.reveal_password} onClick={handleRevealPassword}>
                                        {
                                            typeInputPassword === 'text' ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                                    <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/>
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                                                    <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z"/>
                                                </svg>
                                            )
                                        }                                                                               
                                    </a>                                   
                                </label>                                
                            </div>
                            <div className='modal-footer border-0'>
                                {/*
                                    loading ? (
                                        <button className='form-control' disabled>
                                            <div className="spinner-border" role="status">
                                                <span className="sr-only"></span>
                                            </div>
                                        </button>
                                    ) : (
                                        <input 
                                            className='form-control'
                                            type='submit' 
                                            value='Acessar'
                                        /> 
                                    )
                                    */}
                            </div>
                        </form>
                    </div>
                </div>
            </div>                             
        </>
    )
}

export default Login;