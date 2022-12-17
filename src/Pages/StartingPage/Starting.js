import { useEffect, useRef, useState } from 'react';
import styles from './Starting.module.css';
import { Link } from 'react-router-dom';
import SettingsModal from '../../Components/Modals/Settings';
import Loader from '../../Components/Loader/Loader';
import buttonClick from '../../Assets/sounds/starting/open.mp3';
import startClick from '../../Assets/sounds/starting/start.wav';
import useSound from 'use-sound';
import CreditsModal from '../../Components/Modals/credits';

const backgroundImg = require('./../../Assets/StartingPage/background.jpg');
const normalButton = require('./../../Assets/StartingPage/start.png');
const normalOptions = require('./../../Assets/MainMenu/options.png');
const creditsButton = require('./../../Assets/StartingPage/credits.png');

function StartingPage() {
    const [settingsModalState, setSettingsModalState] = useState(false);
    const [creditsModalState, setCreditsModalState] = useState(false);

    // Loading effect on page load
    const [loading, setLoading] = useState(true);

    function timeout(delay) {
        return new Promise(res => setTimeout(res, delay));
    }

    // stops loading once page loaded
    const stopLoading = async () => {
        await timeout(1000);
        setLoading(false);
    }

    // Sound logic
    const [playButton] = useSound(buttonClick, { volume: .3 });
    const [playStart] = useSound(startClick, { volume: .3 });

    // starts loading
    useEffect(() => {
        stopLoading();
    }, [])

    return (
        <div className={styles.app}>
            <Loader loading={loading} time={1000} />
            <div className={styles.background} style={{ backgroundImage: "url(" + backgroundImg + ")" }}>
                <div className={styles.container}>
                    <img className={styles.logo} alt={'Card Kingdom'} src={require('./../../Assets/StartingPage/logo.png')}></img>

                    {/* Start Button */}
                    <Link className={styles.startButtonContainer} to={'/main'} onClick={() => {
                        playStart();
                    }}>
                        <img className={styles.startButton} alt={'Start'} src={normalButton}></img>
                    </Link>

                    {/* Credits Button */}
                    <div className={styles.startButtonContainer} onClick={() => {
                        setCreditsModalState(true)
                        playButton();
                    }}>
                        <img className={styles.creditsButton} alt={'Start'} src={creditsButton}></img>
                    </div>

                    <div className={styles.topLeft}>
                        <img className={`${styles.options}`} src={normalOptions} onClick={() => {
                            setSettingsModalState(true);
                            playButton();
                        }}></img>
                    </div>

                </div>
            </div>
            <div className={settingsModalState ? styles.overlayModal : styles.fadeInOut} onClick={() => setSettingsModalState(false)}>
                <SettingsModal setIsOpen={setSettingsModalState} main={true} />
            </div>
            <div className={creditsModalState ? styles.overlayModal : styles.fadeInOut} onClick={() => setCreditsModalState(false)}>
                <CreditsModal setIsOpen={setCreditsModalState} isOpen={creditsModalState} />
            </div>
        </div>
    );
}

export default StartingPage;
