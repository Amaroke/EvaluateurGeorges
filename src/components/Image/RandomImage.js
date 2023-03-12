/*
import React, {useEffect, useState} from "react";

export default function RandomImage() {
    const [imageSrc, setImageSrc] = useState('');

    useEffect(() => {
        const getImage = async () => {
            const images = await importAll(require.context('../../assets/pages', false, /\.(png|jpe?g|svg)$/));
            //TODO Trier les images selon leurs méthodes de nettoyages respectives.
            const randomIndex = Math.floor(Math.random() * images.length);
            setImageSrc(images[randomIndex]);
        };
        getImage();
    }, []);

    const importAll = (r) => {
        return r.keys().map(r);
    };

    return (
        <img src={imageSrc} alt="photo_page"/>
    );
}
*/

