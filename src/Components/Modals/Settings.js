import React, { useEffect, useState } from 'react';
import styles from './Settings.module.css';
import backgroundImage from '../../Assets/MainMenu/Menu.png'
import CloseModalButton from '../../Components/closeButton/CloseButton';
import { Link } from 'react-router-dom';
import buttonClick from '../../Assets/sounds/starting/button.mp3';
import closeClick from '../../Assets/sounds/starting/close.mp3';
import useSound from 'use-sound';
import { ContextFunction } from '../../Contexts/contextProvider';
import localStorage from 'local-storage';

const mutedImg = require('../../Assets/mute.png');
const unmutedImg = require('../../Assets/unMuted.png');
const fullscreenImg = require('../../Assets/fullscreen.png');
const menu = require('../../Assets/MainMenu/button.png')
const resetImage = require('../../Assets/reset.png')

function SettingsModal({ setIsOpen, main }) {
    const obj = ContextFunction();
    const { setMusic, muteIsActive, setMuteIsActive } = obj;
    function closeModal() {
        setIsOpen(false);
    }

    // Sound logic
    const [closeButton] = useSound(closeClick, { volume: .3 });
    const [playButton] = useSound(buttonClick, { volume: .3 });

    function toggleFullScreen(elem) {
        if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
            if (elem.requestFullScreen) {
                elem.requestFullScreen();
            } else if (elem.mozRequestFullScreen) {
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullScreen) {
                elem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            }
        } else {
            if (document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }

    const [toggled3, setToggled3] = useState(false);

    const startMusic = () => {
        // Start music 1
        let newObj = {
            playingMusic1: true,
            playingMusic2: false,
        }
        // end music 2
        setMusic(newObj);
    }

    const stopMusic = () => {
        // Start music 1
        let newObj = {
            playingMusic1: false,
            playingMusic2: false,
        }
        // end music 2
        setMusic(newObj);
    }

    const toggleMusic = () => {
        if (muteIsActive) {
            startMusic();
            setMuteIsActive(false);
        } else {
            stopMusic();
            setMuteIsActive(true);
        }
    }

    const hardReset = () => {
        localStorage.clear();
        window.location.reload()
    }

    return (
        <div className={styles.panel} onClick={e => e.stopPropagation()}>
            <div className={styles.container} onClick={e => e.stopPropagation()} style={{ backgroundImage: "url(" + backgroundImage + ")" }} >
                <div className={styles.closeButton}>
                    <CloseModalButton closeModal={closeModal} small={true} />
                </div>
                <div className={styles.Header}>
                    <h1>OPTIONS</h1>
                </div>
                <div className={styles.settings}>
                    <div className={styles.row}>
                        <div className={styles.column}>
                            <div className={styles.imageText2}>Mute</div>
                            <img className={styles.image} src={muteIsActive ? mutedImg : unmutedImg}
                                onClick={() => {
                                    toggleMusic()
                                    playButton()
                                }}
                            ></img>
                        </div>
                        <div className={styles.column}>
                            <div className={styles.imageText}>Fullscreen</div>
                            <img className={styles.image} src={fullscreenImg}
                                onClick={() => {
                                    toggleFullScreen(document.body)
                                    playButton()
                                }}
                            ></img>
                        </div>
                    </div>
                    {
                        !main ? <Link to={'/'} className={styles.link} onClick={() => {
                            closeButton();
                        }}>
                            <div className={styles.papa} onMouseEnter={() => setToggled3(true)} onMouseLeave={() => setToggled3(false)}>
                                <img className={`${styles.image2} ${toggled3 ? styles.imageActive : styles.nothingatall}`} src={menu} onClick={() => toggleFullScreen(document.body)} />
                                <div className={styles.imageText3}>Quit</div>
                            </div>
                        </Link> : <></>
                    }
                    <div className={`${styles.column} ${styles.hardReset}`}>
                        <div className={styles.imageText4}>Factory Reset</div>
                        <img className={styles.image} src={resetImage}
                            onClick={hardReset}
                        ></img>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SettingsModal;