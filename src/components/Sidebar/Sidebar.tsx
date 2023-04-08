//Styles
import styles from './Sidebar.module.css';
//Router
import { NavLink } from 'react-router-dom';
//Hooks
import { useRef, useState } from 'react';

type Props = {}

const Sidebar = (props: Props) => {

    const sidebar = useRef<HTMLDivElement>(null);

    const handleExpand = () => {
        sidebar.current?.classList.toggle(styles.expand);
    }

    return (
        <nav className='p-2'>
            <div className={`${styles.sidebar_left}`} ref={sidebar}>
                <ul className={`nav ${styles.container_nav}`}>
                    <li className={`nav-item ${styles.item} ${styles.expand_button}`} onClick={handleExpand}>
                        <a>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="22" fill="white" viewBox="0 0 16 16">
                                <path d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                            </svg>  
                        </a>
                    </li>
                    <li className={`nav-item ${styles.item}`}>
                        <NavLink to='/' className='d-flex'>
                            <svg width="26" height="24" className="bi bi-bar-chart" viewBox="0 0 16 16">
                                <path d="M4 11H2v3h2v-3zm5-4H7v7h2V7zm5-5v12h-2V2h2zm-2-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1h-2zM6 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm-5 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3z"/>
                            </svg>
                            <p className={styles.text_nav}>Dashboard</p>
                        </NavLink>
                    </li>
                    <li className={`nav-item ${styles.item}`}>
                        <NavLink to='/' className='d-flex'>
                            <svg width="26" height="24" viewBox="0 0 249.000000 203.000000" preserveAspectRatio="xMidYMid meet">
                                <g transform="translate(0.000000,203.000000) scale(0.100000,-0.100000)" stroke="none">
                                    <path d="M1760 1970 c-33 -8 -62 -55 -150 -242 -40 -87 -78 -158 -84 -158 -6 0 -33 34 -61 75 -40 60 -57 77 -85 85 -47 13 -495 13 -542 0 -68 -19 -89 -85 -44 -137 l24 -28 251 -3 251 -3 52 -77 c115 -171 125 -182 167 -182 23 0 47 7 59 18 11 9 57 98 103 197 45 99 88 186 94 193 8 9 23 -4 65 -59 30 -39 65 -75 78 -80 33 -13 389 -11 435 2 30 8 42 18 53 45 12 29 12 39 0 68 -20 48 -57 56 -258 56 l-167 0 -73 96 c-40 53 -78 102 -84 109 -16 21 -56 33 -84 25z"/>
                                    <path d="M75 1705 l-25 -24 0 -781 0 -781 25 -24 c30 -31 83 -33 116 -6 23 18 24 25 27 175 l3 156 1025 0 1024 0 0 -164 c0 -148 2 -166 20 -188 39 -50 118 -37 139 22 14 42 15 804 1 905 -19 130 -96 249 -203 313 -83 50 -142 62 -305 63 l-144 1 -25 -54 c-13 -29 -38 -68 -56 -86 l-31 -32 190 0 c211 0 253 -8 316 -60 20 -17 49 -56 65 -88 28 -57 28 -58 28 -257 l0 -200 -480 0 -480 0 -3 298 c-3 332 -7 311 68 311 l36 1 -59 82 c-33 46 -61 83 -64 83 -13 0 -81 -42 -100 -62 -50 -53 -53 -76 -53 -395 0 -164 -4 -304 -8 -311 -7 -10 -104 -12 -453 -10 l-444 3 -5 548 -5 549 -24 19 c-33 27 -86 25 -116 -6z"/>
                                    <path d="M546 1346 c-200 -84 -260 -345 -117 -508 171 -194 484 -121 558 131 30 104 -6 231 -88 310 -65 62 -119 84 -214 88 -68 3 -89 0 -139 -21z m219 -177 c69 -61 83 -125 42 -192 -33 -54 -72 -77 -133 -77 -89 0 -154 65 -154 155 0 83 67 145 157 145 44 0 58 -5 88 -31z"/>
                                </g>
                            </svg>
                            <p className={styles.text_nav}>Leitos</p>
                        </NavLink>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Sidebar