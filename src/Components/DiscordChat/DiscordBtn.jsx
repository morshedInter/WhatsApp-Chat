const DiscordBtn = () => {
  const handleChat = () => {
    window.open("https://discord.com/oauth2/authorize?client_id=1297845727342497823&scope=bot&permissions=3072", "_blank");
  };

  return (
    <button onClick={handleChat} className="bg-[#ff0000] text-white px-4 py-2 rounded">
      Chat with Discord Bot
    </button>
  );
};

export default DiscordBtn;
