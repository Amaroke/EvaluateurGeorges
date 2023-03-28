import React, {useState, useEffect, useRef} from 'react';
import Cookies from 'js-cookie';
import {TransformComponent, TransformWrapper} from "react-zoom-pan-pinch";
import RatingElement from "./components/RatingElement";
import PasswordModal from "./components/PasswordModal";
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

const matchingImages = [];

for (let key in images) {
    if (key.includes(imageSrc)) {
        matchingImages.push(key);
    }
}

let img0 = matchingImages.splice(0, 1)
let img1 = matchingImages.splice(Math.floor(Math.random() * matchingImages.length - 1) + 1, 1);
let img2 = matchingImages.splice(Math.floor(Math.random() * matchingImages.length - 1) + 1, 1);

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isPhase2, setIsPhase2] = useState(false);
    const [, setIsModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedImage, setSelectedImage] = useState(Object.keys(images)[0]);
    const [imageScores, setImageScores] = useState({});
    const [image1, setImage1] = useState(img1);
    const [image2, setImage2] = useState(img2);



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

    function handleSwapImage(numeroImage) {
        console.log(matchingImages);
        if(matchingImages.length === 0){
            setIsPhase2(true) ;
        } else {
            if (numeroImage === 1) {
                img1 = matchingImages.splice(Math.floor(Math.random() * matchingImages.length - 1) + 1, 1);
            } else {
                img2 = matchingImages.splice(Math.floor(Math.random() * matchingImages.length - 1) + 1, 1);
            }
            setImage1(img1);
            setImage2(img2);
        }
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
                                <div className="image-container">
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
                                        <button className="button" type="button" disabled={true}> Image originale
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
                                        <RatingElement/>
                                    </div>
                                </div>
                            </main>
                        </div>
                    ) :
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
                            <div className="image-container2">
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
                                    <button className="button" type="button" disabled={true}> Image originale
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
                                            <img src={images[image1]} alt=""/>
                                        </TransformComponent>
                                    </TransformWrapper>
                                    <button className="button" type="button"
                                            onClick={() => handleSwapImage(1)}> Celle de gauche !
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
                                            <img src={images[image2]} alt=""/>
                                        </TransformComponent>
                                    </TransformWrapper>
                                    <button className="button" type="button"
                                            onClick={() => handleSwapImage(2)}> Celle de droite !
                                    </button>
                                </div>
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