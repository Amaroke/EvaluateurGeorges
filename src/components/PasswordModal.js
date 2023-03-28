import React, {useState} from "react";

// Gère l'affichage du modal de saisie du mot de passe
export default function PasswordModal({setPassword, errorMessage}) {
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