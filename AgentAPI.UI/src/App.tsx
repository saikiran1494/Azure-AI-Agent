import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  FileText, 
  MessageCircle, 
  Bot, 
  User, 
  CheckCircle, 
  AlertCircle, 
  Download, 
  BarChart3, 
  FileSpreadsheet, 
  Scale, 
  UserCheck,
  Shield,
  Zap,
  Target,
  ArrowRight,
  Play,
  X,
  Send,
  Sparkles,
  Brain,
  Cpu,
  Database,
  Globe,
  Code,
  Layers,
  Settings,
  TrendingUp,
  Clock,
  Award,
  Rocket,
  ChevronRight,
  Star,
  Users,
  Building2,
  Briefcase
} from 'lucide-react';
import { callAgentAPI } from './services/apiService';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface DocumentResult {
  fileName: string;
  type: string;
  extractedData: any;
  confidence: number;
  processingTime: number;
}

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ end, duration = 2000, suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <span>{count}{suffix}</span>;
};

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Welcome! I\'m your Azure AI Document Processing Agent. Upload documents to get AI-powered insights and structured data extraction.',
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [processingResults, setProcessingResults] = useState<DocumentResult[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    var resultData = ''; 
      callAgentAPI(inputMessage).then((data) => {
          console.log("Bot response:", JSON.stringify(data.response));
          resultData =  data.response[0] || '';
            return resultData || 'I can process various document types including invoices, contracts, insurance claims, and resumes. Upload a document to get started, or ask me specific questions about document processing capabilities!';
          // Do something with data.response
        }).catch((err) => {
          console.error("Error from Agent API:", err);
        }); 

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');


    setTimeout(() => {
      const botResponse = resultData || '@aiwithsandeep!';
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
    }, 50000);
  };

  // const generateBotResponse =     (userInput: string): Promise<string> => {
  //   const input = userInput.toLowerCase(); 
  //   var resultData = '';
  //   if (input.includes('invoice') || input.includes('bill')) {
  //     return 'I can help you process invoices! Upload an invoice document and I\'ll extract key information like vendor details, amounts, dates, and line items with high accuracy using Azure AI.';
  //   } else if (input.includes('contract') || input.includes('agreement')) {
  //     return 'For legal contracts, I can extract important clauses, dates, parties involved, and financial terms. I\'ll also identify key obligations and deadlines to help your legal team review efficiently.';
  //   } else if (input.includes('insurance') || input.includes('claim')) {
  //     return 'I specialize in processing insurance claims! I can extract policy numbers, claim amounts, incident details, and determine if all required documentation is present.';
  //   } else if (input.includes('resume') || input.includes('cv')) {
  //     return 'For HR document processing, I can extract candidate information including skills, experience, education, and contact details. I can also match candidates to job requirements.';
  //   } else 
  //     {
         
  //         callAgentAPI(input).then((data) => {
  //         console.log("Bot response:", JSON.stringify(data.response));
  //         resultData = JSON.stringify(data.response[0]);
  //           return resultData || 'I can process various document types including invoices, contracts, insurance claims, and resumes. Upload a document to get started, or ask me specific questions about document processing capabilities!';
  //         // Do something with data.response
  //       }).catch((err) => {
  //         console.error("Error from Agent API:", err);
  //       });
      

        

  //     //return 'I can process various document types including invoices, contracts, insurance claims, and resumes. Upload a document to get started, or ask me specific questions about document processing capabilities!';
  //   }
  // };

  

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    setIsUploading(true);

    setTimeout(() => {
      const mockResult = generateMockResult(file);
      setProcessingResults(prev => [...prev, mockResult]);
      setIsUploading(false);

      const successMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: `✅ Successfully processed "${file.name}"! I've extracted key information with ${mockResult.confidence}% confidence using Azure AI Document Intelligence.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, successMessage]);
    }, 3000);
  };

  const generateMockResult = (file: File): DocumentResult => {
    const fileName = file.name;
    const fileType = fileName.toLowerCase();
    
    if (fileType.includes('invoice') || fileType.includes('bill')) {
      return {
        fileName: fileName,
        type: 'Invoice',
        confidence: 94.2,
        processingTime: 2.3,
        extractedData: {
          vendor: 'Acme Corporation',
          invoiceNumber: 'INV-2024-001',
          date: '2024-01-15',
          dueDate: '2024-02-15',
          totalAmount: '$2,459.99',
          taxAmount: '$245.99',
          subtotal: '$2,214.00',
          paymentTerms: 'Net 30'
        }
      };
    }
    return {
      fileName: fileName,
      type: 'General Document',
      confidence: 87.3,
      processingTime: 2.0,
      extractedData: {
        pages: 5,
        wordCount: 1247,
        language: 'English'
      }
    };
  };

  const MicrosoftLogo = () => (
    <div className="flex items-center space-x-1">
      <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
        <div className="bg-red-500 w-1.5 h-1.5"></div>
        <div className="bg-green-500 w-1.5 h-1.5"></div>
        <div className="bg-blue-500 w-1.5 h-1.5"></div>
        <div className="bg-yellow-500 w-1.5 h-1.5"></div>
      </div>
    </div>
  );

  const DotNetLogo = () => (
    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center shadow-lg">
      <span className="text-white text-xs font-bold">.NET</span>
    </div>
  );

  const NextJSLogo = () => (
    <div className="w-10 h-10 bg-gradient-to-br from-gray-900 to-black rounded-lg flex items-center justify-center shadow-lg">
      <span className="text-white text-xs font-bold">N</span>
    </div>
  );

  const AzureLogo = () => (
    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-lg">
      <span className="text-white text-xs font-bold">Az</span>
    </div>
  );

  const buildSteps = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Design Your Agent",
      description: "Define capabilities and document types",
      color: "from-purple-500 to-purple-700"
    },
    {
      icon: <Code className="h-8 w-8" />,
      title: "Configure AI Models",
      description: "Set up Azure OpenAI and Document Intelligence",
      color: "from-blue-500 to-blue-700"
    },
    {
      icon: <Database className="h-8 w-8" />,
      title: "Connect Data Sources",
      description: "Integrate with your existing systems",
      color: "from-green-500 to-green-700"
    },
    {
      icon: <Rocket className="h-8 w-8" />,
      title: "Deploy & Scale",
      description: "Launch your agent to production",
      color: "from-orange-500 to-orange-700"
    }
  ];

  const capabilities = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Lightning Fast Processing",
      description: "Process documents in seconds with Azure AI",
      metric: "99.9%",
      metricLabel: "Accuracy"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Enterprise Security",
      description: "Bank-grade security with Azure compliance",
      metric: "SOC 2",
      metricLabel: "Certified"
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Global Scale",
      description: "Deploy worldwide with Azure infrastructure",
      metric: "60+",
      metricLabel: "Regions"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Smart Analytics",
      description: "Get insights from your document processing",
      metric: "10x",
      metricLabel: "Faster"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white shadow-2xl">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <MicrosoftLogo />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Azure AI Document Processing
                </h1>
                <p className="text-blue-100 text-sm flex items-center">
                  <Sparkles className="h-4 w-4 mr-1" />
                  Powered by Microsoft Azure AI Foundry
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="bg-blue-500/30 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm border border-blue-400/30 hover:bg-blue-400/30 transition-all duration-300">
                AI Foundry
              </span>
              <span className="bg-blue-500/30 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm border border-blue-400/30 hover:bg-blue-400/30 transition-all duration-300">
                OpenAI
              </span>
              <span className="bg-blue-500/30 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm border border-blue-400/30 hover:bg-blue-400/30 transition-all duration-300">
                Azure Hub
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section ref={heroRef} className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Build Your First
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent block">
                  AI Agent
                </span>
                <span className="text-3xl md:text-4xl text-gray-600">with Microsoft Azure</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
                Transform your business with intelligent document processing. Extract insights from invoices, contracts, 
                and claims using cutting-edge Azure AI technology in just minutes.
              </p>
            </div>

            {/* Interactive Stats */}
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  <AnimatedCounter end={99} suffix="%" />
                </div>
                <p className="text-gray-600">Accuracy Rate</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  <AnimatedCounter end={10} suffix="x" />
                </div>
                <p className="text-gray-600">Faster Processing</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  <AnimatedCounter end={20} suffix="+" />
                </div>
                <p className="text-gray-600">Document Types</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  <AnimatedCounter end={24} suffix="/7" />
                </div>
                <p className="text-gray-600">Availability</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <button
                onClick={() => setShowChat(true)}
                className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold flex items-center shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                <Play className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Try the Agent Now
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              <button className="group bg-white text-gray-700 px-8 py-4 rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold flex items-center shadow-lg hover:shadow-xl border border-gray-200">
                <Code className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                View Documentation
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Build Steps Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Build Your Agent in 4 Simple Steps
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From concept to production in minutes with Azure AI Foundry's intuitive platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {buildSteps.map((step, index) => (
              <div
                key={index}
                className={`relative group cursor-pointer transition-all duration-500 ${
                  activeStep === index ? 'scale-105' : 'hover:scale-102'
                }`}
              >
                <div className={`bg-gradient-to-br ${step.color} p-6 rounded-2xl text-white shadow-xl hover:shadow-2xl transition-all duration-300 ${
                  activeStep === index ? 'ring-4 ring-blue-300 ring-opacity-50' : ''
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                      {step.icon}
                    </div>
                    <div className="text-2xl font-bold opacity-50">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-white/90 text-sm">{step.description}</p>
                  
                  {activeStep === index && (
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                      <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Enterprise-Grade Capabilities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built on Microsoft's trusted cloud infrastructure with world-class AI models
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {capabilities.map((capability, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:-translate-y-2"
              >
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-blue-600">
                    {capability.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{capability.title}</h3>
                <p className="text-gray-600 mb-4">{capability.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{capability.metric}</div>
                    <div className="text-sm text-gray-500">{capability.metricLabel}</div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Document Types Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Supported Document Types
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Process any document type with specialized AI models trained for your industry
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Claims */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:-translate-y-2">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">Claims</h3>
              <p className="text-gray-600 text-sm mb-6 text-center">Insurance and medical claims processing</p>
              <div className="space-y-2">
                <div className="bg-gray-50 px-3 py-2 rounded-lg text-xs text-gray-600 text-center hover:bg-blue-50 transition-colors duration-200">Insurance forms</div>
                <div className="bg-gray-50 px-3 py-2 rounded-lg text-xs text-gray-600 text-center hover:bg-blue-50 transition-colors duration-200">Medical bills</div>
                <div className="bg-gray-50 px-3 py-2 rounded-lg text-xs text-gray-600 text-center hover:bg-blue-50 transition-colors duration-200">Reimbursements</div>
              </div>
            </div>

            {/* Invoices */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-green-200 hover:-translate-y-2">
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <FileSpreadsheet className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">Invoices</h3>
              <p className="text-gray-600 text-sm mb-6 text-center">Financial invoices and billing documents</p>
              <div className="space-y-2">
                <div className="bg-gray-50 px-3 py-2 rounded-lg text-xs text-gray-600 text-center hover:bg-green-50 transition-colors duration-200">Purchase orders</div>
                <div className="bg-gray-50 px-3 py-2 rounded-lg text-xs text-gray-600 text-center hover:bg-green-50 transition-colors duration-200">Bills</div>
                <div className="bg-gray-50 px-3 py-2 rounded-lg text-xs text-gray-600 text-center hover:bg-green-50 transition-colors duration-200">Receipts</div>
              </div>
            </div>

            {/* Contracts */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200 hover:-translate-y-2">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Scale className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">Contracts</h3>
              <p className="text-gray-600 text-sm mb-6 text-center">Legal contracts and agreements</p>
              <div className="space-y-2">
                <div className="bg-gray-50 px-3 py-2 rounded-lg text-xs text-gray-600 text-center hover:bg-purple-50 transition-colors duration-200">NDAs</div>
                <div className="bg-gray-50 px-3 py-2 rounded-lg text-xs text-gray-600 text-center hover:bg-purple-50 transition-colors duration-200">Service agreements</div>
                <div className="bg-gray-50 px-3 py-2 rounded-lg text-xs text-gray-600 text-center hover:bg-purple-50 transition-colors duration-200">Employment contracts</div>
              </div>
            </div>

            {/* Tables & Graphs */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-orange-200 hover:-translate-y-2">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="h-10 w-10 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">Tables & Graphs</h3>
              <p className="text-gray-600 text-sm mb-6 text-center">Structured data and visualizations</p>
              <div className="space-y-2">
                <div className="bg-gray-50 px-3 py-2 rounded-lg text-xs text-gray-600 text-center hover:bg-orange-50 transition-colors duration-200">Spreadsheets</div>
                <div className="bg-gray-50 px-3 py-2 rounded-lg text-xs text-gray-600 text-center hover:bg-orange-50 transition-colors duration-200">Charts</div>
                <div className="bg-gray-50 px-3 py-2 rounded-lg text-xs text-gray-600 text-center hover:bg-orange-50 transition-colors duration-200">Reports</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <FileText className="h-12 w-12 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Upload Your Documents</h2>
            <p className="text-gray-600 text-lg">Drag and drop files here, or click to browse</p>
            <p className="text-sm text-gray-500 mt-2">Supports PDF, DOC, DOCX, JPG, PNG • Max 10MB</p>
          </div>
          
          <div 
            className="group border-2 border-dashed border-gray-300 rounded-2xl p-16 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300 cursor-pointer bg-gradient-to-br from-gray-50 to-blue-50/30"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFileUpload(e.dataTransfer.files);
            }}
          >
            <div className="group-hover:scale-110 transition-transform duration-300">
              <Upload className="h-16 w-16 text-gray-400 group-hover:text-blue-500 mx-auto mb-6 transition-colors duration-300" />
            </div>
            <p className="text-xl font-medium text-gray-700 mb-3 group-hover:text-blue-700 transition-colors duration-300">
              Choose files or drag them here
            </p>
            <p className="text-gray-500 group-hover:text-blue-600 transition-colors duration-300">
              Start processing with Azure AI in seconds
            </p>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
              onChange={(e) => handleFileUpload(e.target.files)}
            />
          </div>
          
          {isUploading && (
            <div className="mt-8 flex items-center justify-center bg-blue-50 rounded-xl p-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-4"></div>
              <div>
                <p className="text-blue-700 font-medium">Processing document with Azure AI...</p>
                <p className="text-blue-600 text-sm">Extracting insights and structured data</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Powered by Industry Leaders</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Built on Microsoft's trusted ecosystem with cutting-edge AI and cloud technologies
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Microsoft Azure AI */}
            <div className="group">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="flex items-center mb-6">
                  <MicrosoftLogo />
                  <h3 className="text-2xl font-semibold ml-3">Microsoft Azure AI</h3>
                </div>
                <p className="text-gray-300 mb-6">Enterprise-grade AI services for document intelligence and natural language processing</p>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-400">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                    Azure AI Foundry
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                    OpenAI Integration
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                    Computer Vision
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                    Document Intelligence
                  </div>
                </div>
              </div>
            </div>

            {/* Use Cases */}
            <div className="group">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="flex items-center mb-6">
                  <Target className="h-8 w-8 text-blue-400" />
                  <h3 className="text-2xl font-semibold ml-3">Use Cases</h3>
                </div>
                <p className="text-gray-300 mb-6">Transform business processes across multiple departments and industries</p>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-400">
                    <Users className="h-4 w-4 mr-2 text-blue-400" />
                    HR Document Processing
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <Building2 className="h-4 w-4 mr-2 text-blue-400" />
                    Financial Analysis
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <Scale className="h-4 w-4 mr-2 text-blue-400" />
                    Contract Management
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <Shield className="h-4 w-4 mr-2 text-blue-400" />
                    Claims Processing
                  </div>
                </div>
              </div>
            </div>

            {/* Technologies */}
            <div className="group">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="flex items-center mb-6">
                  <Layers className="h-8 w-8 text-purple-400" />
                  <h3 className="text-2xl font-semibold ml-3">Technologies</h3>
                </div>
                <p className="text-gray-300 mb-6">Modern full-stack architecture with enterprise-grade security and scalability</p>
                <div className="flex items-center space-x-4 mb-6">
                  <AzureLogo />
                  <DotNetLogo />
                  <NextJSLogo />
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-lg">
                    <span className="text-white text-xs font-bold">TS</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-400">
                    <Code className="h-4 w-4 mr-2 text-purple-400" />
                    .NET Core Web API
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <Globe className="h-4 w-4 mr-2 text-purple-400" />
                    Next.js Frontend
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <Database className="h-4 w-4 mr-2 text-purple-400" />
                    TypeScript
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <Settings className="h-4 w-4 mr-2 text-purple-400" />
                    Azure Integration
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MicrosoftLogo />
              <span className="text-gray-400">© 2025 Microsoft Corporation. All rights reserved.</span>
            </div>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Support</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Chat Modal */}
      {showChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[700px] flex flex-col overflow-hidden">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-500 p-3 rounded-xl backdrop-blur-sm">
                  <Bot className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Azure AI Agent</h3>
                  <p className="text-blue-100 text-sm flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                    Ready to process documents
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowChat(false)}
                className="text-white hover:bg-blue-500 p-2 rounded-xl transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-br from-gray-50 to-blue-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-4 ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.type === 'bot' && (
                    <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-3 rounded-xl">
                      <Bot className="h-5 w-5 text-blue-600" />
                    </div>
                  )}
                  <div
                    className={`max-w-xs lg:max-w-md px-6 py-4 rounded-2xl shadow-lg ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                        : 'bg-white text-gray-800 border border-gray-100'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <p className={`text-xs mt-2 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  {message.type === 'user' && (
                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-3 rounded-xl">
                      <User className="h-5 w-5 text-gray-600" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="border-t border-gray-200 p-6 bg-white">
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask the AI agent about your documents..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

export default App;