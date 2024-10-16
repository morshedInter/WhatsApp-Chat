import axios from "axios";

const useAxiosSecure = () => {
  const axiosSecure = axios.create({
    baseURL: "https://whatsapp-chat-server.vercel.app",
  });
  return axiosSecure;
};

export default useAxiosSecure;
