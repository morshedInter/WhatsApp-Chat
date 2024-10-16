import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

const useGetChatMessage = (userNumber) => {
  const axiosSecure = useAxiosSecure();

  return useQuery({
    queryKey: ["chats", userNumber],
    queryFn: async () => {
      const response = await axiosSecure.get(`/chats/${userNumber}`);
      return response.data;
    },
    enabled: !!userNumber, // Only fetch if userNumber is not null
  });
};

export default useGetChatMessage;
