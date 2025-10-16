'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import JobCard from '@/components/JobCard';
import Input from '@/components/Input';
import Select from '@/components/Select';
import Button from '@/components/Button';
import styles from '@/styles/Jobs.module.css';

const JOB_TYPE_OPTIONS = [
  { value: 'all', label: 'All Types' },
  { value: 'Full-time', label: 'Full-time' },
  { value: 'Part-time', label: 'Part-time' },
  { value: 'Internship', label: 'Internship' },
  { value: 'Co-op', label: 'Co-op' },
];

const LOCATION_OPTIONS = [
  { value: 'all', label: 'All Locations' },
  { value: 'Athens', label: 'Athens, GA' },
];

export default function JobsPage() {
  const { isAuthenticated } = useAuth();
  const { jobs, applications, isLoading, error, searchJobs, addApplication } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [hasSearched, setHasSearched] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Initial search on mount
  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async () => {
    setHasSearched(true);
    setSaveMessage('');
    await searchJobs(searchQuery, {
      type: typeFilter !== 'all' ? typeFilter : undefined,
      location: locationFilter !== 'all' ? locationFilter : undefined,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSaveJob = (jobId: string) => {
    if (!isAuthenticated) {
      setSaveMessage('Please log in to save jobs');
      return;
    }

    addApplication(jobId);
    setSaveMessage('Job saved to your applications!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const isJobSaved = (jobId: string) => {
    return applications.some(app => app.jobId === jobId);
  };

  return (
    <div className={styles.jobsContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Browse Jobs & Opportunities</h1>
        <p className={styles.subtitle}>Find internships, co-ops, and jobs in Athens and at UGA</p>
      </div>

      <div className={styles.searchSection}>
        <div className={styles.searchBar}>
          <Input
            type="text"
            placeholder="Search by title, company, or keyword..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            fullWidth
            aria-label="Search jobs"
          />
        </div>

        <div className={styles.filters}>
          <Select
            label="Job Type"
            options={JOB_TYPE_OPTIONS}
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            aria-label="Filter by job type"
          />

          <Select
            label="Location"
            options={LOCATION_OPTIONS}
            value={locationFilter}
            onChange={e => setLocationFilter(e.target.value)}
            aria-label="Filter by location"
          />

          <Button onClick={handleSearch} disabled={isLoading} aria-busy={isLoading}>
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </div>

      {saveMessage && (
        <div className={styles.saveMessage} role="status" aria-live="polite">
          {saveMessage}
        </div>
      )}

      {error && (
        <div className={styles.errorMessage} role="alert">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className={styles.loadingState}>
          <div className={styles.spinner} aria-label="Loading jobs"></div>
          <p>Loading jobs...</p>
        </div>
      ) : hasSearched && jobs.length === 0 ? (
        <div className={styles.emptyState}>
          <h2 className={styles.emptyTitle}>No jobs found</h2>
          <p className={styles.emptyText}>
            Try adjusting your search query or filters to find more opportunities.
          </p>
        </div>
      ) : (
        <>
          <div className={styles.resultsHeader}>
            <p className={styles.resultsCount}>
              {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} found
            </p>
            {!isAuthenticated && (
              <p className={styles.loginPrompt}>
                <a href="/login" className={styles.loginLink}>
                  Log in
                </a>{' '}
                to save jobs and track applications
              </p>
            )}
          </div>

          <div className={styles.jobsList}>
            {jobs.map(job => (
              <JobCard
                key={job.id}
                job={job}
                showSaveButton={isAuthenticated}
                isSaved={isJobSaved(job.id)}
                onSave={() => handleSaveJob(job.id)}
              />
            ))}
          </div>

          {/* TODO: Add pagination or "Load more" button when connected to real API */}
          {jobs.length > 0 && (
            <div className={styles.paginationHint}>
              <p>Showing all results. Pagination will be added with external API integration.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
