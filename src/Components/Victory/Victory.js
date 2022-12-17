import React, { useEffect } from "react";
import styles from './Victory.module.css';
import { Link } from 'react-router-dom';
import buttonCloseSound from '../../Assets/sounds/starting/close.mp3';
import useSound from 'use-sound';

const backgroundImage = require('../../Assets/victory.png')
const backgroundImage2 = require('../../Assets/victoryFinished.png')

function Victory({ data }) {
    const [closeButtonAudio] = useSound(buttonCloseSound, { volume: .3 });
    return (
        <div className={styles.panel}>
            <div className={styles.container} style={data.stars ? { backgroundImage: "url(" + backgroundImage + ")" } : { backgroundImage: "url(" + backgroundImage2 + ")" }}>
                <div className={styles.closeButton}>
                    <Link onClick={closeButtonAudio} to={'/main'} className={styles.overlayBtnText}>
                        <div className={styles.text}>Continue</div>
                        <img className={styles.btn2} src={require('../../Assets/MainMenu/button.png')}></img>
                    </Link>
                </div>
                <div className={styles.rewardBox}>
                    <img src={require('../../Assets/MainMenu/starBG.png')} className={styles.rewardImg} />
                    <div className={styles.rewardText}>
                        <div className={styles.relative}>
                            <img className={styles.diamond} src={require('../../Assets/diamond.png')} />
                            <div className={styles.rwText}>{data.gold}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Victory;