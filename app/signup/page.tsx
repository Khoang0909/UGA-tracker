'use client';

import React, { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Card from '@/components/Card';
import styles from '@/styles/Auth.module.css';

export default function SignupPage() {
  const router = useRouter();
  const { signup, isLoading } = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // TODO: This will call the mock signup. Replace with real API registration
      await signup(username, email, password);
      router.push('/jobs');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed. Please try again.');
    }
  };

  return (
    <div className={styles.authContainer}>
      <Card className={styles.authCard}>
        <h1 className={styles.authTitle}>Sign Up</h1>
        <p className={styles.authSubtitle}>Create your UGA Job Tracker account</p>

        {error && (
          <div className={styles.errorAlert} role="alert" aria-live="polite">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.authForm}>
          <Input
            type="text"
            label="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Choose a username"
            fullWidth
            required
            autoComplete="username"
            aria-required="true"
          />

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
            placeholder="At least 6 characters"
            fullWidth
            required
            autoComplete="new-password"
            aria-required="true"
          />

          <Input
            type="password"
            label="Confirm Password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your password"
            fullWidth
            required
            autoComplete="new-password"
            aria-required="true"
          />

          <Button type="submit" fullWidth disabled={isLoading} aria-busy={isLoading}>
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </form>

        <div className={styles.authFooter}>
          <p className={styles.authLink}>
            Already have an account?{' '}
            <Link href="/login" className={styles.link}>
              Log in
            </Link>
          </p>
        </div>

        <div className={styles.demoHint}>
          <strong>Demo tip:</strong> This is mock authentication. Any valid inputs will create a demo account.
        </div>
      </Card>
    </div>
  );
}
