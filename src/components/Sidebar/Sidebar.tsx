//Styles
import styles from './Sidebar.module.css';
//Router
import { NavLink } from 'react-router-dom';
//Hooks
import { useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
//interface
import { AuthHookResult } from '../../interfaces/Authentication';

type Props = {
    sideBarRef: React.LegacyRef<HTMLElement> | undefined ,
    setOpenModalLoading: React.Dispatch<React.SetStateAction<boolean>>,
}

const Sidebar = ({sideBarRef, setOpenModalLoading}: Props) => {

    const { auth }:AuthHookResult = useAuth();

    const sidebar = useRef<HTMLDivElement>(null);

    const handleExpand = ():void => {
        sidebar.current?.classList.toggle(styles.expand);
    };

    /**
     * Start: Identifica se o modal de login foi aberto
     */

    //Será utilizado para identificar se o modal foi aberto, realizado a limpeza dos campos
    //username, password e errors 
    const handleOpenModalLoading = (): void => {
        setOpenModalLoading((current:boolean)=> current ? false: true);
    };

    return (
        <nav ref={sideBarRef} className={`${styles.sidebar} py-1 px-1 py-sm-1 px-sm-1 py-md-2 px-md-2`}>
            <div className={`${styles.sidebar_left}`} ref={sidebar}>
                <ul className={`nav ${styles.container_nav}`}>
                    <li className={`nav-item ${styles.expand_button}`} onClick={handleExpand}>
                        <a>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="22" fill="white" viewBox="0 0 16 16">
                                <path d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                            </svg>  
                        </a>
                    </li>
                    <li className={`nav-item ${styles.item}`}>
                        <NavLink to='/'>
                            <div className={styles.logo_nav}>
                                <svg width="24" height="24" className="bi bi-bar-chart" viewBox="0 0 16 16" >
                                    <path d="M4 11H2v3h2v-3zm5-4H7v7h2V7zm5-5v12h-2V2h2zm-2-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1h-2zM6 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm-5 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3z"/>
                                </svg>
                            </div>
                            <div className={styles.text_nav}>
                                <p>Dashboard</p>
                            </div>
                        </NavLink>
                    </li>
                    <li className={`nav-item ${styles.item}`}>
                        <NavLink to='/leitos'>
                            <div className={styles.logo_nav}>
                                <svg width="24" height="24" viewBox="0 0 249.000000 203.000000" preserveAspectRatio="xMidYMid meet">
                                    <g transform="translate(0.000000,203.000000) scale(0.100000,-0.100000)" stroke="none">
                                        <path d="M1760 1970 c-33 -8 -62 -55 -150 -242 -40 -87 -78 -158 -84 -158 -6 0 -33 34 -61 75 -40 60 -57 77 -85 85 -47 13 -495 13 -542 0 -68 -19 -89 -85 -44 -137 l24 -28 251 -3 251 -3 52 -77 c115 -171 125 -182 167 -182 23 0 47 7 59 18 11 9 57 98 103 197 45 99 88 186 94 193 8 9 23 -4 65 -59 30 -39 65 -75 78 -80 33 -13 389 -11 435 2 30 8 42 18 53 45 12 29 12 39 0 68 -20 48 -57 56 -258 56 l-167 0 -73 96 c-40 53 -78 102 -84 109 -16 21 -56 33 -84 25z"/>
                                        <path d="M75 1705 l-25 -24 0 -781 0 -781 25 -24 c30 -31 83 -33 116 -6 23 18 24 25 27 175 l3 156 1025 0 1024 0 0 -164 c0 -148 2 -166 20 -188 39 -50 118 -37 139 22 14 42 15 804 1 905 -19 130 -96 249 -203 313 -83 50 -142 62 -305 63 l-144 1 -25 -54 c-13 -29 -38 -68 -56 -86 l-31 -32 190 0 c211 0 253 -8 316 -60 20 -17 49 -56 65 -88 28 -57 28 -58 28 -257 l0 -200 -480 0 -480 0 -3 298 c-3 332 -7 311 68 311 l36 1 -59 82 c-33 46 -61 83 -64 83 -13 0 -81 -42 -100 -62 -50 -53 -53 -76 -53 -395 0 -164 -4 -304 -8 -311 -7 -10 -104 -12 -453 -10 l-444 3 -5 548 -5 549 -24 19 c-33 27 -86 25 -116 -6z"/>
                                        <path d="M546 1346 c-200 -84 -260 -345 -117 -508 171 -194 484 -121 558 131 30 104 -6 231 -88 310 -65 62 -119 84 -214 88 -68 3 -89 0 -139 -21z m219 -177 c69 -61 83 -125 42 -192 -33 -54 -72 -77 -133 -77 -89 0 -154 65 -154 155 0 83 67 145 157 145 44 0 58 -5 88 -31z"/>
                                    </g>
                                </svg>
                            </div>
                            <div className={styles.text_nav}>
                                <p>Leitos</p>
                            </div>
                        </NavLink>
                    </li>
                </ul>
                <ul className={`nav ${styles.container_nav}`}>
                    {
                        !auth ? (
                            <li className={`nav-item ${styles.item} ${!auth ? styles.fade_out : ''}`}>
                                <a data-bs-toggle="modal" data-bs-target="#login-modal" onClick={handleOpenModalLoading}>
                                    <div className={styles.logo_nav}>
                                        <div className={styles.background_icon}>
                                            <svg width="26" height="26" viewBox="0 0 149 166" xmlns="http://www.w3.org/2000/svg">
                                                <g transform="translate(0 166) scale(.1 -.1)">
                                                    <path d="m655 1617c-74-20-132-53-186-107-224-224-108-605 206-670 167-35 350 58 431 217 27 54 29 66 29 173s-2 119-29 173c-40 79-137 168-213 197-72 27-172 34-238 17zm222-115c67-35 114-82 145-147 90-190-40-407-253-423-91-6-154 16-223 79-97 89-127 219-76 337 27 63 110 143 172 166 61 22 180 16 235-12z"/>
                                                    <path d="m513 670c-211-38-380-189-436-390-25-87-31-157-17-191 25-60 9-59 694-59h624l31 26c28 24 31 31 31 88 0 221-161 437-379 508-58 18-94 21-281 24-118 1-238-1-267-6zm498-106c88-26 150-63 209-123 76-79 129-193 130-283v-28h-605-605l6 33c22 133 63 215 145 291 61 57 120 90 197 111 74 21 453 20 523-1z"/>
                                                </g>
                                            </svg>
                                        </div>
                                    </div>
                                    <div className={styles.text_nav}>
                                        <p>Acessar</p>
                                    </div>
                                </a>
                            </li>
                        ): (
                            <li className={`nav-item ${styles.item}`}>
                                <a data-bs-toggle="modal" data-bs-target="#logout-modal">
                                    <div className={styles.logo_nav}>
                                        <div className={styles.background_icon}>
                                            <svg width="26" height="26" version="1.0" viewBox="0 0 166 144" xmlns="http://www.w3.org/2000/svg">
                                                <g transform="translate(0 144) scale(.1 -.1)">
                                                    <path d="m190 1405c-60-19-113-65-142-122l-23-48-3-484c-2-329 1-501 8-537 15-70 61-131 125-163 47-25 59-26 231-29 121-2 189 0 203 8 24 12 29 64 9 77-7 4-97 10-200 13-208 6-221 10-263 81-19 33-20 52-20 519s1 486 20 519c42 71 55 75 263 81 103 3 193 9 200 13 19 13 15 65-7 77-30 16-346 12-401-5z"/>
                                                    <path d="m1045 1210c-11-4-31-20-45-35-22-23-25-37-28-116l-4-89h-171c-264 0-277-12-277-250s13-250 277-250h171l4-89c3-83 5-92 32-120 37-38 87-49 130-28 17 8 131 110 254 227l222 211v49 49l-226 213c-124 117-236 218-247 225-25 14-63 15-92 3zm266-287c115-109 209-200 209-203 0-12-420-400-433-400-22 0-27 23-27 130 0 88-2 100-19 110-12 6-99 10-213 10-138 0-197 3-206 12-17 17-17 259 0 276 9 9 68 12 206 12 114 0 201 4 213 10 17 10 19 22 19 110 0 107 5 130 27 130 8 0 108-89 224-197z"/>
                                                </g>
                                            </svg>
                                        </div>
                                    </div>
                                    <div className={styles.text_nav}>
                                        <p>Sair</p>
                                    </div>
                                </a>
                            </li>
                        )
                    }
                </ul>
            </div>
        </nav>
    )
};

export default Sidebar