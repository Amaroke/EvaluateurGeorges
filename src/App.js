import React, {useState, useEffect, useRef} from 'react';
import Cookies from 'js-cookie';
import {TransformComponent, TransformWrapper} from "react-zoom-pan-pinch";
import PasswordModal from "./components/PasswordModal";
import './App.css';

// Liste de tous les noms des images utilisées
const imageNames = [
    "barb_0001-4133_1919_num_5_1_T1_0021_0000",
    "barb_0001-4133_1919_num_5_1_T1_0613_0000",
    "barb_0001-4133_1920_num_6_1_T1_0012_0000"
];

// Import des images des étoiles
const etoilePleine = require(`./assets/stars/etoile_pleine.png`);
const etoileVide = require(`./assets/stars/etoile_vide.png`);

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
const matchingImages2 = [];

for (let key in images) {
    if (key.includes(imageSrc)) {
        matchingImages.push(key);
        matchingImages2.push(key);
    }
}

let img0 = matchingImages.splice(0, 1)
let img1 = matchingImages.splice(Math.floor(Math.random() * matchingImages.length - 1) + 1, 1);
let img2 = matchingImages.splice(Math.floor(Math.random() * matchingImages.length - 1) + 1, 1);

let bestImg = null;
let img3 = null;

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isPhase2, setIsPhase2] = useState(false);
    const [, setIsModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedImage, setSelectedImage] = useState(Object.keys(images)[0]);
    const [imageScores, setImageScores] = useState({});
    const [image1, setImage1] = useState(img1);
    const [image2, setImage2] = useState(img2);
    const [image3, setImage3] = useState(img3);

    const [rating1, setRating1] = useState(false);
    const [rating2, setRating2] = useState(false);
    const [rating3, setRating3] = useState(false);
    const [rating4, setRating4] = useState(false);
    const [selectedRating, setSelectedRating] = useState(0);
    const descriptionRatings = ["Immonde", "Très nul", "Super", "Parfait"]

    function handleRating(val, value, select) {
        setSelectedRating(select)
        switch (val) {
            case 1:
                setRating1(value || select >= 1);
                setRating2(select >= 2 && !value)
                setRating3(select >= 3 && !value)
                setRating4(select >= 4 && !value)
                break;
            case 2:
                setRating1(value || select >= 1);
                setRating2(value || select >= 2);
                setRating3(select >= 3 && !value)
                setRating4(select >= 4 && !value)
                break;
            case 3:
                setRating1(value || select >= 1);
                setRating2(value || select >= 2);
                setRating3(value || select >= 3);
                setRating4(select >= 4 && !value)
                break;
            case 4:
                setRating1(value || select >= 1);
                setRating2(value || select >= 2);
                setRating3(value || select >= 3);
                setRating4(value || select >= 4);
                break;
            default:
                break;
        }
    }

    function starRating() {


        return (
            <div>
                <div className="button2-container">
                    <button className="button2"
                            data-rating="1"
                            onClick={() => handleRating(1, false, 1)}
                            onMouseOver={() => handleRating(1, true, selectedRating)}
                            onMouseOut={() => handleRating(1, false, selectedRating)}
                    >
                        <img
                            src={rating1 ? etoilePleine : etoileVide}
                            alt="Étoile 1"
                        />
                    </button>
                    <button className="button2"
                            data-rating="2"
                            onClick={() => handleRating(2, false, 2)}
                            onMouseOver={() => handleRating(2, true, selectedRating)}
                            onMouseOut={() => handleRating(2, false, selectedRating)}
                    >
                        <img
                            src={rating2 ? etoilePleine : etoileVide}
                            alt="Étoile 2"
                        />
                    </button>
                    <button className="button2"
                            data-rating="3"
                            onClick={() => handleRating(3, false, 3)}
                            onMouseOver={() => handleRating(3, true, selectedRating)}
                            onMouseOut={() => handleRating(3, false, selectedRating)}
                    >
                        <img
                            src={rating3 ? etoilePleine : etoileVide}
                            alt="Étoile 3"
                        />
                    </button>
                    <button className="button2"
                            data-rating="4"
                            onClick={() => handleRating(4, false, 4)}
                            onMouseOver={() => handleRating(4, true, selectedRating)}
                            onMouseOut={() => handleRating(4, false, selectedRating)}
                    >
                        <img
                            src={rating4 ? etoilePleine : etoileVide}
                            alt="Étoile 4"
                        />
                    </button>
                </div>
                <button
                    className="button"
                    onClick={() => handleSwapImage2()}>{selectedRating === 0 ? "Indiquez une note" : descriptionRatings[selectedRating - 1]}</button>
            </div>

        );
    }

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
        if (matchingImages.length === 0) {
            //On récupère la meilleure image.
            bestImg = numeroImage === 1 ? img1 : img2;

            for (let i = 0; i < matchingImages2.length; ++i) {
                //On enlève la meilleure image de la liste des images à noter.
                if (matchingImages2[i] === bestImg) {
                    matchingImages2.splice(i, 1);
                }

                //On enlève l'image originale de la liste des images à noter.
                if (matchingImages2[i] === img0) {
                    matchingImages2.splice(i, 1);
                }
            }

            //On flush les images à noter.
            img3 = matchingImages2.splice(Math.floor(Math.random() * matchingImages.length - 1) + 1, 1);
            setImage3(img3);

            setIsPhase2(true);
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

    function handleSwapImage2() {
        img3 = matchingImages2.splice(Math.floor(Math.random() * matchingImages.length - 1) + 1, 1);
        setImage3(img3);
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
                                                <img src={images[image3]} alt=""/>
                                            </TransformComponent>
                                        </TransformWrapper>
                                        {starRating()}
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

