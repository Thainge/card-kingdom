import React from "react";
import styles from './Defeat.module.css';
import { Link } from 'react-router-dom';
import buttonSound from '../../Assets/sounds/starting/button.mp3';
import buttonCloseSound from '../../Assets/sounds/starting/close.mp3';
import useSound from 'use-sound';

const backgroundImage = require('../../Assets/defeat.png');

function Defeat({ setIsOpen, item }) {
    const [soundButton] = useSound(buttonSound, { volume: .5 });
    const [closeButtonAudio] = useSound(buttonCloseSound, { volume: .5 });

    function closeModal() {
        setIsOpen(false);
    }

    return (
        <div className={styles.panel}>
            <div className={styles.container} style={{ backgroundImage: "url(" + backgroundImage + ")" }}>
                <div className={styles.restartButton}>
                    <div onClickCapture={() => {
                        soundButton();
                        window.location.reload();
                    }} className={styles.overlayBtnText}>
                        <div className={styles.text}>Restart</div>
                        <img className={styles.btn2} src={require('../../Assets/MainMenu/button.png')}></img>
                    </div>
                </div>
                <div className={styles.closeButton}>
                    <Link onClick={closeButtonAudio} to={'/main'} className={styles.overlayBtnText}>
                        <div className={styles.text2}>Continue</div>
                        <img className={styles.btn2} src={require('../../Assets/MainMenu/button.png')}></img>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Defeat;