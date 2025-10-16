'use client';

import React, { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Card from '@/components/Card';
import styles from '@/styles/Auth.module.css';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      // TODO: This will call the mock login. Replace with real API authentication
      await login(email, password);
      router.push('/jobs');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    }
  };

  return (
    <div className={styles.authContainer}>
      <Card className={styles.authCard}>
        <h1 className={styles.authTitle}>Log In</h1>
        <p className={styles.authSubtitle}>Welcome back to UGA Job Tracker</p>

        {error && (
          <div className={styles.errorAlert} role="alert" aria-live="polite">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.authForm}>
          <Input
            type="email"
            label="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your.email@uga.edu"
            fullWidth
            required
            autoComplete="email"
            aria-required="true"
          />

          <Input
            type="password"
            label="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter your password"
            fullWidth
            required
            autoComplete="current-password"
            aria-required="true"
          />

          <Button type="submit" fullWidth disabled={isLoading} aria-busy={isLoading}>
            {isLoading ? 'Logging in...' : 'Log In'}
          </Button>
        </form>

        <div className={styles.authFooter}>
          <p className={styles.authLink}>
            Don't have an account?{' '}
            <Link href="/signup" className={styles.link}>
              Sign up
            </Link>
          </p>
        </div>

        <div className={styles.demoHint}>
          <strong>Demo tip:</strong> Use any email and password (6+ characters) to log in with mock authentication.
        </div>
      </Card>
    </div>
  );
}
