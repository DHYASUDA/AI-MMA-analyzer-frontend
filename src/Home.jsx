import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import Sidebar from './Sidebar';
import { apiUrl } from './config';
import './Home.css';

function Home({ user, onLogout }) {
    const [promptText, setPromptText] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const prompt = async () => {
        if (!promptText.trim() || isLoading) return;

        const userMessage = { type: 'user', content: promptText };
        setMessages(prev => [...prev, userMessage]);
        const currentPrompt = promptText;
        setPromptText('');
        setIsLoading(true);

        try {
            const response = await fetch(apiUrl('/ai/chat'), {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: currentPrompt,
            });

            if (!response.ok) throw new Error('Failed to get response');

            const data = await response.text();
            const aiMessage = { type: 'ai', content: data };
            setMessages(prev => [...prev, aiMessage]);
        } catch {
            setMessages(prev => [...prev, {
                type: 'ai',
                content: 'Sorry, something went wrong. Please try again.',
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            prompt();
        }
    };

    return (
        <div className="chat-container">
            <Sidebar active="home" onLogout={onLogout} />

            <div className="main-content">
                <h2 className="greeting">Hello, {user?.userName || user?.email}</h2>

                <div className="chat-messages">
                    {messages.length === 0 ? (
                        <div className="welcome-message">
                            <h2>Start chatting with AI</h2>
                            <p>Ask me anything!</p>
                        </div>
                    ) : (
                        messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.type}`}>
                                <strong>{msg.type === 'user' ? 'You' : 'AI'}:</strong>
                                {msg.type === 'ai'
                                    ? <ReactMarkdown>{msg.content}</ReactMarkdown>
                                    : <p>{msg.content}</p>}
                            </div>
                        ))
                    )}

                    {isLoading && (
                        <div className="message ai">
                            <strong>AI:</strong>
                            <p>Thinking...</p>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                <div className="chat-input-area">
                    <div className="input-wrapper">
                        <input
                            type="text"
                            value={promptText}
                            onChange={(e) => setPromptText(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message..."
                            disabled={isLoading}
                        />
                        <button onClick={prompt} disabled={isLoading || !promptText.trim()}>
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
