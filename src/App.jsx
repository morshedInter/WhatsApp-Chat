import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import DiscordChatDashboard from "./Components/DiscordChat/DiscordChatDashboard";
import WhatsAppChat from "./Components/WhatsAppChat/WhatsAppChat";

const queryClient = new QueryClient();
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      {/* <DiscordChatDashboard /> */}
      <WhatsAppChat />
    </QueryClientProvider>
  );
};

export default App;
