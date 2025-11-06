import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

function TemaBoton() {
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem("tema") === "dark");;

    useEffect(() => {
        if(darkMode){
            document.body.classList.add("dark-mode")
            localStorage.setItem("tema", "dark")
        } else {
            document.body.classList.remove("dark-mode")
            localStorage.setItem("tema","light")
        }
    }, [darkMode])

    return (
        <button className="tema-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <Sun size={20}/> : <Moon size={20}/>}
        </button>
    )
}

export default TemaBoton