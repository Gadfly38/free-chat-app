import api from "@/api/axios";

const register = async (userData) => {
  const response = await api.post("/auth/signup", userData);
  console.log("response----------", response);
  return response.data;
};

const login = async (userData) => {
  const response = await api.post("/auth/signin", userData);
  if (response.data) {
    console.log("dfdsfsfs", response.data);
    localStorage.setItem("token", JSON.stringify(response.data.accessToken));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem("user");
};

const authService = {
  register,
  login,
  logout,
};

export default authService;
