import Logo from "../assets/symbol.png";
import { useNavigate } from "react-router-dom";
function BrandLogo() {
    const navigate = useNavigate();
  return (
    

<div
  className="flex items-center gap-2 cursor-pointer select-none"
  onClick={() => navigate("/")}
>
  <img
    src={Logo}
    alt="StoryBuilder Logo"
    className="h-10 w-10 object-contain"
  />

  <h1
    className="text-xl md:text-2xl tracking-tight text-gray-900"
    style={{ fontFamily: "Montserrat, sans-serif" }}
  >
    STORY<span className="text-emerald-700">BUILDER</span>
  </h1>



</div>

  );
}

export default BrandLogo;
