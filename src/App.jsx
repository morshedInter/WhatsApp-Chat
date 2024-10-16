import AdminChatDashboard from "./Components/AdminChatDashboard/AdminChatDashboard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ChatWidget from "./Components/ChatWidget/ChatWidget";
import { WhatsAppWidget } from "react-whatsapp-widget";

const queryClient = new QueryClient();
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ChatWidget />
      <AdminChatDashboard />
      {/* <WhatsAppWidget phoneNumber="XXXXXXXXXX" /> */}
    </QueryClientProvider>
  );
};

export default App;
