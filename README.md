# UGA Job & Opportunity Tracker

A Next.js web application for UGA students to discover, track, and manage job applications in Athens, GA. Built with TypeScript, React hooks, and CSS Modules.

## Project Overview

This is the **frontend-only** implementation of the Athens/UGA Job & Opportunity Tracker. It demonstrates:

- Complete UI/UX for job search and application tracking
- Mock authentication and data management
- Protected UI patterns (show/hide features based on auth state)
- Responsive design with mobile-first approach
- Accessibility features (ARIA labels, keyboard navigation, focus management)
- Dynamic rendering with React hooks (useState, useEffect, useContext)

## Tech Stack

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Styling:** CSS Modules
- **State Management:** React Context API (useContext, useState, useEffect)
- **Components:** Functional components with composition via children prop

## Project Structure

```
├── app/
│   ├── layout.tsx              # Root layout with Navbar
│   ├── page.tsx                # Splash page (home)
│   ├── login/page.tsx          # Login form
│   ├── signup/page.tsx         # Signup form
│   ├── jobs/
│   │   ├── page.tsx            # Jobs listing with search/filters
│   │   └── [id]/page.tsx       # Job detail (dynamic route)
│   ├── applications/page.tsx   # Applications tracker
│   └── not-found.tsx           # Custom 404 page
├── components/
│   ├── Navbar.tsx              # Auth-aware navigation
│   ├── Card.tsx                # Reusable card with children prop
│   ├── Button.tsx              # Button component
│   ├── Input.tsx               # Input component
│   ├── Select.tsx              # Select dropdown
│   ├── Badge.tsx               # Status badges
│   ├── JobCard.tsx             # Job listing card
│   └── ApplicationCard.tsx     # Application card with status
├── contexts/
│   ├── AuthContext.tsx         # Mock authentication state
│   └── DataContext.tsx         # Mock jobs & applications data
└── styles/
    ├── globals.css             # Global styles & CSS variables
    └── *.module.css            # Component/page-specific styles
```

## Features

### Core Requirements Met

✅ **Splash Page**: Hero section with UGA theme, project description, and CTA buttons
✅ **Responsive Layout**: Mobile-first design with flexbox/grid
✅ **Auth-Aware Navbar**: Shows "Welcome, {username}" + Logout when logged in, Login/Signup when logged out
✅ **Reusable Card**: Uses children prop for composition
✅ **Custom 404**: Friendly not-found page with navigation
✅ **Dynamic Rendering**: Uses .map for jobs and applications lists
✅ **Protected UI**: Add/Edit/Delete buttons shown only when logged in
✅ **Async Behavior**: Loading spinners, empty states, error messages
✅ **External API Mock**: Job search with filters (ready for Adzuna/JSearch/USAJOBS)

### Pages & Routes

- **/** - Splash page with hero, features, and about section
- **/login** - Login form with validation
- **/signup** - Signup form with password confirmation
- **/jobs** - Browse jobs with search bar and filters (type, location)
- **/jobs/[id]** - Job detail page with "Add to Applications" button
- **/applications** - Track applications with status (applied, interview, offer, rejected)
- **/404** - Custom not-found page

### Protected Actions

- **Logged Out**: View jobs, see "Login to save" prompts, all mutation buttons disabled
- **Logged In**: Save jobs, track applications, edit status, add notes, delete applications

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Testing Authentication

**Mock authentication is active.** To test:

1. **Sign Up**: Use any username, email, and password (6+ characters)
2. **Log In**: Use any email and password (6+ characters)
3. **Toggle State**: Log out and log back in to see protected UI changes

The mock user is stored in `localStorage` so it persists across page refreshes during development.

### Testing Features

1. **Browse Jobs**: Go to `/jobs` and use search/filters
2. **View Job Details**: Click any job card
3. **Save Job** (requires login): Click "Save Job" or "Add to Applications"
4. **Track Applications**: Go to `/applications` to see saved jobs
5. **Update Status**: Change application status (applied → interview → offer)
6. **Add Notes**: Click "Add Notes" on any application
7. **Delete Application**: Click "Delete Application" (click twice to confirm)

## Integration Points for Backend

When ready to connect to Node.js + MongoDB backend, replace these mock implementations:

### Authentication (contexts/AuthContext.tsx)

```typescript
// TODO: Replace mock login with real API call
const login = async (email: string, password: string) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include', // for httpOnly cookies
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const user = await response.json();
  setUser(user);
};
```

- Replace `localStorage` with httpOnly cookies for secure auth
- Add middleware for route protection in `middleware.ts`
- Handle 401/403 responses and redirect to login

### Data Fetching (contexts/DataContext.tsx)

```typescript
// TODO: Replace mock searchJobs with external API or /api/jobs
const searchJobs = async (query: string, filters?: JobFilters) => {
  const params = new URLSearchParams({ query, ...filters });
  const response = await fetch(`/api/jobs/search?${params}`);

  if (!response.ok) {
    throw new Error('Failed to fetch jobs');
  }

  const jobs = await response.json();
  setJobs(jobs);
};

// TODO: Replace addApplication with POST to /api/applications
const addApplication = async (jobId: string) => {
  const response = await fetch('/api/applications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jobId }),
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to add application');
  }

  const application = await response.json();
  setApplications(prev => [...prev, application]);
};
```

### External API Integration

Integrate Adzuna, JSearch, or USAJOBS in `/api/jobs/search` route:

```typescript
// app/api/jobs/search/route.ts (Next.js API route)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  // Call external API (e.g., Adzuna)
  const response = await fetch(
    `https://api.adzuna.com/v1/api/jobs/us/search?app_id=${APP_ID}&app_key=${API_KEY}&what=${query}`
  );

  const data = await response.json();
  return Response.json(data.results);
}
```

## Accessibility

- Semantic HTML (nav, main, section, article)
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus management with visible outlines
- Color contrast meets WCAG AA standards
- Screen reader friendly (aria-live regions for dynamic updates)

## Responsive Design

Breakpoints:
- Mobile: < 768px (single column, hamburger menu)
- Tablet: 768px - 1024px (adaptive grid)
- Desktop: > 1024px (multi-column layout)

## Future Enhancements (Backend Integration)

- [ ] Real authentication with bcrypt + JWT/session cookies
- [ ] MongoDB schemas for User, Job, Application
- [ ] Protected API routes with auth middleware
- [ ] External API integration (Adzuna/JSearch/USAJOBS)
- [ ] Pagination for job results
- [ ] Email notifications for application updates
- [ ] Profile page with resume upload
- [ ] Admin dashboard for job posting management

## Course Requirements

This project satisfies all frontend requirements for the course project:

- ✅ Next.js App Router with TypeScript
- ✅ Responsive layout (flexbox/grid)
- ✅ Splash page with background image and description
- ✅ Navbar on every page with auth state ("Welcome, {username}")
- ✅ Reusable Card component with children prop
- ✅ Custom 404 not-found page
- ✅ Protected UI (show/hide based on auth)
- ✅ Dynamic rendering with .map
- ✅ useState, useEffect, useContext hooks
- ✅ Async/await with loading/error states
- ✅ External API mock (ready for integration)
- ✅ CSS Modules for styling
- ✅ Accessible (ARIA, keyboard navigation)

## Development Notes

- TypeScript errors on first run are expected until `npm install` completes
- The app uses mock data defined in `contexts/DataContext.tsx`
- Applications are stored in `localStorage` for demo purposes
- No backend is required to run the frontend
- All TODO comments mark integration points for the full-stack phase

## License

This project is for educational purposes as part of a university course.

---

**Built with ❤️ for UGA Bulldogs**
