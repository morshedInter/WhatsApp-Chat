import { useEffect, useState } from "react";
import io from "socket.io-client";
import DiscordBtn from "./DiscordBtn";

const socket = io("http://localhost:3001");

const AdminChatDashboard = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (selectedChat) {
      const chatArea = document.getElementById("chatArea");
      if (chatArea) {
        chatArea.scrollTop = chatArea.scrollHeight;
      }
    }
  }, [selectedChat]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to the server", socket.id);
    });
    // Listen for new messages from the bot
    socket.on("newMessage", (newMessage) => {
      console.log("New message received: ", newMessage);
      setChats((prevChats) => {
        const existingChat = prevChats.find((chat) => chat.userId === newMessage.userId);
        if (existingChat) {
          existingChat.messages.push({ sender: "user", content: newMessage.content });
          return [...prevChats];
        } else {
          return [...prevChats, { userId: newMessage.userId, userName: newMessage.userName, messages: [{ sender: "user", content: newMessage.content }] }];
        }
      });
    });

    // Handle socket disconnections
    socket.on("disconnect", () => {
      console.error("Disconnected from the server");
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    return () => {
      socket.off("newMessage");
      socket.off("disconnect");
      socket.off("connect_error");
    };
  }, []);

  const handleReply = () => {
    if (message.trim() && selectedChat) {
      // Emit the reply to the server
      socket.emit("sendReply", { userId: selectedChat.userId, content: message }, (confirmation) => {
        if (confirmation.success) {
          // Update the chat only after receiving confirmation
          setSelectedChat((prevChat) => {
            prevChat.messages.push({ sender: "admin", content: message });
            return { ...prevChat };
          });
          setMessage("");
        } else {
          console.error("Failed to send the message.");
        }
      });
    }
  };

  return (
    <div className="p-4">
      <DiscordBtn />
      <div className="flex">
        {/* User List */}
        <div className="w-1/4">
          <h3 className="text-lg font-semibold mb-2">User Chats</h3>
          <ul className="space-y-2">
            {chats.map((chat) => (
              <li key={chat.userId} className={`p-2 cursor-pointer ${selectedChat && selectedChat.userId === chat.userId ? "bg-blue-100" : "bg-gray-100"}`} onClick={() => setSelectedChat(chat)}>
                {chat.userName}
              </li>
            ))}
          </ul>
        </div>

        {/* Chat Area */}
        <div className="w-3/4">
          {selectedChat ? (
            <>
              <h3 className="text-lg font-semibold mb-2">Chat with {selectedChat.userName}</h3>
              <div id="chatArea" className="border p-4 h-64 overflow-y-auto">
                {selectedChat.messages.map((msg, idx) => (
                  <p key={idx} className={msg.sender === "admin" ? "text-right" : "text-left"}>
                    <strong>{msg.sender}:</strong> {msg.content}
                  </p>
                ))}
              </div>
              <div className="mt-4">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="border px-2 py-1 w-full"
                  disabled={!selectedChat} // Disable input if no chat selected
                />
                <button
                  onClick={handleReply}
                  className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
                  disabled={!message.trim() || !selectedChat} // Disable button if no message or no chat selected
                >
                  Send Reply
                </button>
              </div>
            </>
          ) : (
            <p>Select a user to start chatting</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminChatDashboard;
