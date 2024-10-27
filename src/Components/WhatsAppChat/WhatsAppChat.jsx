import { useEffect, useRef, useState } from "react";
import { AiOutlineWhatsApp, AiOutlineSend } from "react-icons/ai";
import { FaDiscord, FaSlack } from "react-icons/fa";
import { io } from "socket.io-client";
import { RiQuestionLine } from "react-icons/ri";

const socket = io("http://localhost:3000");

const WhatsAppChat = () => {
  const [activeTab, setActiveTab] = useState("whatsapp");
  const [allUsers, setAllUsers] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const chatEndRef = useRef(null);

  // const { data: users = [], isLoading: loadingUsers } = useFetchUsers();
  // const { data: chatData, refetch } = useGetChatMessage(selectedUser?.user);

  const defaultAvatar = "https://i.ibb.co/F8q9tsx/user2.jpg";

  // socket io

  useEffect(() => {
    socket.emit("getAllUsers");
    socket.on("allUsers", (data) => {
      setAllUsers(data);
    });

    socket.on("chatHistory", (data) => {
      setChatHistory(data);
    });

    socket.on("newMessage", (newMessage) => {
      if (newMessage?.user === selectedUser?.user) {
        setChatHistory((prev) => [...prev, newMessage]);
      }
    });

    socket.on("updateChat", (data) => {
      if (data?.user === selectedUser?.user) {
        setChatHistory((prev) => [...prev, data]);
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

  // Function to select a user
  const selectAUser = (user) => {
    setSelectedUser(user);
    socket.emit("getUserChatHistory", user?.user);
  };
  // Function to send reply to user via whatsApp
  const sendReply = (e) => {
    e.preventDefault();
    console.log("clicked");

    setIsSending(true);
    if (message.trim()) {
      socket.emit(
        "sendReply",
        {
          recipientNumber: selectedUser?.user,
          message,
        },
        (response) => {
          if (response.status === "error") {
            alert(response.message);
            console.error("Failed to send message:", response.message);
          }
          setIsSending(false);
        }
      );
      setMessage("");
    }
  };

  // filter search user
  const filterSearchUsers = allUsers?.filter((user) => {
    return user?.user.toLowerCase().includes(searchUser.toLowerCase());
  });

  // if (loadingUsers) {
  //   return <div>Loading users...</div>;
  // }

  return (
    <div className="h-screen container max-w-screen-xl mx-auto">
      <header className="p-4 rounded-md shadow-md text-center">
        <h1 className="text-2xl font-bold tracking-wide">
          Chat <span className="text-[#ff0000]">Dashboard</span>
        </h1>
      </header>

      <div className="py-4">
        <div className="max-w-md grid grid-cols-3 gap-2 border-b border-gray-200 bg-white shadow-md rounded-md mb-4">
          <button onClick={() => setActiveTab("whatsapp")} className={`p-4 flex items-center gap-2 justify-center font-medium transition-colors rounded-t-lg ${activeTab === "whatsapp" ? "bg-gradient-to-r from-green-500 to-teal-500 text-white" : "hover:bg-gray-100"}`}>
            <AiOutlineWhatsApp className={`w-6 h-6 ${activeTab === "whatsapp" ? "text-white" : "text-[#ff0000]"}`} />
            WhatsApp
          </button>
          <button onClick={() => setActiveTab("discord")} className={`p-4 flex items-center gap-2 justify-center font-medium transition-colors rounded-t-lg ${activeTab === "discord" ? "bg-gradient-to-r from-green-500 to-teal-500 text-white" : "hover:bg-gray-100"}`}>
            <FaDiscord className={`w-6 h-6 ${activeTab === "discord" ? "text-white" : "text-[#ff0000]"}`} />
            Discord
          </button>
          <button onClick={() => setActiveTab("slack")} className={`p-4 flex items-center gap-2 justify-center font-medium transition-colors rounded-t-lg ${activeTab === "slack" ? "bg-gradient-to-r from-green-500 to-teal-500 text-white" : "hover:bg-gray-100"}`}>
            <FaSlack className={`w-6 h-6 ${activeTab === "slack" ? "text-white" : "text-[#ff0000]"}`} />
            Slack
          </button>
        </div>

        {/* WhatsApp Interface */}
        {activeTab === "whatsapp" && (
          <div className="flex h-[calc(100vh-11rem)] overflow-hidden rounded-lg border border-gray-300">
            {/* User list */}
            <div className="w-1/3 border-r border-gray-300 bg-white p-4 rounded-lg">
              <input type="search" placeholder="Search Users" value={searchUser} onChange={(e) => setSearchUser(e.target.value)} className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#ff0000]" />
              <div className="overflow-auto space-y-3">
                {filterSearchUsers?.map((user) => (
                  <button key={user?._id} onClick={() => selectAUser(user)} className={`flex items-center gap-3 px-3 py-2 w-full rounded-lg transition-all hover:bg-gray-100 shadow-sm ${selectedUser?.user === user?.user ? "bg-gray-300" : ""}`}>
                    <img src={defaultAvatar} alt={user?.name} className="h-10 w-10 rounded-full shadow-sm" />
                    <span className="font-semibold text-gray-700">{user?.user}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat section */}
            {selectedUser ? (
              <main className="w-2/3 border-gray-200 bg-white rounded-lg">
                <div className="bg-white px-6 py-3 flex items-center gap-4 shadow-sm border-b border-gray-200">
                  {selectedUser && <img src={selectedUser?.profilePicture || defaultAvatar} alt={"Profile Pic"} className="h-10 w-10 rounded-full shadow" />}
                  <h2 className="font-semibold text-gray-700">{selectedUser?.user}</h2>
                </div>

                {/* Messages */}
                <div className="h-[calc(100vh-20rem)] p-6 overflow-auto space-y-6 bg-gray-100">
                  {chatHistory?.messages?.map((message) => {
                    return (
                      <div key={message._id} className={`flex ${message?.sender === "user" ? "justify-start" : "justify-end"}`}>
                        <div className={`rounded-xl px-4 py-1 shadow-md max-w-[70%] ${message?.sender === "user" ? "bg-gray-300" : "bg-red-500 text-white"}`}>
                          {message.text && <p className="text-sm">{message.text}</p>}
                          {message.mediaUrl && message.mediaType === "image" && <img src={message?.mediaUrl} alt="Media" className="rounded-lg mt-2 max-h-40" />}
                          {message?.mediaUrl && message?.mediaType === "video" && (
                            <video controls className="rounded-lg mt-2 max-h-40">
                              <source src={message?.mediaUrl} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          )}
                          {message?.mediaUrl && message?.mediaType === "audio" && (
                            <audio controls className="rounded-lg mt-2">
                              <source src={message?.mediaUrl} type="audio/mpeg" />
                              Your browser does not support the audio tag.
                            </audio>
                          )}
                          <span className="text-xs opacity-60">{new Date(message.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={chatEndRef} />
                </div>

                {/* Send Message Input */}
                <form onSubmit={sendReply} className="flex gap-4 p-4 border-t border-gray-200">
                  <input type="text" placeholder="Type your message" value={message} onChange={(e) => setMessage(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#ff0000]" />
                  <button type="submit" disabled={isSending || !message.trim()} className="flex items-center gap-2 px-4 py-2 bg-[#ff0000] text-white rounded-lg disabled:bg-gray-300">
                    <AiOutlineSend />
                    Send
                  </button>
                </form>
              </main>
            ) : (
              <div className="flex-1 flex items-center justify-center text-[#72767d]">
                <div className="text-center">
                  <RiQuestionLine size={48} className="mx-auto mb-4" />
                  <p className="text-2xl font-bold">Select a user to start conversation!</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsAppChat;
