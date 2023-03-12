import React, {useContext, useEffect, useState} from "react";
import {TransformComponent, TransformWrapper} from "react-zoom-pan-pinch";

import "./Image.css";
import {SelectedImageContext} from "../Menu/Menu";

import img1
    from "../../assets/pages/barb_0001-4133_1919_num_5_1_T1_0021_0000/barb_0001-4133_1919_num_5_1_T1_0021_0000_original.png";
import img2
    from "../../assets/pages/barb_0001-4133_1919_num_5_1_T1_0613_0000/barb_0001-4133_1919_num_5_1_T1_0613_0000_original.png";
import img3
    from "../../assets/pages/barb_0001-4133_1920_num_6_1_T1_0012_0000/barb_0001-4133_1920_num_6_1_T1_0012_0000_original.png";


const images = {
    "barb_0001-4133_1919_num_5_1_T1_0021_0000": img1,
    "barb_0001-4133_1919_num_5_1_T1_0613_0000": img2,
    "barb_0001-4133_1920_num_6_1_T1_0012_0000": img3,
};

export default function Image() {
    const selectedImage = useContext(SelectedImageContext);
    const [imageSrc, setImageSrc] = useState("");

    console.log(selectedImage)

    useEffect(() => {
        setImageSrc(selectedImage);
        console.log("Image changed to " + selectedImage);
    }, [selectedImage]);

    return (
        <div>
            <TransformWrapper defaultScale={1} defaultPositionX={1} defaultPositionY={1}>
                <TransformComponent>
                    <img src={images[imageSrc]} alt=""/>
                </TransformComponent>
            </TransformWrapper>
        </div>
    );
}