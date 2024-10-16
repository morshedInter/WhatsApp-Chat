import { useState } from "react";
import { FaDiscord, FaComments } from "react-icons/fa";
import SlackIcon from "../Constants/SlackIcon";
import { WhatsAppWidget } from "react-whatsapp-widget";
import "react-whatsapp-widget/dist/index.css";

const ChatWidget = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-20 right-6">
      <div className="relative">
        <button className={`absolute transform transition-all duration-300 ease-in-out ${isExpanded ? "scale-75 -translate-y-0 -translate-x-0" : "scale-0 translate-y-0 translate-x-0"}`} aria-label="WhatsApp">
          <WhatsAppWidget phoneNumber="+15551772121" />
        </button>
        <button className={`absolute transform transition-all duration-300 ease-in-out ${isExpanded ? "scale-90 -translate-y-16" : "scale-0 translate-y-0"} bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl`} aria-label="Discord">
          <FaDiscord className="w-6 h-6" />
        </button>
        <button className={`absolute transform transition-all duration-300 ease-in-out ${isExpanded ? "scale-90 -translate-x-16" : "scale-0 translate-x-0"} bg-gray-800 hover:bg-gray-700 p-3 rounded-full shadow-lg hover:shadow-xl`} aria-label="Slack">
          <SlackIcon />
        </button>
        <button onClick={() => setIsExpanded(!isExpanded)} className="bg-[#ff0000] hover:bg-red-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out" aria-expanded={isExpanded} aria-label="Toggle chat options">
          <FaComments className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default ChatWidget;
