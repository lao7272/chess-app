
import { useNavigate } from 'react-router-dom'

export default function ReturnHome() {
    const navigate = useNavigate();
return (
    <button className='return-home home-link' onClick={() => navigate("/")}>
        Home
    </button>
)
}
