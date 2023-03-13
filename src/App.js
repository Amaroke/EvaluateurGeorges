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
    images[name] = require(`./assets/pages/${name}/${name}.png`);
    images[`${name}_expert`] = require(`./assets/pages/${name}/${name}_expert.png`);
    images[`${name}_approximation1`] = require(`./assets/pages/${name}/${name}_approximation1.png`);
    images[`${name}_approximation2`] = require(`./assets/pages/${name}/${name}_approximation2.png`);
    images[`${name}_extrapolation`] = require(`./assets/pages/${name}/${name}_extrapolation.png`);
}

let imageSrc = imageNames[0]

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
    const [imageScores, setImageScores] = useState({});

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
        imageSrc = event.target.value;
    }

    function handleImageScore(imageName) {
        setImageScores({
            ...imageScores,
            [imageName]: (imageScores[imageName] || 0) + 1
        });
        console.log(imageScores);
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

    const matchingImages = [];

    for (let key in images) {
        if (key.includes(imageSrc)) {
            matchingImages.push(key);
        }
    }

    let img1 = matchingImages[Math.floor(Math.random() * matchingImages.length)];
    let img2 = matchingImages[Math.floor(Math.random() * matchingImages.length)];

    while (img2 === img1) {
        img2 = matchingImages[Math.floor(Math.random() * matchingImages.length)];
    }

    return (
        <div>
            {isLoggedIn ? (
                <div>
                    <header>
                        <div className="menu">
                            {"Page sélectionnée : "}
                            <select value={selectedImage} onChange={handleSelectChange}>
                                {imageNames.map((imageName) => (
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
                                        <img src={images[img1]} alt=""/>
                                    </TransformComponent>
                                </TransformWrapper>
                            </div>
                            <button className="button" type="button"
                                    onClick={() => handleImageScore(img1)}> Celle de gauche !
                            </button>
                        </div>
                        <div className="image">
                            <div>
                                <TransformWrapper defaultScale={1} defaultPositionX={1} defaultPositionY={1}>
                                    <TransformComponent>
                                        <img src={images[img2]} alt=""/>
                                    </TransformComponent>
                                </TransformWrapper>
                            </div>
                            <button className="button" type="button"
                                    onClick={() => handleImageScore(img2)}> Celle de droite !
                            </button>
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