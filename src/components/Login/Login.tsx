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

type Props = {}

const Login = (props: Props) => {

    const buttonCloseRef = useRef<HTMLButtonElement>(null);
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');    

    /**
     * Start: Detectar autenticação
     */
    const { auth }:AuthHookResult  = useAuth(); //Hook que retorna situação de autenticação.

    useEffect(()=>{
        if(auth){ //Caso autenticado.
            buttonCloseRef.current?.click(); //Fechar modal de login.

            setUsername(''); //Limpar campo username; 
            setPassword(''); //Limpar campo password;    
            setErrors(null); //Limpar campo de errors;        
        }
    }, [auth]);

    /**
     * Start: Tratando erros de autenticação
     */
    const [errors, setErrors] = useState<IAuthError | null>(null);
    const { error, loading }: {error:IAuthentication | null, loading: boolean} = useSelector((state: RootState) => state.auth);

    useEffect(()=>{
        console.log(error)
        if(error){ //Caso ocorrer um erro o stado errors como formato IAuthError será definido, assim será possível recuperar o motivo específico do erro de username e password
            setErrors(error.data as IAuthError);
        }
    }, [error]);

    /**
     * Start: Submissão do login.
     */
    const dispatch = useDispatch<ThunkDispatch<RootState, ILogin, AnyAction>>();
    const buttonSubmit = useRef<HTMLInputElement>(null); //Apenas para adicionar uma animação ao clicar no botão, faz referencia ao elemento HTML do botão.

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

    return (
        <>
            {   error && <Alert message={error.message} trigger={error} type={'error'} />  } 
            <div className={`modal fade pb-5`} id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className={`modal-content ${styles.auth}`}>
                        <div className="modal-header border-0">
                            <p className='m-0'>Faça a autenticação para acessar a área de cadastro de leitos.</p>
                            <button type="button" ref={buttonCloseRef} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className='modal-body text-center'>
                            <form className={`${styles.login_form}`} onSubmit={handleSubmit}>
                                <label>
                                    <span>Usuário</span>
                                    <input
                                        className='form-control'
                                        type='text'
                                        value={username}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                                    />
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
                                        type='password'
                                        placeholder='********'
                                        value={password}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                    />
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
                                </label>                                
                                {
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
                                            ref={buttonSubmit}
                                            onClick={()=> {
                                                buttonSubmit.current?.classList.add(styles.pulse);
                                                setTimeout(function() {
                                                    buttonSubmit.current?.classList.remove(styles.pulse);
                                                }, 500);
                                            }}
                                        /> 
                                    )
                                }
         
                            </form>
                        </div>
                    </div>
                </div>
            </div>                             
        </>
    )
}

export default Login