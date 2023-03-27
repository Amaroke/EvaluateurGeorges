import React, {useState, useEffect, useRef} from 'react';
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

const etoilePleine = require(`./assets/stars/etoile_pleine.png`);
const etoileVide = require(`./assets/stars/etoile_vide.png`);

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
    const [isPhase2, setIsPhase2] = useState(false);

    const [rating1, setRating1] = useState(false);
    const [rating2, setRating2] = useState(false);
    const [rating3, setRating3] = useState(false);
    const [rating4, setRating4] = useState(false);
    const [selectedRating, setSelectedRating] = useState(0);

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
            [imageName]: (imageScores[imageName] || 0) + selectedRating
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

    // Fonction permettant d'exporter les données générées par le site dans un fichier au format CSV.
    function handleExport() {
        // Nécessaire pour rendre le fichier trouvable.
        let content = "data:text/csv;charset=utf-8,";

        // On ajoute les noms ainsi que les scores associés au fichier CSV.
        for (const [nomImage, score] of Object.entries(imageScores)) {
            content += `${nomImage}, ${score}\n`;
        }

        // Création d'un lien de téléchargement pour le fichier CSV.
        const encodedUri = encodeURI(content);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "score.csv");

        // Ajout du lien à la page.
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    //Fonction permettant de passer à la seconde phase de l'évaluation.
    function handleSecondPhase(){
        // Sauvegarde du contenu de la page
        const originalContent = document.body.innerHTML;

        //Affiche de la phase 2
        setIsPhase2(true)
    }

    function handleRating(val, value, select){
        setSelectedRating(select)
        switch (val) {
            case 1:
                setRating1(value && select !== val)
                break;
            case 2:
                setRating1(value && select !== val)
                setRating2(value && select !== val)
                break;
            case 3:
                setRating1(value && select !== val)
                setRating2(value && select !== val)
                setRating3(value && select !== val)
                break;
            case 4:
                setRating1(value && select !== val)
                setRating2(value && select !== val)
                setRating3(value && select !== val)
                setRating4(value && select !== val)
                break;
        }
    }

    //Fonction permettant de gérer la note d'une image.
    function starRating() {
        //Gestion de la note.


        //Description des étoiles.
        const getStarDescription = (rating) => {
            switch (rating) {
                case 1:
                    return "Immonde";
                case 2:
                    return "Très nul";
                case 3:
                    return "Super";
                case 4:
                    return "Parfait";
                default:
                    return "";
            }
        };

        return (
            <div className="button2-container">
                <button className="button2"
                    data-rating="1"
                    onClick={() => handleRating(1, false, 1)}
                    onMouseOver={() => handleRating(1,true, selectedRating)}
                    onMouseOut={() => handleRating(1,false, selectedRating)}
                >
                    <img
                        src={rating1 ? etoilePleine : etoileVide}
                        alt="Étoile 1"
                    />
                </button>
                <button className="button2"
                    data-rating="2"
                    onClick={() =>handleRating(2, false, 2)}
                        onMouseOver={() => handleRating(2,true, selectedRating)}
                        onMouseOut={() => handleRating(2,false, selectedRating)}
                >
                    <img
                        src={rating2 ? etoilePleine : etoileVide}
                        alt="Étoile 2"
                    />
                </button>
                <button className="button2"
                    data-rating="3"
                    onClick={() => handleRating(3, false, 3)}
                        onMouseOver={() => handleRating(3,true, selectedRating)}
                        onMouseOut={() => handleRating(3,false, selectedRating)}
                >
                    <img
                        src={rating3 ? etoilePleine : etoileVide}
                        alt="Étoile 3"
                    />
                </button>
                <button className="button2"
                    data-rating="4"
                    onClick={() => handleRating(4, false, 4)}
                        onMouseOver={() => handleRating(4,true, selectedRating)}
                        onMouseOut={() => handleRating(4,false, selectedRating)}
                >
                    <img
                        src={rating4 ? etoilePleine : etoileVide}
                        alt="Étoile 4"
                    />
                </button>
                <p>{getStarDescription(rating)}</p>
            </div>
        );
    }

    const [selectedImage, setSelectedImage] = useState(Object.keys(images)[0]);

    const matchingImages = [];

    for (let key in images) {
        if (key.includes(imageSrc)) {
            matchingImages.push(key);
        }
    }

    let img0 = matchingImages[0];
    let img1 = matchingImages[Math.floor(Math.random() * matchingImages.length - 1) + 1];
    let img2 = matchingImages[Math.floor(Math.random() * matchingImages.length - 1) + 1];

    while (img2 === img1) {
        img2 = matchingImages[Math.floor(Math.random() * matchingImages.length - 1) + 1];
    }

    const wrapperRef0 = useRef(null);
    const wrapperRef1 = useRef(null);
    const wrapperRef2 = useRef(null);

    const handleZoomChange = (zoom) => {
        if (zoom.scale === 1) {
            wrapperRef0.current.setTransform(1, 1, 1);
            wrapperRef1.current.setTransform(1, 1, 1);
            wrapperRef2.current.setTransform(1, 1, 1);
        }
        wrapperRef0.current.setTransform(zoom.positionX, zoom.positionY, zoom.scale);
        wrapperRef1.current.setTransform(zoom.positionX, zoom.positionY, zoom.scale);
        wrapperRef2.current.setTransform(zoom.positionX, zoom.positionY, zoom.scale);
    }

    return (
        <div>
            {isLoggedIn ? (
                isPhase2 ? (
                        <div>
                            <header>
                                <div className="menu">
                                    <button className="saveButton" type="button"
                                            onClick={() => handleExport()}> Sauvegarder
                                    </button>
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
                                    <TransformWrapper
                                        defaultScale={1}
                                        defaultPositionX={1}
                                        defaultPositionY={1}
                                        onWheel={(object) => handleZoomChange(object.state)}
                                        onPanning={(object) => handleZoomChange(object.state)}
                                        ref={wrapperRef0}
                                    >
                                        <TransformComponent>
                                            <img src={images[img0]} alt=""/>
                                        </TransformComponent>
                                    </TransformWrapper>
                                    <button className="button" type="button" disabled="true"> Image originale
                                    </button>
                                </div>
                                <div className="image">
                                    <TransformWrapper
                                        defaultScale={1}
                                        defaultPositionX={1}
                                        defaultPositionY={1}
                                        onWheel={(object) => handleZoomChange(object.state)}
                                        onPanning={(object) => handleZoomChange(object.state)}
                                        ref={wrapperRef1}
                                    >
                                        <TransformComponent>
                                            <img src={images[img1]} alt=""/>
                                        </TransformComponent>
                                    </TransformWrapper>
                                    {starRating()}
                                </div>
                            </main>
                        </div>
                    ):
                <div>
                    <header>
                        <div className="menu">
                            <button className="saveButton" type="button"
                                    onClick={() => handleExport()}> Sauvegarder
                            </button>
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
                            <TransformWrapper
                                defaultScale={1}
                                defaultPositionX={1}
                                defaultPositionY={1}
                                onWheel={(object) => handleZoomChange(object.state)}
                                onPanning={(object) => handleZoomChange(object.state)}
                                ref={wrapperRef0}
                            >
                                <TransformComponent>
                                    <img src={images[img0]} alt=""/>
                                </TransformComponent>
                            </TransformWrapper>
                            <button className="button" type="button" disabled="true"> Image originale
                            </button>
                        </div>
                        <div className="image">
                            <TransformWrapper
                                defaultScale={1}
                                defaultPositionX={1}
                                defaultPositionY={1}
                                onWheel={(object) => handleZoomChange(object.state)}
                                onPanning={(object) => handleZoomChange(object.state)}
                                ref={wrapperRef1}
                            >
                                <TransformComponent>
                                    <img src={images[img1]} alt=""/>
                                </TransformComponent>
                            </TransformWrapper>
                            <button className="button" type="button"
                                    onClick={() => handleImageScore(images[img1])}> Celle de gauche !
                            </button>
                        </div>
                        <div className="image">
                            <TransformWrapper
                                defaultScale={1}
                                defaultPositionX={1}
                                defaultPositionY={1}
                                onWheel={(object) => handleZoomChange(object.state)}
                                onPanning={(object) => handleZoomChange(object.state)}
                                ref={wrapperRef2}
                            >
                                <TransformComponent>
                                    <img src={images[img2]} alt=""/>
                                </TransformComponent>
                            </TransformWrapper>
                            <button className="button" type="button"
                                    onClick={() => handleImageScore(images[img2])}> Celle de droite !
                            </button>
                        </div>
                        <button className="button" type="button" onClick={() => handleSecondPhase()}>Phase 2</button>
                    </main>
                </div>
            ) :  (
                <PasswordModal setPassword={handlePasswordSubmit} closeModal={handleCloseModal}
                               openModal={handleOpenModal}
                               errorMessage={errorMessage}/>
                )}
        </div>
    );
}