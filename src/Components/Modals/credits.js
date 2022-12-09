import styles from './credits.module.css';
import backgroundImage from '../../Assets/MainMenu/Menu.png'
import CloseModalButton from '../../Components/closeButton/CloseButton';
import Fade from 'react-reveal/Fade';

function CreditsModal({ setIsOpen, isOpen }) {

    const closeModal = () => {
        setIsOpen(false);
    }

    return (
        <div className={styles.panel} onClick={e => e.stopPropagation()}>
            <div className={styles.container} onClick={e => e.stopPropagation()} style={{ backgroundImage: "url(" + backgroundImage + ")" }} >
                <div className={styles.closeButton}>
                    <CloseModalButton closeModal={closeModal} small={true} />
                </div>
                <div className={styles.Header}>
                    <h1>CREDITS</h1>
                </div>
                <div className={styles.settings}>
                    <div className={styles.column}>
                        <Fade up delay={100} when={isOpen}><div>Tobey Hainge - Lead Designer</div></Fade>
                        <Fade up delay={200} when={isOpen}><div>Alena - Art</div></Fade>
                        <Fade up delay={300} when={isOpen}><div>Elizabeth - Art</div></Fade>
                        <Fade up delay={400} when={isOpen}><div>Elements Envato - Sounds</div></Fade>
                        <Fade up delay={500} when={isOpen}><div>Ironhide Studios - Music</div></Fade>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreditsModal;