'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Internship' | 'Co-op';
  description: string;
  requirements: string[];
  salary?: string;
  postedDate: string;
  externalUrl?: string;
}

export type ApplicationStatus = 'applied' | 'interview' | 'offer' | 'rejected';

export interface Application {
  id: string;
  jobId: string;
  job: Job;
  status: ApplicationStatus;
  appliedDate: string;
  notes?: string;
}

interface DataContextType {
  jobs: Job[];
  applications: Application[];
  isLoading: boolean;
  error: string | null;
  searchJobs: (query: string, filters?: JobFilters) => Promise<void>;
  getJobById: (id: string) => Job | undefined;
  addApplication: (jobId: string) => void;
  updateApplicationStatus: (applicationId: string, status: ApplicationStatus) => void;
  deleteApplication: (applicationId: string) => void;
  updateApplicationNotes: (applicationId: string, notes: string) => void;
}

export interface JobFilters {
  type?: string;
  location?: string;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock job data with Athens/UGA focus
const MOCK_JOBS: Job[] = [
  {
    id: '1',
    title: 'Software Engineering Intern',
    company: 'Peach State Technologies',
    location: 'Athens, GA',
    type: 'Internship',
    description: 'Join our team in downtown Athens to build innovative web applications. Work alongside experienced engineers on real-world projects.',
    requirements: ['JavaScript/TypeScript', 'React', 'Node.js', 'Git'],
    salary: '$18-22/hr',
    postedDate: '2025-10-10',
    externalUrl: 'https://example.com/job/1',
  },
  {
    id: '2',
    title: 'UX Design Co-op',
    company: 'Classic City Design Studio',
    location: 'Athens, GA',
    type: 'Co-op',
    description: 'Looking for a creative UX designer to join our studio near UGA campus. Great opportunity for hands-on experience.',
    requirements: ['Figma', 'Adobe XD', 'User Research', 'Prototyping'],
    salary: '$20-25/hr',
    postedDate: '2025-10-12',
  },
  {
    id: '3',
    title: 'Data Analyst',
    company: 'University of Georgia',
    location: 'Athens, GA',
    type: 'Part-time',
    description: 'Part-time data analyst position in the Department of Student Affairs. Analyze student engagement data and create visualizations.',
    requirements: ['Python', 'SQL', 'Excel', 'Data Visualization'],
    salary: '$16-18/hr',
    postedDate: '2025-10-08',
  },
  {
    id: '4',
    title: 'Full Stack Developer',
    company: 'Georgia FinTech Innovations',
    location: 'Athens, GA',
    type: 'Full-time',
    description: 'Build scalable financial technology solutions. New grad friendly. Hybrid work with Athens office.',
    requirements: ['React', 'Node.js', 'MongoDB', 'AWS', 'TypeScript'],
    salary: '$70k-85k',
    postedDate: '2025-10-05',
  },
  {
    id: '5',
    title: 'Marketing Intern',
    company: 'Athens Creative Agency',
    location: 'Athens, GA',
    type: 'Internship',
    description: 'Help local businesses grow their online presence. Social media management, content creation, and analytics.',
    requirements: ['Social Media', 'Content Creation', 'Analytics', 'Communication'],
    salary: '$15-17/hr',
    postedDate: '2025-10-14',
  },
  {
    id: '6',
    title: 'Research Assistant',
    company: 'UGA Computer Science Department',
    location: 'Athens, GA',
    type: 'Part-time',
    description: 'Assist with machine learning research projects. Flexible hours for students.',
    requirements: ['Python', 'Machine Learning', 'Research Skills'],
    salary: '$15/hr',
    postedDate: '2025-10-11',
  },
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load applications from localStorage on mount
  useEffect(() => {
    const storedApps = localStorage.getItem('mockApplications');
    if (storedApps) {
      setApplications(JSON.parse(storedApps));
    }
  }, []);

  // Save applications to localStorage whenever they change
  useEffect(() => {
    if (applications.length >= 0) {
      localStorage.setItem('mockApplications', JSON.stringify(applications));
    }
  }, [applications]);

  // Mock search function
  // TODO: Replace with real API call to /api/jobs or external API (Adzuna/JSearch/USAJOBS)
  const searchJobs = async (query: string, filters?: JobFilters): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));

      let filtered = [...MOCK_JOBS];

      // Filter by search query
      if (query) {
        const lowerQuery = query.toLowerCase();
        filtered = filtered.filter(
          job =>
            job.title.toLowerCase().includes(lowerQuery) ||
            job.company.toLowerCase().includes(lowerQuery) ||
            job.description.toLowerCase().includes(lowerQuery)
        );
      }

      // Filter by type
      if (filters?.type && filters.type !== 'all') {
        filtered = filtered.filter(job => job.type === filters.type);
      }

      // Filter by location
      if (filters?.location && filters.location !== 'all') {
        filtered = filtered.filter(job => job.location.includes(filters.location));
      }

      setJobs(filtered);
    } catch (err) {
      setError('Failed to fetch jobs. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getJobById = (id: string): Job | undefined => {
    return MOCK_JOBS.find(job => job.id === id);
  };

  // TODO: Replace with real API call to /api/applications (POST)
  const addApplication = (jobId: string) => {
    const job = getJobById(jobId);
    if (!job) return;

    // Check if already applied
    const exists = applications.find(app => app.jobId === jobId);
    if (exists) {
      setError('You have already applied to this job');
      return;
    }

    const newApplication: Application = {
      id: `app-${Date.now()}`,
      jobId,
      job,
      status: 'applied',
      appliedDate: new Date().toISOString().split('T')[0],
    };

    setApplications(prev => [...prev, newApplication]);
  };

  // TODO: Replace with real API call to /api/applications/:id (PATCH)
  const updateApplicationStatus = (applicationId: string, status: ApplicationStatus) => {
    setApplications(prev =>
      prev.map(app => (app.id === applicationId ? { ...app, status } : app))
    );
  };

  // TODO: Replace with real API call to /api/applications/:id (DELETE)
  const deleteApplication = (applicationId: string) => {
    setApplications(prev => prev.filter(app => app.id !== applicationId));
  };

  // TODO: Replace with real API call to /api/applications/:id (PATCH)
  const updateApplicationNotes = (applicationId: string, notes: string) => {
    setApplications(prev =>
      prev.map(app => (app.id === applicationId ? { ...app, notes } : app))
    );
  };

  const value: DataContextType = {
    jobs,
    applications,
    isLoading,
    error,
    searchJobs,
    getJobById,
    addApplication,
    updateApplicationStatus,
    deleteApplication,
    updateApplicationNotes,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
