import React, { useState } from 'react';
import Link from 'next/link';
import { Application, ApplicationStatus } from '@/contexts/DataContext';
import Card from './Card';
import Badge from './Badge';
import Button from './Button';
import Select from './Select';
import styles from '@/styles/ApplicationCard.module.css';

interface ApplicationCardProps {
  application: Application;
  onStatusChange?: (newStatus: ApplicationStatus) => void;
  onDelete?: () => void;
  onNotesUpdate?: (notes: string) => void;
  isAuthenticated: boolean;
}

const STATUS_OPTIONS = [
  { value: 'applied', label: 'Applied' },
  { value: 'interview', label: 'Interview' },
  { value: 'offer', label: 'Offer' },
  { value: 'rejected', label: 'Rejected' },
];

export default function ApplicationCard({
  application,
  onStatusChange,
  onDelete,
  onNotesUpdate,
  isAuthenticated,
}: ApplicationCardProps) {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState(application.notes || '');

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onStatusChange) {
      onStatusChange(e.target.value as ApplicationStatus);
    }
  };

  const handleSaveNotes = () => {
    if (onNotesUpdate) {
      onNotesUpdate(notes);
    }
    setIsEditingNotes(false);
  };

  return (
    <Card className={styles.applicationCard}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>
            <Link href={`/jobs/${application.job.id}`} className={styles.titleLink}>
              {application.job.title}
            </Link>
          </h3>
          <div className={styles.company}>{application.job.company}</div>
        </div>
        <Badge variant={application.status}>{application.status.toUpperCase()}</Badge>
      </div>

      <div className={styles.details}>
        <div className={styles.location}>{application.job.location}</div>
        <div className={styles.appliedDate}>Applied: {application.appliedDate}</div>
      </div>

      {isAuthenticated && (
        <div className={styles.statusControl}>
          <Select
            label="Status"
            options={STATUS_OPTIONS}
            value={application.status}
            onChange={handleStatusChange}
            aria-label="Update application status"
          />
        </div>
      )}

      <div className={styles.notesSection}>
        {isEditingNotes ? (
          <div className={styles.notesEdit}>
            <label htmlFor={`notes-${application.id}`} className={styles.notesLabel}>
              Notes
            </label>
            <textarea
              id={`notes-${application.id}`}
              className={styles.notesTextarea}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add notes about this application..."
              rows={3}
              aria-label="Application notes"
            />
            <div className={styles.notesActions}>
              <Button size="small" onClick={handleSaveNotes}>
                Save
              </Button>
              <Button
                size="small"
                variant="secondary"
                onClick={() => {
                  setIsEditingNotes(false);
                  setNotes(application.notes || '');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className={styles.notesDisplay}>
            <div className={styles.notesLabel}>Notes:</div>
            <p className={styles.notesText}>{application.notes || 'No notes yet'}</p>
            {isAuthenticated && (
              <Button size="small" variant="secondary" onClick={() => setIsEditingNotes(true)}>
                {application.notes ? 'Edit Notes' : 'Add Notes'}
              </Button>
            )}
          </div>
        )}
      </div>

      {isAuthenticated && onDelete && (
        <div className={styles.actions}>
          <Button
            size="small"
            variant="danger"
            onClick={onDelete}
            aria-label={`Delete application for ${application.job.title}`}
          >
            Delete Application
          </Button>
        </div>
      )}
    </Card>
  );
}
