# 7x Challenge - Habit Tracking App

A modern, full-stack habit tracking application built with Next.js that helps
you build better habits and track your progress over time.

## ✨ Features

### 🎯 Smart Habit Management

- Create and organize habits across 6 predefined categories:
  - **Health** - Physical and mental well-being habits
  - **Productivity** - Work and efficiency related habits
  - **Learning** - Education and skill development habits
  - **Personal** - Personal development and lifestyle habits
  - **Social** - Relationships and social interaction habits
  - **Creativity** - Creative and artistic pursuits
- Set target frequencies for each habit
- Enable/disable habits as needed

### 📊 Comprehensive Analytics

- **Progress Charts** - Beautiful visualizations showing completion rates and
  trends
- **Streak Tracking** - Monitor current and longest streaks
- **Completion Rates** - Overall and category-specific statistics
- **Daily Progress** - Track habits completed today vs. total habits
- **Calendar View** - Visual history of habit completions

### 🔐 Secure Authentication

- User registration and login system
- Secure session management with Better Auth
- Email verification support
- Password-based authentication

### 🎨 Modern UI/UX

- Responsive design that works on all devices
- Beautiful gradient backgrounds and modern styling
- Intuitive dashboard with habit cards
- Loading skeletons for better user experience
- Color-coded categories for easy identification

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Headless UI components
- **Lucide React** - Beautiful icons
- **Recharts** - Charts and data visualization

### Backend

- **Next.js API Routes** - Serverless API endpoints
- **Better Auth** - Modern authentication library
- **Drizzle ORM** - Type-safe SQL ORM
- **PostgreSQL** - Robust relational database (via Neon)
- **Zod** - Runtime type validation

### Development Tools

- **ESLint** - Code linting and formatting
- **Husky** - Git hooks for code quality
- **Drizzle Kit** - Database migrations and schema management
- **pnpm** - Fast, disk space efficient package manager

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- pnpm package manager
- PostgreSQL database (or Neon account)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/frer0t/7x-challenge.git
   cd 7x-challenge
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Fill in your environment variables:

   ```env
   # Database
   DATABASE_URL="your-postgresql-connection-string"

   # Auth
   BETTER_AUTH_SECRET="your-secret-key"
   BETTER_AUTH_URL="http://localhost:3000"
   ```

4. **Set up the database**

   ```bash
   # Generate migrations
   pnpm db:generate

   # Run migrations
   pnpm db:migrate

   # Seed categories
   pnpm db:seed
   ```

5. **Start the development server**

   ```bash
   pnpm dev
   ```

6. **Open your browser** Navigate to
   [http://localhost:3000](http://localhost:3000)

## 📱 Usage

### Getting Started

1. **Sign Up** - Create a new account or sign in
2. **Create Habits** - Add habits in different categories
3. **Track Daily** - Mark habits as complete each day
4. **View Progress** - Check your analytics and streaks
5. **Stay Consistent** - Build streaks and improve completion rates

### Dashboard Features

- **Habit Cards** - Quick overview of all your habits with completion status
- **Stats Overview** - Key metrics like total habits, completed today, and
  streaks
- **Quick Actions** - Add new habits or edit existing ones
- **Category Filtering** - View habits by specific categories

### Analytics

- **Progress Charts** - Visual representation of your habit completion over time
- **Category Breakdown** - See which categories you're excelling in
- **Streak Tracking** - Monitor your consistency and celebrate milestones
- **Calendar View** - Historical view of your habit completions

## 🗃️ Database Schema

### Core Tables

- **users** - User accounts and profiles
- **habits** - Individual habits with categories and settings
- **categories** - Predefined habit categories with colors and icons
- **habit_completions** - Daily completion records
- **sessions** - User authentication sessions

## 🔧 Available Scripts

```bash
# Development
pnpm dev          # Start development server with Turbopack
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint

# Database
pnpm db:generate  # Generate Drizzle migrations
pnpm db:migrate   # Run database migrations
pnpm db:push      # Push schema changes directly
pnpm db:studio    # Open Drizzle Studio
pnpm db:seed      # Seed default categories
```

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) for accessible UI components
- [Better Auth](https://www.better-auth.com/) for authentication
- [Drizzle ORM](https://orm.drizzle.team/) for the type-safe ORM
- [Neon](https://neon.tech/) for PostgreSQL hosting

---

Built with ❤️ by frerot.
