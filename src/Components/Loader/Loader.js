import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Loader.module.css';

function Loader({ loading, time, multiplayer, socket }) {

    const [dots, setDots] = useState('');
    const [elapsedTime, setElapsedTime] = useState(0.0);

    useEffect(() => {
        if (multiplayer) {
            const dotInterval = setInterval(function () {
                setDots((prevDots) => {
                    let newDots = prevDots + '.';
                    if (newDots.length > 3) {
                        newDots = '';
                    }
                    return newDots
                })
                if (!loading) clearInterval(dotInterval);
            }, 1000);
            const secondsInterval = setInterval(function () {
                setElapsedTime((prevTime) => {
                    let newTime = prevTime + .1;
                    newTime = Math.round(newTime * 10) / 10
                    return newTime;
                });
                if (!loading) clearInterval(secondsInterval);
            }, 100);
        }
    }, [])

    return (
        <>
            {
                time
                    ? multiplayer
                        ? <div className={loading ? styles.loader : styles.fadeOutLoader}>
                            <div className={styles.center}>
                                <div className={styles.looking}>Searching for players{dots}</div>
                                <div className={styles.timer}>{elapsedTime}{elapsedTime % 1 === 0 ? '.0' : ''}</div>
                                <Link onClick={() => socket.emit('leaveGame')} className={styles.overlayBtnText} to={'/main'}>
                                    <div className={styles.text}>Cancel</div>
                                    <img className={styles.btn2} src={require('../../Assets/MainMenu/button.png')}></img>
                                </Link>
                            </div>
                        </div>
                        : <div className={loading ? styles.loader : styles.fadeOutLoader}>
                            <div className={styles.barImageContainer}>
                                <div className={styles.Bar2}></div>
                                <img className={styles.loaderBar} src={require('../../Assets/loader.png')}></img>
                            </div>
                        </div>
                    :
                    <div className={loading ? styles.loader : styles.fadeOutLoader}>
                        <div className={styles.barImageContainer}>
                            <div className={styles.Bar}></div>
                            <img className={styles.loaderBar} src={require('../../Assets/loader.png')}></img>
                        </div>
                    </div>
            }
        </>
    );
}

export default Loader;