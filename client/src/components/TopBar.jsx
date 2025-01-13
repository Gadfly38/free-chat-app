import { useNavigate } from "react-router-dom";

const TopBar = () => {
  const navigate = useNavigate();

  return (
    <div className="flex shadow">
      <div className="flex max-w-[1280px] mx-auto w-full bg-white  p-4 justify-between items-center">
        <div className="text-3xl font-bold cursor-pointer font-playwrite">
          Execos
        </div>
        <button
          className="font-medium cursor-pointer"
          onClick={() => navigate("/app/auth/signIn")}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default TopBar;
