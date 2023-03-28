import React, {useState} from "react";

// Import des images des étoiles
const etoilePleine = require(`../assets/stars/etoile_pleine.png`);
const etoileVide = require(`../assets/stars/etoile_vide.png`);

export default function RatingElement() {

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
                className="button">{selectedRating === 0 ? "Indiquez une note" : descriptionRatings[selectedRating - 1]}</button>
        </div>

    );
}