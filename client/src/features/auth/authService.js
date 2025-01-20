import api from "@/api/axios";

const register = async (userData) => {
  const response = await api.post("/auth/signup", userData);
  return response.data;
};

const login = async (userData) => {
  const response = await api.post("/auth/signin", userData);
  if (response.data) {
    localStorage.setItem("token", response.data.accessToken);
  }
  return response.data;
};

const googleLogin = async (payload) => {
  const response = await api.post("/auth/google", payload);
  return response.data;
};

const authService = {
  register,
  login,
  googleLogin,
};

export default authService;
