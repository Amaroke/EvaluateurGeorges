import {createContext, useState} from "react";
import "./Menu.css";

const imageNames = [
    "barb_0001-4133_1919_num_5_1_T1_0021_0000",
    "barb_0001-4133_1919_num_5_1_T1_0613_0000",
    "barb_0001-4133_1920_num_6_1_T1_0012_0000"];

export const SelectedImageContext = createContext(imageNames[0]);

export default function Menu() {
    const [selectedImage, setSelectedImage] = useState(imageNames[0]);

    function handleSelectChange(event) {
        setSelectedImage(event.target.value);
    }

    return (
        <SelectedImageContext.Provider value={selectedImage}>
            <div className="menu">
                {"Page sélectionnée : "}
                <select value={selectedImage} onChange={handleSelectChange}>
                    {imageNames.map((imageName) => (
                        <option key={imageName} value={imageName}>{imageName}</option>
                    ))}
                </select>
            </div>
        </SelectedImageContext.Provider>
    );
}