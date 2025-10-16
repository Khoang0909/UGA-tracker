'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import Card from '@/components/Card';
import Badge from '@/components/Badge';
import Button from '@/components/Button';
import styles from '@/styles/JobDetail.module.css';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { getJobById, addApplication, applications } = useData();

  const [message, setMessage] = useState('');
  const jobId = params.id as string;
  const job = getJobById(jobId);

  const isJobSaved = applications.some(app => app.jobId === jobId);

  const handleAddToApplications = () => {
    if (!isAuthenticated) {
      setMessage('Please log in to track applications');
      return;
    }

    if (isJobSaved) {
      setMessage('You have already applied to this job');
      return;
    }

    addApplication(jobId);
    setMessage('Added to your applications!');
    setTimeout(() => {
      router.push('/applications');
    }, 1500);
  };

  if (!job) {
    return (
      <div className={styles.container}>
        <Card className={styles.errorCard}>
          <h1 className={styles.errorTitle}>Job Not Found</h1>
          <p className={styles.errorText}>The job you're looking for doesn't exist or has been removed.</p>
          <Link href="/jobs">
            <Button>Browse All Jobs</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.backLink}>
        <Link href="/jobs" className={styles.backLinkText}>
          ← Back to Jobs
        </Link>
      </div>

      <Card className={styles.jobDetailCard}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>{job.title}</h1>
            <div className={styles.company}>{job.company}</div>
          </div>
          <Badge variant="default">{job.type}</Badge>
        </div>

        <div className={styles.metadata}>
          <div className={styles.metadataItem}>
            <span className={styles.metadataLabel}>Location:</span>
            <span className={styles.metadataValue}>{job.location}</span>
          </div>

          {job.salary && (
            <div className={styles.metadataItem}>
              <span className={styles.metadataLabel}>Salary:</span>
              <span className={styles.metadataValue}>{job.salary}</span>
            </div>
          )}

          <div className={styles.metadataItem}>
            <span className={styles.metadataLabel}>Posted:</span>
            <span className={styles.metadataValue}>{job.postedDate}</span>
          </div>
        </div>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Description</h2>
          <p className={styles.description}>{job.description}</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Requirements</h2>
          <ul className={styles.requirementsList}>
            {job.requirements.map((req, index) => (
              <li key={index} className={styles.requirementItem}>
                {req}
              </li>
            ))}
          </ul>
        </section>

        {job.externalUrl && (
          <section className={styles.section}>
            <a
              href={job.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.externalLink}
            >
              View Original Posting →
            </a>
          </section>
        )}

        {message && (
          <div
            className={`${styles.message} ${message.includes('log in') ? styles.messageError : styles.messageSuccess}`}
            role="status"
            aria-live="polite"
          >
            {message}
          </div>
        )}

        <div className={styles.actions}>
          {isAuthenticated ? (
            <Button
              size="large"
              fullWidth
              onClick={handleAddToApplications}
              disabled={isJobSaved}
              aria-label={isJobSaved ? 'Already in applications' : 'Add to applications'}
            >
              {isJobSaved ? 'Already in Your Applications' : 'Add to Applications'}
            </Button>
          ) : (
            <div className={styles.authPrompt}>
              <p className={styles.authPromptText}>Want to track this opportunity?</p>
              <div className={styles.authButtons}>
                <Link href="/login">
                  <Button size="large">Log In</Button>
                </Link>
                <Link href="/signup">
                  <Button size="large" variant="secondary">
                    Sign Up
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
