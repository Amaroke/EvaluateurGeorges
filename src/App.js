import React, {useState, useEffect, useRef} from 'react';
import Cookies from 'js-cookie';
import {TransformComponent, TransformWrapper} from "react-zoom-pan-pinch";
import PasswordModal from "./components/PasswordModal";
import './App.css';

// Liste de tous les noms des images utilisées
const listeNomsImages = [
    "barb_0001-4133_1919_num_5_1_T1_0021_0000",
    "barb_0001-4133_1919_num_5_1_T1_0613_0000",
    "barb_0001-4133_1920_num_6_1_T1_0012_0000",
    "barb_0001-4133_1920_num_6_1_T1_0296_0000",
    "barb_0001-4133_1929_num_15_1_T1_0235_0000",
    "barb_0001-4133_1939_num_25_1_T1_0321_0000",
    "barb_0001-4133_1941_num_27_1_T1_0022_0000",
    "barb_0001-4133_1963_num_49_1_T1_0135_0000",
    "barb_0001-4141_1907_num_9_1_T1_0675_0000",
    "rnord_0035-2624_1934_num_20_78_T1_0117_0000",
    "rnord_0035-2624_1952_num_34_133_T1_0080_0000",
    "barb_0001-4133_1919_num_5_1_T1_0005_0000",
    "barb_0001-4133_1919_num_5_1_T1_0006_0000",
    "barb_0001-4141_1910_num_12_1_F_0001_0000",
    "barb_0001-4141_1910_num_12_1_F_0002_0000",
    "barb_0001-4141_1910_num_12_1_T1_0017_0000",
    "barb_0001-4141_1919_num_5_1_T1_0007_0000",
    "rnord_0035-2624_1927_num_13_51_T1_0172_0000",
    "rnord_0035-2624_1927_num_13_51_T1_0180_0001",
    "rnord_0035-2624_1928_num_14_53_T1_0023_0000"
];

// Import des images des étoiles
const etoilePleine = require(`./assets/stars/etoile_pleine.png`);
const etoileVide = require(`./assets/stars/etoile_vide.png`);

// Création d'un objet contenant toutes les images
const images = {};
for (let name of listeNomsImages) {
    images[name] = require(`./assets/pages/Origine/${name}.png`);
    images[`${name}_approximation1x1`] = require(`./assets/pages/Approximation1x1/${name}.png`);
    images[`${name}_approximation2x3`] = require(`./assets/pages/Approximation2x3/${name}.png`);
    images[`${name}_extrapolation1x1`] = require(`./assets/pages/Extrapolation1x1/${name}.png`);
    images[`${name}_extrapolation2x3`] = require(`./assets/pages/Extrapolation2x3/${name}.png`);
    images[`${name}_interpolation1x1`] = require(`./assets/pages/Interpolation1x1/${name}.png`);
}

let pageActuelle = 0;
let nomImagePageActuelle = listeNomsImages[pageActuelle]

let nomsImagePageActuelle = [];
let nomsImagePageActuellePhase2 = [];

for (let nom in images) {
    if (nom.includes(nomImagePageActuelle)) {
        nomsImagePageActuelle.push(nom);
        nomsImagePageActuellePhase2.push(nom);
    }
}

// Image d'origine de la phase 1
let imageOrigine = nomsImagePageActuelle.splice(0, 1)
// Images affichées lors de la phase 1
let img1 = nomsImagePageActuelle.splice(Math.floor(Math.random() * nomsImagePageActuelle.length - 1) + 1, 1);
let img2 = nomsImagePageActuelle.splice(Math.floor(Math.random() * nomsImagePageActuelle.length - 1) + 1, 1);

// Images affichées lors de la phase 2
let img3 = null;
let meilleureImage = null;

