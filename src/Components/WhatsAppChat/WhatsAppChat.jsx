import { useEffect, useState } from "react";
import axios from "axios";

export default function WhatsAppChat({ userNumber }) {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    // Fetch chat history for the user
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get(`https://whatsapp-chat-server.vercel.app/chats/${userNumber}`);
        console.log(response.data.messages);

        setChatHistory(response.data.messages);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    fetchChatHistory();
  }, [userNumber]);

  const sendMessage = async () => {
    setIsSending(true);
    try {
      await axios.post("https://whatsapp-chat-server.vercel.app/send-whatsapp", {
        recipientNumber: userNumber,
        message,
      });
      // Update chat history locally
      setChatHistory([...chatHistory, { sender: "admin", text: message }]);
      setMessage("");
    } catch (error) {
      console.error("Failed to send message", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Chat with {userNumber}</h2>
      <div className="chat-history space-y-2 mb-4">
        {chatHistory.map((chat, index) => (
          <div key={index} className={`message ${chat.sender === "admin" ? "bg-blue-100" : "bg-gray-100"} p-2 rounded-lg`}>
            <strong>{chat.sender === "admin" ? "You" : "User"}:</strong> {chat.text}
          </div>
        ))}
      </div>
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type your message..." rows="4" className="w-full p-2 border border-gray-300 rounded-lg" />
      <button onClick={sendMessage} disabled={isSending || !message} className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 ease-in-out">
        {isSending ? "Sending..." : "Send Message"}
      </button>
    </div>
  );
}
