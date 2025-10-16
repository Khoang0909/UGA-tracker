import React from 'react';
import Link from 'next/link';
import Button from '@/components/Button';
import Card from '@/components/Card';
import styles from '@/styles/NotFound.module.css';

export default function NotFound() {
  return (
    <div className={styles.container}>
      <Card className={styles.notFoundCard}>
        <div className={styles.icon}>🔍</div>
        <h1 className={styles.title}>404 - Page Not Found</h1>
        <p className={styles.message}>
          Oops! The page you're looking for doesn't exist. It may have been moved or deleted.
        </p>

        <div className={styles.suggestions}>
          <h2 className={styles.suggestionsTitle}>Here are some helpful links:</h2>
          <ul className={styles.linksList}>
            <li>
              <Link href="/" className={styles.link}>
                Go to Home Page
              </Link>
            </li>
            <li>
              <Link href="/jobs" className={styles.link}>
                Browse Job Listings
              </Link>
            </li>
            <li>
              <Link href="/applications" className={styles.link}>
                View My Applications
              </Link>
            </li>
          </ul>
        </div>

        <div className={styles.actions}>
          <Link href="/">
            <Button size="large">Return Home</Button>
          </Link>
          <Link href="/jobs">
            <Button size="large" variant="secondary">
              Browse Jobs
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
