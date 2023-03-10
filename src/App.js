import './App.css';
import Button from "./components/Button/Button";

function App() {
    return (
        <div>
            <header>
                <select>
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                    <option value="option3">Option 3</option>
                </select>
            </header>
            <main>
                <div>
                    <img src="image1.jpg" alt="Image 1" />
                    <button>Button 1</button>
                </div>
                <div>
                    <img src="image2.jpg" alt="Image 2" />
                    <button>Button 2</button>
                </div>
            </main>
        </div>
    );
}

export default App;
