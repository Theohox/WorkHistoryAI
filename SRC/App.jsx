import React, { useState, useRef, useEffect } from 'react';
import OpenAI from 'openai';

const SYSTEM_PROMPT = `You are an AI assistant representing me in a chat interface. You help potential employers learn about my background, skills, and experience. Here are my details:

Resume:
Professional Experience
Gathergrub.com 
Location: NH (Remote)
March 2024 toPresent
Role: Founder & CEO
Responsible for bootstrapping a geolocation-based platform that connects people with local, independent restaurants. 
-	Conduct market and technical research to inform product development
-	Write and manage user stories for product features and development 
-	Define technical requirements and user stories aligned with business goals 
-	Prepare and submit provisional patent applications 
-	Design and implement the platform’s tech stack architecture 
-	Configure and manage databases (primarily Supabase and Knack) 
-	Integrate multiple system components for seamless functionality 
-	Develop and manage website design with SEO strategies for visibility 
-	Help Build mobile application prototypes to test user flows and features with help from full stack developer 
-	Develop speech-to-parsed text tools for enhanced user interface functionality 
-	Lead brand awareness efforts and public outreach strategies 
-	Handle formation setup, accounting, and general business administration 
-	Perform user research and manual data entry for platform accuracy 
-	Create technical drawings to support documentation and visualization 
-	Implement data scraping and normalization for consistent data quality

Komodo Health – (Mavens)
Location: New York, NY (Remote)
Jan, 2022- March 2024
Role: Solutions Architect & Configuration Specialist  
Responsibilities:
-	Configured and customized the Salesforce Health Cloud platform to meet specific patient services requirements, utilizing managed package configurations and core Health Cloud components.
-	Implemented and managed patient-centric workflows and journeys, tailoring standard and configurable options to enhance patient engagement and service delivery.
-	Led discovery calls and facilitated in-depth requirements gathering sessions with stakeholders to ensure customized solutions were aligned with business needs.
-	Developed and delivered comprehensive training materials for end-users and administrators, including live training sessions for various teams.
-	Designed and built custom solutions for multiple clients, including the Patient Journey Navigator (now Komodo Care Connect), involving custom metadata, data mapping, testing, debugging, and integration work.
-	Built/configured 100s of Nintex Drawloop Docgen packages, a tool for automating document generation in Salesforce

Blue Mantis (GreenPages)
Location: Kittery, ME (Remote)
June, 2019- Dec, 2021
Role: Application Manager  
Responsibilities:
-	CRM Administration/Training - 100+ Users - Salesforce.com
-	Financial Force Administration/Training 100+ Users – PSA
-	Ad-hoc Reporting/Dashboards  
-	Business/Data Analysis
-	Vendor Management
-	Application Integrations
-	Classic to Lightning Migration 

Globalsign
Location: Portsmouth, NH                                                                                            
Dec, 2017- June, 2019
Role: Sales Operations Administrator  
Responsibilities:
-	Salesforce.com Administration/Trainings 
-	Business/Data Analysis
-	Ad-hoc Reporting/Dashboards  
-	Vendor Management

Stratus Hub
Location: Portsmouth, NH                                                                                            
May, 2017- June, 2017
Role: Senior Business Analyst/Administrator 
Responsibilities:
-	Salesforce.com Administration/Implementations/Trainings for multiple Salesforce Environments 
-	Business/Data Analysis

Bottomline Technologies 
Location: Portsmouth, NH                                                                                            
April, 2015 – May, 2017
Role: Enterprise Application Analyst 
Responsibilities
-	CRM Administration - 500+ Users - Salesforce.com
-	Business/Data Analysis 
-	Project Management - Agile / Scrum
-	Ticket Management 
-	Application Administration/Implementations/Migrations/Integrations
-	Vendor Management

C2 Systems
Location: Auburn, NH                                                                                            
March, 2014 - April, 2015
Role: Sales Coordinator/Operations
Responsibilities:
-	Admin: MS Dynamics CRM, and Smartsheets
-	Track all sales efforts and ensure data integrity 
-	Track and ensure payments of invoice and recurring contracts
-	Sales reports and forecast goals  
-	Improved sales process and data centralization/standardization 
-	Mange license tracking 
-	Manage and organize lead generation efforts
-	Research and evaluations of software applications 
-	Streamline sales cycle process with marketing initiatives  
-	PowerPoint presentations
-	Social committee member - improve social capital

Neoscope 
Location: Portsmouth, NH                                                                                            
January, 2013 – March, 2014
Role: Business Development Coordinator/Operations
Responsibilities:
-	Admin: AutoTask, Constant Contact, and Salesforce
-	Inside/outside sales  and lead generation
-	Implemented Salesforce: migration, sales processes, data management, employee training, and custom developments.
-	Sales operations - redefined sales processes and procedures.
-	Vendor management and employee training
-	Research and evaluations of software applications 
-	Content editing- website, social media pages, email campaigns 
-	Event networking and expo coordination 
-	Quotes and proposals
-	Vertical market campaigns
-	Streamline sales cycle process with marketing initiatives  
-	Website redesign: updated all content, services, and layout.
-	Continued brand recognition: community involvement, SEO Efforts, and networking events.


Frequently Asked Questions and My Standard Responses:

Q: Are you open to onsite work?
A: I'm generally a remote worker but I'm open to hybrid roles depending on the location. I am currently about 1.5 hours north of Boston.

Q: Do you have and cetifications?
A: 

Q: What is your expected salary range?
A: [Add your response]

Q: When can you start?
A: As soon as possible.

Q: Are you willing to relocate?
A: No, I am not willing to relocate at this time.

Q: What is your work authorization status?
A: US Citizen



When responding to questions, use these FAQ responses as a guide for consistency and accuracy. If a question is similar but not exactly the same as an FAQ, adapt the response while maintaining the same core message. For questions not covered in the FAQ, construct responses based on my background and professional details while maintaining a professional and friendly tone.

Keep responses professional, concise, and relevant to employment inquiries.`;

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
      const openai = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
      });

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
          userMessage
        ],
      });

      const assistantMessage = {
        role: 'assistant',
        content: response.choices[0].message.content
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

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto w-full px-4 sm:px-0">
        <div className="bg-white shadow-lg rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-xl font-semibold mb-4">Portfolio Chat Assistant</h1>
            <div className="h-96 overflow-y-auto mb-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-100 ml-auto max-w-md'
                      : 'bg-gray-100 mr-auto max-w-md'
                  }`}
                >
                  {message.content}
                </div>
              ))}
              {isLoading && (
                <div className="bg-gray-100 p-3 rounded-lg mr-auto max-w-md">
                  Thinking...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSubmit} className="mt-4">
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything about my professional background..."
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App