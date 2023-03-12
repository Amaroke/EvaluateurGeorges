import './App.css';
import Button from "./components/Button/Button";
import Image from "./components/Image/Image";
import Menu from "./components/Menu/Menu";

function App() {
    return (
        <div>
            <header>
                <Menu/>
            </header>
            <main>
                <div className="image">
                    <Image/>
                    <Button/>
                </div>
                <div className="image">
                    <Image/>
                    <Button/>
                </div>
            </main>
        </div>
    );
}

export default App;
