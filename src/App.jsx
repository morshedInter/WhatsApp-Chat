import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DiscordChatDashboard from "./Components/Test/DiscordChatDashboard";

const queryClient = new QueryClient();
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <DiscordChatDashboard />
    </QueryClientProvider>
  );
};

export default App;
