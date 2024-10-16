import { useState, useEffect } from "react";
import axios from "axios";
import WhatsAppChat from "./WhatsAppChat";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  console.log(users);

  useEffect(() => {
    // Fetch list of users with chats
    const fetchUsers = async () => {
      try {
        const response = await axios.get("https://whatsapp-chat-server.vercel.app/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="max-w-lg mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">User Chats</h1>
      <ul className="mb-6">
        {users?.map((user, index) => (
          <li key={index} className="mb-2 cursor-pointer bg-gray-100 hover:bg-gray-200 p-2 rounded-md" onClick={() => setSelectedUser(user?.user)}>
            {user?.user}
          </li>
        ))}
      </ul>
      {selectedUser && <WhatsAppChat userNumber={selectedUser} />}
    </div>
  );
}
