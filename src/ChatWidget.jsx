import { useState, useRef, useEffect } from 'react';

const ChatWidget = ({ isOpen, setIsOpen }) => {
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm your WebMD AI Assistant. I can help you with:\n\n• Understanding symptoms\n• Finding information about conditions\n• Learning about medications\n• General health questions\n\nI'll provide information from WebMD's extensive medical database and always cite my sources. How can I help you today?",
      isUser: false
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);
  const chatWindowRef = useRef(null);

  // Generate a unique conversation ID when the chat opens
  useEffect(() => {
    if (isOpen && !conversationId) {
      setConversationId(Date.now().toString());
    }
  }, [isOpen, conversationId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatWindowRef.current && !chatWindowRef.current.contains(event.target) && 
          !event.target.closest('.chat-button')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = inputValue;
    setInputValue('');
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: userMessage,
          conversationId: conversationId
        }),
      });

      const data = await response.json();
      
      // Add the AI response
      setMessages(prev => [...prev, { text: data.response, isUser: false }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        text: "I'm sorry, I'm having trouble connecting to WebMD's database right now. Please try again later.", 
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isOpen ? (
        <div 
          ref={chatWindowRef} 
          className="fixed bottom-0 right-0 w-full sm:w-[400px] h-[calc(100vh-4rem)] sm:h-[calc(100vh-8rem)] bg-white shadow-lg flex flex-col z-50 sm:bottom-4 sm:right-4 sm:rounded-lg"
        >
          <div className="bg-[#00a0d2] text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <img 
                src="https://img.wbmdstatic.com/vim/live/webmd/consumer_assets/site_images/logos/webmd/web/webmd_logo_white.svg" 
                alt="WebMD Logo" 
                className="h-6 w-auto"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://www.webmd.com/img/logo-webmd.png";
                }}
              />
              <h3 className="font-semibold">AI Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  message.isUser ? 'ml-auto' : 'mr-auto'
                } max-w-[90%] sm:max-w-[80%]`}
              >
                <div
                  className={`rounded-lg p-3 ${
                    message.isUser
                      ? 'bg-[#00a0d2] text-white'
                      : 'bg-white text-gray-800 shadow-sm'
                  }`}
                >
                  {message.text.split('\n').map((line, i) => {
                    // Check if the line contains a URL
                    const urlMatch = line.match(/https?:\/\/[^\s]+/);
                    if (urlMatch) {
                      const url = urlMatch[0];
                      const text = line.replace(url, '');
                      return (
                        <p key={i} className={i > 0 ? 'mt-2' : ''}>
                          {text}
                          <a 
                            href={url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`${
                              message.isUser
                                ? 'text-white underline'
                                : 'text-[#00a0d2] hover:underline'
                            } ml-1`}
                          >
                            [Source]
                          </a>
                        </p>
                      );
                    }
                    return <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>;
                  })}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="mb-4 mr-auto max-w-[90%] sm:max-w-[80%]">
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="loading-dots">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask a health question..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00a0d2] focus:border-transparent"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-[#00a0d2] text-white p-2 rounded-lg hover:bg-[#0078a8] transition-colors disabled:opacity-50"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Note: This AI assistant is powered by WebMD's medical database. Always consult with healthcare professionals for medical advice.
            </p>
          </form>
        </div>
      ) : null}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`chat-button fixed bottom-4 right-4 bg-[#00a0d2] text-white p-4 rounded-full shadow-lg hover:bg-[#0078a8] transition-colors z-50 ${isOpen ? 'hidden' : ''}`}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      </button>
    </>
  );
};

export default ChatWidget; 