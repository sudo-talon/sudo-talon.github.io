# Welcome to Engr. Ikerionwu Ifeanyi Fredrick
## DevOps | Cloud Architect Portfolio Project 

**URL**: https://sudo-talon.github.io

Overview

- A modern, secure portfolio application with an admin dashboard for managing content (projects, experience, achievements, publications, certifications and testimonials etc).
- Built with a performant React + Vite stack, styled with Tailwind and shadcn/ui, and backed by Supabase for auth, data, and Edge Functions.
Key Features

- Public landing page with polished UI and responsive layout.
- Auth flow with login, signup, password reset, basic brute-force mitigation, and a human-verification checkbox.
- Admin dashboard with CRUD managers for portfolio entities and sorted display order.
- Server-side validation and audit logging for project write operations via a Supabase Edge Function.
- SPA-friendly production routing on Vercel for deep links (e.g., /login , /admin ).
Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, shadcn/ui
- State & UX: React Hook Form, Radix UI components, Sonner/Toaster for notifications
- Data & Auth: Supabase 
- Serverless: Supabase Edge Functions 
- Deployment: Vercel
Architecture

- Routing: BrowserRouter with routes for / , /login , /admin , .
- Admin managers use Supabase tables and an Edge Function for secure writes:
  - Edge Function:  (Zod validation, admin role check, audit logs)
  - Audit logs migration: supabase/migrations
- SPA rewrites for Vercel to support client-side routes:
  - vercel.json rewrites all paths to / to prevent 404 on deep links.
Security

- Auth required for admin access; role lookup in user_roles table before allowing writes.
- Server-side payload validation with Zod to prevent malformed data.
- Audit logs written to admin_audit_logs for insert/update/delete actions on projects .
- Supabase Row Level Security recommended/enforced for sensitive tables.
- No secrets committed; .env is gitignored ( .gitignore:25 ).
Local Development

- Start dev server: npm run dev (default at http://localhost:8080/ )
- Lint: npm run lint
- Build: npm run build
- Preview build: npm run preview
## Can I connect a custom domain to my portfolio project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: https://sudo-talon.github.io
