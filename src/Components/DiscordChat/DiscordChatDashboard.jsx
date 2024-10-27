import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { RiHashtag, RiSendPlane2Line, RiAddLine, RiQuestionLine } from "react-icons/ri";
import adminPic from "../../assets/logo.png";

const socket = io("http://localhost:3001"); // Connect to the backend

const DiscordChatDashboard = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const chatEndRef = useRef(null);
  useEffect(() => {
    socket.emit("getAllUsers");

    socket.on("allUsers", (users) => {
      setUsers(users);
      setFilteredUsers(users);
    });

    socket.on("chatHistory", (data) => {
      setChatHistory(data.messages);
    });

    socket.on("newMessage", (newMessage) => {
      if (newMessage.userId === selectedUser?.userId) {
        setChatHistory((prev) => [...prev, newMessage]);
      }
    });
    socket.on("updateChat", (newMessage) => {
      if (newMessage?.userId === selectedUser?.userId) {
        setChatHistory((prev) => [...prev, newMessage]);
      }
    });

    return () => {
      socket.off("allUsers");
      socket.off("chatHistory");
      socket.off("newMessage");
      socket.off("updateChat");
    };
  }, [selectedUser]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  useEffect(() => {
    const filtered = users.filter((user) => user.userName.toLowerCase().includes(searchQuery.toLowerCase()));
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const selectUser = (user) => {
    setSelectedUser(user);
    socket.emit("getUserChatHistory", user.userId);
  };

  const sendReply = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("sendReply", { userId: selectedUser?.userId, content: message });
      setMessage("");
    }
  };

  return (
    <div className="flex h-screen bg-[#36393f] text-[#dcddde]">
      {/* User List */}
      <div className="w-60 bg-[#2f3136] flex flex-col">
        <div className="p-4 shadow-md">
          <input type="text" placeholder="Find or start a conversation" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-[#202225] text-[#dcddde] placeholder-[#72767d] rounded py-1 px-2 text-sm" />
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredUsers.map((user) => (
            <button key={user.userId} onClick={() => selectUser(user)} className={`w-full text-left p-2 hover:bg-[#393c43] flex items-center space-x-3 ${selectedUser?.userId === user.userId ? "bg-[#393c43]" : ""}`}>
              <img src={user?.userAvatar} alt={`${user?.userName}'s avatar`} className="w-8 h-8 rounded-full" />
              <span className="truncate text-[#8e9297] hover:text-[#dcddde]">{user?.userName}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <div className="bg-[#36393f] p-4 shadow-md flex items-center space-x-2">
              <RiHashtag className="h-6 w-6 text-[#72767d]" />
              <span className="font-bold text-white">{selectedUser?.userName}</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatHistory?.map((msg) => (
                <div key={msg._id} className="flex items-start space-x-2">
                  <img src={msg.sender === "admin" ? adminPic : selectedUser.userAvatar} alt={`${msg.sender === "admin" ? "Admin" : selectedUser.userName}'s avatar`} className="w-10 h-10 rounded-full mt-1" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-white">{msg.sender === "admin" ? "Admin" : selectedUser.userName}</span>
                      <span className="text-xs text-[#72767d]">{msg?.timestamp}</span>
                    </div>
                    <p className="text-[#dcddde]">{msg.content}</p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={sendReply} className="p-4 bg-[#36393f]">
              <div className="flex items-center space-x-2 bg-[#40444b] rounded-lg p-2">
                <button type="button" className="text-[#b9bbbe] hover:text-[#dcddde]">
                  <RiAddLine size={24} />
                </button>
                <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder={`Message @${selectedUser.userName}`} className="flex-1 bg-transparent text-[#dcddde] placeholder-[#72767d] focus:outline-none" />
                <button type="submit" disabled={!message.trim()} className="text-[#b9bbbe] hover:text-[#dcddde] disabled:opacity-50">
                  <RiSendPlane2Line size={24} />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-[#72767d]">
            <div className="text-center">
              <RiQuestionLine size={48} className="mx-auto mb-4" />
              <p className="text-2xl font-bold">Select a user to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscordChatDashboard;
