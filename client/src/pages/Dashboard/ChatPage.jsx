import React, { useEffect, useState } from "react";
import { Send } from "lucide-react";
import human from "@/assets/human.svg";
import bot from "@/assets/bot.svg";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import api from "@/api/axios";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await api.get("/chat/get_chat_history");
        console.log("Chat-History:", response.data.chatHistory);
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
      }
    };

    fetchChatHistory();
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: input,
      type: "user",
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      // Make API call
      const response = await api.post("/chat", {
        query: input,
      });

      // Add bot response
      const botMessage = {
        id: Date.now() + 1,
        text: response.data.responseText,
        type: "bot",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      // Handle error
      const errorMessage = {
        id: Date.now() + 1,
        text:
          error.response?.data?.message ||
          "Sorry, I couldn't process your request.",
        type: "bot",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }

    // Simulate bot response
    // const botMessage = {
    //   id: Date.now() + 1,
    //   text: "Hello! You seem to have missed providing a context. How may I assist you today?",
    //   type: "bot",
    // };
    setMessages((prev) => [...prev, botMessage]);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 mt-40 text-center">
      <h1 className="text-4xl font-bold mb-2">Document Chat</h1>
      <p className="text-gray-600 mb-8 mt-12">
        Have an intelligent conversation about your documents. Ask questions and
        get instant insights.
      </p>

      {/* Chat Messages */}
      <div className="min-h-[600px] mb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 flex ${
              message.type === "user" ? "" : "justify-start"
            }`}
          >
            <div className="flex items-start gap-2 w-full bg-gray-100 p-4 rounded-xl">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-white 
                ${message.type === "user" ? "bg-red-400" : "bg-yellow-400"}`}
              >
                {message.type === "user" ? (
                  <img src={human} alt="chat" className="w-4 h-4 " />
                ) : (
                  <img src={bot} alt="chat" className="w-4 h-4" />
                )}
              </div>
              <div
                className={`p-3 rounded-lg ${
                  message.type === "user" ? "bg-gray-100" : "bg-blue-50"
                }`}
              >
                {message.text}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about your documents..."
          className="w-full p-4 pr-12 bg-gray-50 rounded-lg focus:outline-none"
        />
        <button
          type="submit"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default ChatPage;
