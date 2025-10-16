import React from 'react';
import Link from 'next/link';
import Button from '@/components/Button';
import styles from '@/styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Athens Job & Opportunity Tracker</h1>
          <p className={styles.subtitle}>
            Your comprehensive platform for discovering and tracking jobs, internships, and opportunities in Athens and at the University of Georgia
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/jobs">
              <Button size="large">Browse Jobs</Button>
            </Link>
            <Link href="/signup">
              <Button size="large" variant="secondary">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <section className={styles.features}>
        <div className={styles.featuresGrid}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>🔍</div>
            <h3 className={styles.featureTitle}>Discover Opportunities</h3>
            <p className={styles.featureDescription}>
              Browse local jobs, internships, and co-ops from Athens businesses and UGA departments
            </p>
          </div>

          <div className={styles.feature}>
            <div className={styles.featureIcon}>📊</div>
            <h3 className={styles.featureTitle}>Track Applications</h3>
            <p className={styles.featureDescription}>
              Organize your job applications and track progress from applied to interview to offer
            </p>
          </div>

          <div className={styles.feature}>
            <div className={styles.featureIcon}>🎓</div>
            <h3 className={styles.featureTitle}>Built for Bulldogs</h3>
            <p className={styles.featureDescription}>
              Tailored specifically for UGA students and graduates seeking opportunities in Athens
            </p>
          </div>
        </div>
      </section>

      <section className={styles.about}>
        <h2 className={styles.aboutTitle}>About This Platform</h2>
        <p className={styles.aboutText}>
          The Athens Job & Opportunity Tracker is designed to help UGA students and recent graduates find and manage their job search in the Athens area. Whether you're looking for internships, co-ops, part-time positions, or full-time opportunities, our platform helps you stay organized throughout your job search journey.
        </p>
        <p className={styles.aboutText}>
          Create an account to save job listings, track your applications, update application statuses, and keep notes on each opportunity—all in one convenient location.
        </p>
      </section>
    </div>
  );
}
