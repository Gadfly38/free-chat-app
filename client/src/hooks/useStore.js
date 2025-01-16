import { useSelector } from "react-redux";

export const useStore = () => {
  const user = useSelector((state) => state.auth);
  return user;
};
