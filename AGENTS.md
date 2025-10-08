# TODO

[x] Make the .env reach ./app/server/services/auth/auth-client.ts
[x] setup basic screens for landingpage, auth, and dashboard
[x] Setup endpoints and middlewares correctly for better auth
[x] Implement email/password authentication
[x] Implement session management

[x] Implement i18n
[x] Implement shadcn ui
[x] Implement multi color
[x] Implement dark mode
[x] Error pages

# Project Overview

## File Structure
- **App Router Structure**: Next.js 15 with App Router in `src/app/[locale]/` for internationalized routes.
- **Authentication**: Better Auth setup in `src/server/services/auth/` with Prisma adapter.
- **Database**: Prisma schema in `prisma/schema.prisma` with PostgreSQL, models for User, Session, Account, Verification.
- **UI Components**: shadcn/ui components in `src/components/ui/`, theme management in `src/components/theme/`.
- **Internationalization**: next-intl setup in `src/i18n/` with support for en, es, fr.
- **Middleware**: Session and i18n handling in `src/middleware.ts`.
- **Error Handling**: Custom error pages in `src/components/errors/`.

## Technologies Used
- **Framework**: Next.js 15.5.3 (App Router)
- **UI Library**: React 19.1.0
- **Database ORM**: Prisma 6.16.1 with PostgreSQL
- **Authentication**: Better Auth 1.3.9 (email/password, Google OAuth)
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI and shadcn/ui
- **Internationalization**: next-intl 4.3.9
- **Theme Management**: next-themes 0.4.6
- **Icons**: Lucide React 0.544.0
- **Validation**: Zod 4.1.9
- **Notifications**: Sonner 2.0.7
- **Development Tools**: TypeScript, ESLint, Husky for git hooks

## Implementation Details
- **Authentication**: Implemented email/password and Google OAuth using Better Auth with Prisma adapter. Session management via middleware redirects.
- **Internationalization**: Multi-language support (en, es, fr) using next-intl, with locale-specific layouts and routing.
- **UI/Theming**: shadcn/ui components with Tailwind CSS, dark mode toggle using next-themes, color selector for multi-color themes.
- **Database**: PostgreSQL with Prisma for type-safe queries, migrations managed via Prisma CLI.
- **Error Handling**: Custom error pages for 401, 403, 404, 500, 503.
- **Development**: Git hooks with Husky, commit linting, semantic release.

## Core Context
This is a mini chat application built with Next.js, featuring user authentication, a dashboard, internationalization, and a modern UI with dark mode support. The app uses a PostgreSQL database for user and session data, with Better Auth handling secure authentication flows.
