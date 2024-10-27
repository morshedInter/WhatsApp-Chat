import axios from "axios";

const useAxiosSecure = () => {
  const axiosSecure = axios.create({
    baseURL: "https://whatsapp-chat-server.vercel.app",
    // baseURL: "http://localhost:3000",
  });
  return axiosSecure;
};

export default useAxiosSecure;
