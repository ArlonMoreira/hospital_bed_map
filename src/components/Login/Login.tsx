import React, { ChangeEvent, FormEvent, useRef, useState } from 'react'
//styles
import styles from './Login.module.css'

type Props = {}

const Login = (props: Props) => {

    const buttonSubmit = useRef<HTMLInputElement>(null);
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const data = {
            username,
            password
        };

        setUsername('');
        setPassword('');

        buttonSubmit.current?.classList.add(styles.pulse);
        setTimeout(function() {
            buttonSubmit.current?.classList.remove(styles.pulse);
        }, 500);        
    };

    return (
        <div className="modal fade pb-5" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className={`modal-content ${styles.auth}`}>
                    <div className="modal-header border-0">
                        <p className='m-0'>Faça a autenticação para acessar a área de cadastro de leitos.</p>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
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
                            <input type='submit' value='Acessar' className='form-control' ref={buttonSubmit}></input>                        
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login