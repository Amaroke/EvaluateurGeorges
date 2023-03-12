import './App.css';
import Button from "./components/Button/Button";
import Image from "./components/Image/Image";
import Menu from "./components/Menu/Menu";
import {useState, useEffect} from 'react';
import Cookies from 'js-cookie';

function PasswordModal({setPassword, errorMessage}) {
    const [passwordInput, setPasswordInput] = useState('');

    function handlePasswordChange(e) {
        setPasswordInput(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        setPassword(passwordInput);
    }

    return (
        <div className="modal-background">
            <div className="modal">
                <form onSubmit={handleSubmit}>
                    <h2>Veuillez saisir le mot de passe :</h2>
                    {errorMessage && <p>{errorMessage}</p>}
                    <input type="password" value={passwordInput} onChange={handlePasswordChange}/>
                </form>
                <button type="submit">Submit</button>
            </div>
        </div>
    );
}

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [, setIsModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const password = Cookies.get('password');
        if (password) {
            setIsLoggedIn(true);
        }
    }, []);

    function handleOpenModal() {
        setIsModalOpen(true);
    }

    function handleCloseModal() {
        setIsModalOpen(false);
    }

    function handlePasswordSubmit(submittedPassword) {
        if (submittedPassword === 'IopetiMathieuYvoz') {
            Cookies.set('password', submittedPassword, {expires: 7}); // enregistre le mot de passe pour 7 jours
            setIsLoggedIn(true);
            setIsModalOpen(false);
        } else {
            setErrorMessage('Mot de passe incorrect.');
        }
    }

    function handleLogout() {
        Cookies.remove('password');
        setIsLoggedIn(false);
    }

    return (
        <div>
            {isLoggedIn ? (
                <div>
                    <header>
                        <Menu onOpenModal={handleOpenModal} onLogout={handleLogout}/>
                    </header>
                    <main>
                        <div className="image">
                            <Image/>
                            <Button/>
                        </div>
                        <div className="image">
                            <Image/>
                            <Button/>
                        </div>
                    </main>
                </div>
            ) : (
                <PasswordModal setPassword={handlePasswordSubmit} closeModal={handleCloseModal}
                               errorMessage={errorMessage}/>
            )}
        </div>
    );
}