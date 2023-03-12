import React, {useState, useEffect} from 'react';
import Cookies from 'js-cookie';
import {TransformComponent, TransformWrapper} from "react-zoom-pan-pinch";
import './App.css';

// Liste de tous les noms des images utilisées
const imageNames = [
    "barb_0001-4133_1919_num_5_1_T1_0021_0000",
    "barb_0001-4133_1919_num_5_1_T1_0613_0000",
    "barb_0001-4133_1920_num_6_1_T1_0012_0000"
];

// Création d'un objet contenant toutes les images
const images = {};
for (let name of imageNames) {
    images[name] = require(`./assets/pages/${name}/${name}_original.png`);
    images[`${name}_expert`] = require(`./assets/pages/${name}/${name}_resultat_expert.png`);
    images[`${name}_v1`] = require(`./assets/pages/${name}/${name}_resultat_outil_v1.png`);
    images[`${name}_v2`] = require(`./assets/pages/${name}/${name}_resultat_outil_v2.png`);
    images[`${name}_v3`] = require(`./assets/pages/${name}/${name}_resultat_outil_v3.png`);
}

// Image par défaut TODO: à changer
let imageSrc = images["barb_0001-4133_1919_num_5_1_T1_0021_0000"];

// Modale de connexion
function PasswordModal({setPassword, errorMessage}) {
    const [passwordInput, setPasswordInput] = useState('');

    const handlePasswordChange = (event) => {
        setPasswordInput(event.target.value);
    };

    const handlePasswordSubmit = (event) => {
        event.preventDefault();
        setPassword(passwordInput);
    };

    return (
        <div className="modal-background">
            <div className="modal">
                <form onSubmit={handlePasswordSubmit}>
                    <h2>Veuillez saisir le mot de passe :</h2>
                    {errorMessage && <p>{errorMessage}</p>}
                    <input type="password" value={passwordInput} onChange={handlePasswordChange}/>
                    <br/>
                    <button type="submit">Se connecter</button>
                </form>
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

    function handleCloseModal() {
        setIsModalOpen(false);
    }

    function handleOpenModal() {
        setIsModalOpen(true);
    }

    function handleSelectChange(event) {
        setSelectedImage(event.target.value);
        imageSrc = images[event.target.value];
    }

    function handlePasswordSubmit(submittedPassword) {
        if (submittedPassword === 'IopetiMathieuYvoz') {
            Cookies.set('password', submittedPassword, {expires: 1});
            setIsLoggedIn(true);
            setIsModalOpen(false);
        } else {
            setErrorMessage('Mot de passe incorrect.');
        }
    }

    const [selectedImage, setSelectedImage] = useState(Object.keys(images)[0]);

    return (
        <div>
            {isLoggedIn ? (
                <div>
                    <header>
                        <div className="menu">
                            {"Page sélectionnée : "}
                            <select value={selectedImage} onChange={handleSelectChange}>
                                {Object.keys(images).map((imageName) => (
                                    <option key={imageName} value={imageName}>{imageName}</option>
                                ))}
                            </select>
                        </div>
                    </header>
                    <main>
                        <div className="image">
                            <div>
                                <TransformWrapper defaultScale={1} defaultPositionX={1} defaultPositionY={1}>
                                    <TransformComponent>
                                        <img src={imageSrc} alt=""/>
                                    </TransformComponent>
                                </TransformWrapper>
                            </div>
                            <button className="button" type="button"> Celle de gauche !</button>
                        </div>
                        <div className="image">
                            <div>
                                <TransformWrapper defaultScale={1} defaultPositionX={1} defaultPositionY={1}>
                                    <TransformComponent>
                                        <img src={imageSrc} alt=""/>
                                    </TransformComponent>
                                </TransformWrapper>
                            </div>
                            <button className="button" type="button"> Celle de droite !</button>
                        </div>
                    </main>
                </div>
            ) : (
                <PasswordModal setPassword={handlePasswordSubmit} closeModal={handleCloseModal}
                               openModal={handleOpenModal}
                               errorMessage={errorMessage}/>
            )}
        </div>
    );
}