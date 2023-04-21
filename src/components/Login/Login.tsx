import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
//styles
import styles from './Login.module.css'
//interface
import { ILogin, AuthHookResult } from '../../interfaces/Authentication'
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

    const { auth }:AuthHookResult  = useAuth(); //Hook que retorna situação de autenticação.

    const { error, loading } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<ThunkDispatch<RootState, ILogin, AnyAction>>();

    const buttonSubmit = useRef<HTMLInputElement>(null);
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const buttonCloseRef = useRef<HTMLButtonElement>(null);

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

    useEffect(()=>{ //Detectar quando a autenticação ocorrer
        if(auth){ //Assim que autenticar será forçado o click no botão de abertura do modal, fechando-o.
            buttonCloseRef.current?.click();

            setUsername(''); //Limpar campo quando autenticado; 
            setPassword(''); //Limpar campo quando autenticado;            
        }
    }, [auth]);

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