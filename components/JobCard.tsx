import React from 'react';
import Link from 'next/link';
import { Job } from '@/contexts/DataContext';
import Card from './Card';
import Badge from './Badge';
import Button from './Button';
import styles from '@/styles/JobCard.module.css';

interface JobCardProps {
  job: Job;
  onSave?: () => void;
  showSaveButton?: boolean;
  isSaved?: boolean;
}

export default function JobCard({ job, onSave, showSaveButton = false, isSaved = false }: JobCardProps) {
  return (
    <Card className={styles.jobCard}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          <Link href={`/jobs/${job.id}`} className={styles.titleLink}>
            {job.title}
          </Link>
        </h3>
        <Badge variant="default">{job.type}</Badge>
      </div>

      <div className={styles.company}>{job.company}</div>
      <div className={styles.location}>{job.location}</div>

      {job.salary && <div className={styles.salary}>{job.salary}</div>}

      <p className={styles.description}>
        {job.description.length > 150 ? `${job.description.substring(0, 150)}...` : job.description}
      </p>

      <div className={styles.footer}>
        <span className={styles.postedDate}>Posted: {job.postedDate}</span>
        {showSaveButton && onSave && (
          <Button
            size="small"
            variant={isSaved ? 'secondary' : 'primary'}
            onClick={onSave}
            disabled={isSaved}
            aria-label={isSaved ? 'Already saved' : `Save ${job.title}`}
          >
            {isSaved ? 'Saved' : 'Save Job'}
          </Button>
        )}
      </div>
    </Card>
  );
}