// Variable qui gère les notes données aux images
let scoresImages = [];

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [, setIsModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [selectedImage, setSelectedImage] = useState(Object.keys(images)[0]);

    const [image0, setImage0] = useState(imageOrigine);
    const [image1, setImage1] = useState(img1);
    const [image2, setImage2] = useState(img2);
    const [image3, setImage3] = useState(img3);

    const [rating1, setRating1] = useState(false);
    const [rating2, setRating2] = useState(false);
    const [rating3, setRating3] = useState(false);
    const [rating4, setRating4] = useState(false);
    const [selectedRating, setSelectedRating] = useState(0);
    const descriptionRatings = ["Très Mauvaise", "Mauvaise", "Bien", "Parfait"]

    const [isPhase2, setIsPhase2] = useState(false);

    const wrapperRef0 = useRef(null);
    const wrapperRef1 = useRef(null);
    const wrapperRef2 = useRef(null);

    // Fonction qui check si le password fourni est correct et qui agit en conséquence
    function handlePasswordSubmit(submittedPassword) {
        if (submittedPassword === 'IopetiMathieuYvoz') {
            Cookies.set('password', submittedPassword, {expires: 1});
            setIsLoggedIn(true);
            setIsModalOpen(false);
        } else {
            setErrorMessage('Mot de passe incorrect.');
        }
    }

    useEffect(() => {
        const password = Cookies.get('password');
        if (password) {
            setIsLoggedIn(true);
        }
    }, []);

    // Fonction qui ferme la fenêtre modale
    function handleCloseModal() {
        setIsModalOpen(false);
    }

    // Fonction qui ouvre la fenêtre modale
    function handleOpenModal() {
        setIsModalOpen(true);
    }

    // Fonction qui permet de gérer l'affichage des images lors de la phase 1
    function imageSuivantePhase1(numeroImage) {
        // Si il n'y a plus d'images à afficher
        if (nomsImagePageActuelle.length === 0) {
            // On récupère la meilleure image.
            meilleureImage = numeroImage === 1 ? img1[0] : img2[0];

            for (let i = 0; i < nomsImagePageActuellePhase2.length; ++i) {
                 // On enlève l'image originale de la liste des images à noter.
                if (nomsImagePageActuellePhase2[i] === imageOrigine[0]) {
                    nomsImagePageActuellePhase2.splice(i, 1);
                }
            }

            // On mélange les images à noter
            img3 = nomsImagePageActuellePhase2.splice(Math.floor(Math.random() * nomsImagePageActuelle.length - 1) + 1, 1);
            setImage3(img3);

            //On passe à la phase 2
            setIsPhase2(true);
        } else {
            // Si on choisit l'image 2 on enlève la 1 et inversement
            if (numeroImage === 2) {
                img1 = nomsImagePageActuelle.splice(Math.floor(Math.random() * nomsImagePageActuelle.length - 1) + 1, 1);
            } else {
                img2 = nomsImagePageActuelle.splice(Math.floor(Math.random() * nomsImagePageActuelle.length - 1) + 1, 1);
            }
            setImage1(img1);
            setImage2(img2);
        }
    }

    // Fonction qui permet d'afficher toutes les images à noter dans la phase 2 de manière aléatoire.
    function imageSuivantePhase2() {
        if (selectedRating !== 0) {
            //Si c'est la meilleur image, on l'indique dans la position stockée dans le csv
            let position;
            position = meilleureImage !== img3[0] ? "": "Meilleure";

            let obj = {
                name: img3[0],
                rating: selectedRating,
                position: position
            };
            scoresImages.push(obj);

            if (nomsImagePageActuellePhase2.length === 0) {
                pageActuelle++
                nomImagePageActuelle = listeNomsImages[pageActuelle]
                setSelectedImage(listeNomsImages[pageActuelle]);

                nomsImagePageActuelle = [];
                nomsImagePageActuellePhase2 = [];

                for (let key in images) {
                    if (key.includes(nomImagePageActuelle)) {
                        nomsImagePageActuelle.push(key);
                        nomsImagePageActuellePhase2.push(key);
                    }
                }

                imageOrigine = nomsImagePageActuelle.splice(0, 1)
                img1 = nomsImagePageActuelle.splice(Math.floor(Math.random() * nomsImagePageActuelle.length - 1) + 1, 1);
                img2 = nomsImagePageActuelle.splice(Math.floor(Math.random() * nomsImagePageActuelle.length - 1) + 1, 1);

                meilleureImage = null;
                img3 = null;

                setImage1(img1);
                setImage2(img2);
                setImage3(img3);
                setImage0(imageOrigine);

                setIsPhase2(false);
            } else {
                img3 = nomsImagePageActuellePhase2.splice(Math.floor(Math.random() * nomsImagePageActuelle.length - 1) + 1, 1);
                setImage3(img3);
            }
        }
    }

    // Fonction qui gère la notation d'une image
    function handleNotation(imageNotee, note, noteSelectionnee) {
        // On fixe la note de l'image
        setSelectedRating(noteSelectionnee)

        // Affichage des étoiles (et effet de selection)
        switch (imageNotee) {
            case 1:
                setRating1(note || noteSelectionnee >= 1);
                setRating2(noteSelectionnee >= 2 && !note)
                setRating3(noteSelectionnee >= 3 && !note)
                setRating4(noteSelectionnee >= 4 && !note)
                break;
            case 2:
                setRating1(note || noteSelectionnee >= 1);
                setRating2(note || noteSelectionnee >= 2);
                setRating3(noteSelectionnee >= 3 && !note)
                setRating4(noteSelectionnee >= 4 && !note)
                break;
            case 3:
                setRating1(note || noteSelectionnee >= 1);
                setRating2(note || noteSelectionnee >= 2);
                setRating3(note || noteSelectionnee >= 3);
                setRating4(noteSelectionnee >= 4 && !note)
                break;
            case 4:
                setRating1(note || noteSelectionnee >= 1);
                setRating2(note || noteSelectionnee >= 2);
                setRating3(note || noteSelectionnee >= 3);
                setRating4(note || noteSelectionnee >= 4);
                break;
            default:
                break;
        }
    }

    // Fonction permettant d'exporter les données générées par le site dans un fichier au format CSV.
    function handleExport() {
        // Nécessaire pour rendre le fichier trouvable.
        let content = "data:text/csv;charset=utf-8,";

        // On ajoute les noms ainsi que les scores associés au fichier CSV.
        for (let i = 0; i < scoresImages.length; ++i) {
            content += `${scoresImages[i].name}, ${scoresImages[i].rating}, ${scoresImages[i].position}\n`;
        }

        // Création d'un lien de téléchargement pour le fichier CSV.
        const encodedUri = encodeURI(content);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "indiquez_votre_nom_d_evaluateur.csv");

        // Ajout du lien à la page.
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

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
                                    {(pageActuelle >= listeNomsImages.length) ? "Évaluation terminée, veuillez sauvegarder !" : ("Page sélectionnée (" + (pageActuelle + 1) + "/" + listeNomsImages.length + ") : ")} {selectedImage}
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
                                                <img src={images[image0]} alt=""/>
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
                                        {partieNotation()}
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
                                {(pageActuelle >= listeNomsImages.length) ? "Évaluation terminée, veuillez sauvegarder !" : ("Page sélectionnée (" + (pageActuelle + 1) + "/" + listeNomsImages.length + ") : ")} {selectedImage}
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
                                            <img src={images[image0]} alt=""/>
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
                                            onClick={() => imageSuivantePhase1(1)}> Celle de gauche !
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
                                            onClick={() => imageSuivantePhase1(2)}> Celle de droite !
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

    function partieNotation() {
        return (
            <div>
                <div className="button2-container">
                    <button className="button2"
                            data-rating="1"
                            onClick={() => handleNotation(1, false, 1)}
                            onMouseOver={() => handleNotation(1, true, selectedRating)}
                            onMouseOut={() => handleNotation(1, false, selectedRating)}
                    >
                        <img
                            src={rating1 ? etoilePleine : etoileVide}
                            alt="Étoile 1"
                        />
                    </button>
                    <button className="button2"
                            data-rating="2"
                            onClick={() => handleNotation(2, false, 2)}
                            onMouseOver={() => handleNotation(2, true, selectedRating)}
                            onMouseOut={() => handleNotation(2, false, selectedRating)}
                    >
                        <img
                            src={rating2 ? etoilePleine : etoileVide}
                            alt="Étoile 2"
                        />
                    </button>
                    <button className="button2"
                            data-rating="3"
                            onClick={() => handleNotation(3, false, 3)}
                            onMouseOver={() => handleNotation(3, true, selectedRating)}
                            onMouseOut={() => handleNotation(3, false, selectedRating)}
                    >
                        <img
                            src={rating3 ? etoilePleine : etoileVide}
                            alt="Étoile 3"
                        />
                    </button>
                    <button className="button2"
                            data-rating="4"
                            onClick={() => handleNotation(4, false, 4)}
                            onMouseOver={() => handleNotation(4, true, selectedRating)}
                            onMouseOut={() => handleNotation(4, false, selectedRating)}
                    >
                        <img
                            src={rating4 ? etoilePleine : etoileVide}
                            alt="Étoile 4"
                        />
                    </button>
                </div>
                <button
                    className="button"
                    onClick={() => imageSuivantePhase2()}>{selectedRating === 0 ? "Indiquez une note" : descriptionRatings[selectedRating - 1]}</button>
            </div>

        );
    }
}

