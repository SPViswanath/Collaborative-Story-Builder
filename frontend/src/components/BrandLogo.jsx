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

  <span className=" text-[#000000] font-[Agbalumo] tracking-wide">
  StoryBuilder
</span>

</div>

  );
}

export default BrandLogo;
