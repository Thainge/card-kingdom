import React, { useEffect } from "react";
import styles from './Surrender.module.css';
import { Link } from 'react-router-dom';

const backgroundImage = require('../../Assets/surrenderBack.png')

function Surrender({ setIsOpen, setDefeatModal }) {

    function cancelModal() {
        setIsOpen(false);
    }

    return (
        <div className={styles.panel}>
            <div className={styles.container} style={{ backgroundImage: "url(" + backgroundImage + ")" }} onClick={e => e.stopPropagation()}>
                <div className={styles.explained}>
                    Are you sure you wish to surrender?
                </div>
                <div className={styles.closeButton}>
                    <div to={'/main'} className={styles.overlayBtnText} onClickCapture={cancelModal}>
                        <div className={styles.text}>Cancel</div>
                        <img className={styles.btn2} src={require('../../Assets/MainMenu/button.png')}></img>
                    </div>
                </div>
                <div className={styles.closeButton2}>
                    <div to={'/main'} className={styles.overlayBtnText} onClickCapture={setDefeatModal}>
                        <div className={styles.text2}>Surrender</div>
                        <img className={styles.btn2} src={require('../../Assets/MainMenu/button.png')}></img>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Surrender;