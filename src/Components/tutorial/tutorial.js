import styles from './tutorial.module.css';
import backImage from '../../Assets/surrenderBack.png';
import avatar from '../../Assets/avatar.png';
import { Typewriter } from 'react-typewriting-effect'
import 'react-typewriting-effect/dist/index.css'
import { useEffect, useState } from 'react';
import Fade from 'react-reveal/Fade';

function TutorialModal({ item, index }) {

    const [show, setShow] = useState(false);

    useEffect(() => {
        if (index === 1) {
            setShow((prev) => {
                return false;
            })
            setTimeout(() => {
                setShow((prev) => {
                    return true;
                })
            }, 500)
        } else {
            setShow((prev) => {
                return true;
            })
        }

    }, [item])

    // Logic for typed text
    return (
        <div className={styles.row}>
            <Fade up distance={'2em'}>
                <div style={{ backgroundImage: "url(" + backImage + ")", marginTop: item.top, marginLeft: item.left }} className={styles.tutorialBox}>
                    <img src={avatar} className={styles.player} />
                    <div className={styles.textBox}>
                        {
                            show ?
                                <div className={styles.relative}>
                                    {
                                        item.image ? <img src={item.image} className={styles.img} /> : <></>
                                    }
                                    <Typewriter
                                        string={item.text}
                                        delay={25}
                                        cursor=''
                                    />
                                </div>
                                : <></>
                        }

                    </div>
                </div>
            </Fade>
        </div>
    );
}

export default TutorialModal;