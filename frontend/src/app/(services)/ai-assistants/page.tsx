"use client";

import React, { useState, useCallback } from 'react';
import { Bot, Upload, X, CheckCircle, Wand, MessageCircle, Zap, Github, ExternalLink } from 'lucide-react';

// --- Mock UI Components for Demonstration ---
const Button = ({ children, className, ...props }: { children: React.ReactNode; className?: string; [key:string]: any }) => (
    <button className={`inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background ${className}`} {...props}>{children}</button>
);
const Card = ({ children, className, ...props }: { children: React.ReactNode; className?: string; [key:string]: any }) => (
    <div className={`rounded-xl border bg-white text-card-foreground shadow-sm ${className}`} {...props}>{children}</div>
);
const CardContent = ({ children, className, ...props }: { children: React.ReactNode; className?: string; [key:string]: any }) => (
    <div className={`p-6 ${className}`} {...props}>{children}</div>
);
const CardHeader = ({ children, className, ...props }: { children: React.ReactNode; className?: string; [key:string]: any }) => (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>{children}</div>
);
const CardTitle = ({ children, className, ...props }: { children: React.ReactNode; className?: string; [key:string]: any }) => (
    <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`} {...props}>{children}</h3>
);
const Input = ({ className, ...props }: { className?: string; [key:string]: any }) => (
    <input className={`flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow ${className}`} {...props} />
);

// --- Type Definitions ---
interface FeatureItem {
  icon: React.ReactElement;
  title: string;
  description: string;
}
interface Project {
  id: number;
  name: string;
  githubLink?: string;
  demoLink?: string;
}

// --- Data Layer ---
const includedFeatures = [
  "Custom Chatbot Development", "Voice Assistant Integration", "Business Process Automation", 
  "API Integration Support", "Training & Ongoing Maintenance"
];

const featureHighlights: FeatureItem[] = [
    { icon: <MessageCircle size={24} className="text-indigo-500" />, title: 'Enhanced Engagement', description: 'Provide instant, 24/7 support to your customers.' },
    { icon: <Zap size={24} className="text-indigo-500" />, title: 'Boost Efficiency', description: 'Automate repetitive tasks and free up your team.' },
    { icon: <Wand size={24} className="text-indigo-500" />, title: 'Smart Solutions', description: 'Leverage AI to create intelligent, learning systems.' },
];

// --- Reusable Sub-components ---
const FeatureListItem = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-center gap-3">
    <CheckCircle className="w-5 h-5 text-green-500" />
    <span className="text-slate-700">{children}</span>
  </li>
);

const FeatureHighlightCard = ({ icon, title, description }: FeatureItem) => (
  <div className="text-center p-4">
    <div className="flex justify-center items-center mb-4">
        <div className="bg-indigo-100 p-4 rounded-full">{icon}</div>
    </div>
    <h4 className="text-lg font-semibold text-slate-800 mb-1">{title}</h4>
    <p className="text-slate-600 text-sm">{description}</p>
  </div>
);

const ProjectLinkCard = ({ project, onRemove }: { project: Project; onRemove: () => void; }) => (
    <div className="relative group bg-slate-100 rounded-lg p-4 border border-slate-200">
        <h4 className="font-bold text-slate-800 truncate mb-3">{project.name}</h4>
        <div className="flex flex-col space-y-2">
            {project.githubLink && (
                <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-slate-600 hover:text-indigo-600 transition-colors">
                    <Github className="w-4 h-4 mr-2" /> GitHub Repository
                </a>
            )}
            {project.demoLink && (
                <a href={project.demoLink} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-slate-600 hover:text-indigo-600 transition-colors">
                    <ExternalLink className="w-4 h-4 mr-2" /> Live Demo
                </a>
            )}
        </div>
        <button
            onClick={onRemove}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Remove project"
        >
            <X className="w-4 h-4" />
        </button>
    </div>
);

// --- Main AI Assistant Development Page Component ---
const AIAssistantDevelopmentPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectName, setProjectName] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [demoLink, setDemoLink] = useState('');

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (projectName && (githubLink || demoLink)) {
      const newProject: Project = {
        id: Date.now(),
        name: projectName,
        githubLink: githubLink,
        demoLink: demoLink,
      };
      setProjects(prev => [...prev, newProject]);
      setProjectName('');
      setGithubLink('');
      setDemoLink('');
    }
  };

  const removeProject = (id: number) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto space-y-12">
          
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <Bot className="w-8 h-8 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">AI Assistant Development</h1>
                  <p className="text-lg text-slate-600 mt-1">Custom AI chatbots to enhance your business operations.</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-4">Service Details</h3>
                  <p className="text-slate-600 mb-6">Develop custom AI assistants tailored to your needs. From customer service chatbots to intelligent automation, we create AI solutions that drive efficiency.</p>
                  <p className="text-lg font-semibold text-indigo-600 mb-6">Starting from ₹50,000</p>
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2">Request a Consultation</Button>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-4">What's Included</h3>
                  <ul className="space-y-3">
                    {includedFeatures.map(feature => <FeatureListItem key={feature}>{feature}</FeatureListItem>)}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featureHighlights.map((item) => <FeatureHighlightCard key={item.title} {...item} />)}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-slate-900">Showcase Your AI Projects</CardTitle>
              <p className="text-slate-600">Add links to your GitHub repositories and live demos.</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddProject} className="space-y-4 p-4 border rounded-lg bg-slate-50">
                <Input 
                  placeholder="Project Name (e.g., Customer Support Bot)"
                  value={projectName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProjectName(e.target.value)}
                  required
                />
                <Input 
                  type="url"
                  placeholder="GitHub Repository Link (optional)"
                  value={githubLink}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGithubLink(e.target.value)}
                />
                <Input 
                  type="url"
                  placeholder="Live Demo Link (optional)"
                  value={demoLink}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDemoLink(e.target.value)}
                />
                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">Add Project</Button>
              </form>

              {projects.length > 0 && (
                <div className="mt-8">
                    <h3 className="font-semibold mb-4 text-slate-800">Your Projects</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {projects.map((project) => (
                            <ProjectLinkCard key={project.id} project={project} onRemove={() => removeProject(project.id)} />
                        ))}
                    </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantDevelopmentPage;
