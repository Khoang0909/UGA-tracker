'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useData, ApplicationStatus } from '@/contexts/DataContext';
import ApplicationCard from '@/components/ApplicationCard';
import Button from '@/components/Button';
import styles from '@/styles/Applications.module.css';

export default function ApplicationsPage() {
  const { isAuthenticated, user } = useAuth();
  const { applications, updateApplicationStatus, deleteApplication, updateApplicationNotes } =
    useData();

  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleStatusChange = (applicationId: string, newStatus: ApplicationStatus) => {
    updateApplicationStatus(applicationId, newStatus);
  };

  const handleDelete = (applicationId: string) => {
    if (deleteConfirm === applicationId) {
      deleteApplication(applicationId);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(applicationId);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const handleNotesUpdate = (applicationId: string, notes: string) => {
    updateApplicationNotes(applicationId, notes);
  };

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className={styles.container}>
        <div className={styles.authPromptContainer}>
          <h1 className={styles.authPromptTitle}>Track Your Applications</h1>
          <p className={styles.authPromptText}>
            Log in to save job listings, track your applications, and manage your job search all in one place.
          </p>
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
          <div className={styles.browseLink}>
            <Link href="/jobs">Browse available jobs →</Link>
          </div>
        </div>
      </div>
    );
  }

  // Show empty state if no applications
  if (applications.length === 0) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>My Applications</h1>

        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📋</div>
          <h2 className={styles.emptyTitle}>No applications yet</h2>
          <p className={styles.emptyText}>
            Start tracking your job search by browsing available opportunities and adding them to your applications.
          </p>
          <Link href="/jobs">
            <Button size="large">Browse Jobs</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Group applications by status
  const appliedApps = applications.filter(app => app.status === 'applied');
  const interviewApps = applications.filter(app => app.status === 'interview');
  const offerApps = applications.filter(app => app.status === 'offer');
  const rejectedApps = applications.filter(app => app.status === 'rejected');

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>My Applications</h1>
          <p className={styles.subtitle}>
            Welcome back, {user?.username}! You're tracking {applications.length}{' '}
            {applications.length === 1 ? 'application' : 'applications'}.
          </p>
        </div>
        <Link href="/jobs">
          <Button>Browse More Jobs</Button>
        </Link>
      </div>

      <div className={styles.statusSummary}>
        <div className={styles.statusItem}>
          <span className={styles.statusCount}>{appliedApps.length}</span>
          <span className={styles.statusLabel}>Applied</span>
        </div>
        <div className={styles.statusItem}>
          <span className={styles.statusCount}>{interviewApps.length}</span>
          <span className={styles.statusLabel}>Interview</span>
        </div>
        <div className={styles.statusItem}>
          <span className={styles.statusCount}>{offerApps.length}</span>
          <span className={styles.statusLabel}>Offer</span>
        </div>
        <div className={styles.statusItem}>
          <span className={styles.statusCount}>{rejectedApps.length}</span>
          <span className={styles.statusLabel}>Rejected</span>
        </div>
      </div>

      <div className={styles.applicationsList}>
        {applications.map(application => (
          <ApplicationCard
            key={application.id}
            application={application}
            isAuthenticated={isAuthenticated}
            onStatusChange={newStatus => handleStatusChange(application.id, newStatus)}
            onDelete={() => handleDelete(application.id)}
            onNotesUpdate={notes => handleNotesUpdate(application.id, notes)}
          />
        ))}
      </div>

      {deleteConfirm && (
        <div className={styles.deleteToast} role="alert" aria-live="assertive">
          Click delete again to confirm removal
        </div>
      )}
    </div>
  );
}
