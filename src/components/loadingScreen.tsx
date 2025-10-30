import {useState, useEffect} from "react";
import { ClipLoader } from "react-spinners";

function LoadingScreen(){
    const  [ loading, setLoading] = useState(false);

    useEffect(()=>{
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 8000)
    }, [])

return (
    <div className="loadingScreen">
        <ClipLoader
            loading={loading}
            size={100}
            color="#36d7b7"
        />
    </div>
)
}
export default LoadingScreen;