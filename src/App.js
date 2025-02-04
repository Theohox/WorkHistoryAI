import React, { useState, useRef, useEffect } from 'react';
import { SYSTEM_PROMPT } from './prompts';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages,
            userMessage
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage = {
        role: 'assistant',
        content: data.choices[0].message.content
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again later.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return React.createElement('div', { className: 'min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12' },
    React.createElement('div', { className: 'relative py-3 sm:max-w-xl sm:mx-auto w-full px-4 sm:px-0' },
      React.createElement('div', { className: 'bg-white shadow-lg rounded-lg' },
        React.createElement('div', { className: 'px-4 py-5 sm:p-6' },
          React.createElement('h1', { className: 'text-xl font-semibold mb-4' }, 'Portfolio Chat Assistant'),
          React.createElement('div', { className: 'h-96 overflow-y-auto mb-4 space-y-4' },
            messages.map((message, index) =>
              React.createElement('div', {
                key: index,
                className: `p-3 rounded-lg ${message.role === 'user' ? 'bg-blue-100 ml-auto max-w-md' : 'bg-gray-100 mr-auto max-w-md'}`
              }, message.content)
            ),
            isLoading && React.createElement('div', { className: 'bg-gray-100 p-3 rounded-lg mr-auto max-w-md' }, 'Thinking...'),
            React.createElement('div', { ref: messagesEndRef })
          ),
          React.createElement('form', { onSubmit: handleSubmit, className: 'mt-4' },
            React.createElement('div', { className: 'flex space-x-4' },
              React.createElement('input', {
                type: 'text',
                value: input,
                onChange: (e) => setInput(e.target.value),
                placeholder: 'Ask me anything about my professional background...',
                className: 'flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50',
                disabled: isLoading
              }),
              React.createElement('button', {
                type: 'submit',
                disabled: isLoading,
                className: 'inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50'
              }, 'Send')
            )
          )
        )
      )
    )
  );
}

export default App;