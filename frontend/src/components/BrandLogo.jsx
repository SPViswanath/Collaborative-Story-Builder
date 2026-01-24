import Logo from "../assets/StoryBuilder-Logo - Copy.png";
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
    className="text-xl md:text-2xl font-bold tracking-tight text-gray-900"
    style={{ fontFamily: "Montserrat, sans-serif" }}
  >
    Story<span className="text-emerald-700">Builder</span>
  </h1>



</div>

  );
}

export default BrandLogo;
