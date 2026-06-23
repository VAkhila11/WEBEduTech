# EDUTech - Career Guidance & College Predictor Platform

EDUTech is India's most comprehensive, world-class career guidance platform for Intermediate/Class 12 students. It helps students explore courses, career paths, colleges, entrance exams, and scholarships while providing flagship features like a B.Tech/MBBS admission **College Predictor** and a GPT-powered **AI Career Counselor**.

---

## 🚀 Key Features

1. **Stream-wise Exploration**: Detailed directories for MPC, BiPC, MEC, CEC, and HEC streams.
2. **Flagship College Predictor**: Inputs rank, category, gender, and stream to evaluate SAFE, MODERATE, and DREAM colleges with interactive Admission Probability meters and historic cutoff trend lines.
3. **AI Career Counselor**: Markdown-enabled chat assistant that plots personalized career paths and generates visual node roadmaps.
4. **Scholarship Matcher**: Matching logic comparing demographic category, state, and family income to government and private scholarship opportunities.
5. **Interactive College Directory**: Rich campus profiles detailing placements, hostel guidelines, and Google Map overlays.
6. **Student Forum**: Peer Q&A and senior college reviews.
7. **PWA Support**: Full PWA support allowing students to install the platform as a mobile app.
8. **Admin Panel**: Statistics dashboard tracking user counts, popular searches, and caste demographic charts.

---

## 🛠️ Technology Stack

* **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Framer Motion, Zustand, Recharts.
* **Backend**: Node.js, Express.js, TypeScript, Prisma ORM, PostgreSQL (Supabase), JWT.
* **Pipeline**: GitHub Actions CI/CD, PWA, custom integration test suites.

---

## 📁 Repository Structure

```text
EDUTech_Web/
├── .github/workflows/
│   └── ci.yml               # GitHub Actions CI workflow
├── client/                  # Next.js 15 App Router Frontend
│   ├── app/
│   │   ├── components/      # Navigation navbar, footers, comparisons
│   │   ├── admin/           # Admin panel & charts
│   │   ├── ai-counselor/    # AI advisor chat and node graphs
│   │   ├── colleges/        # College listings and location maps
│   │   ├── courses/         # Course catalogs and roadmaps
│   │   ├── login/           # Authentication forms
│   │   ├── predictor/       # Admission evaluations & graphs
│   │   └── scholarships/    # Scholarship matches
│   └── public/
│       └── manifest.json    # PWA install settings
├── server/                  # Express.js + Prisma Backend
│   ├── prisma/
│   │   └── schema.prisma    # PostgreSQL Prisma models
│   └── src/
│       ├── routes/          # Auth, predictor, AI, explorer routes
│       ├── db.ts            # Prisma client + mock data fallbacks
│       └── mockData.ts      # Core seed mock database
└── tests/
    └── api.test.js          # API Integration test suite
```

---

## ⚡ Setup & Local Development

### 1. Prerequisite
Ensure [Node.js (v20+)](https://nodejs.org/) is installed.

### 2. Set Up Express Backend
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Create a `.env` file and declare your PostgreSQL connection string:
   ```env
   DATABASE_URL="postgresql://user:pass@host:5432/dbname?schema=public"
   JWT_SECRET="edutech_jwt_secret"
   PORT=5000
   ```
   *Note: If no database URL is set, the application will automatically fall back to the in-memory mock dataset so the platform remains fully functional for demonstration purposes.*
3. Install dependencies:
   ```bash
   npm install
   ```
4. Seed and compile:
   ```bash
   # Generate Prisma client
   npx prisma generate
   # Run local developer server
   npm run dev
   ```
   The backend server starts at `http://localhost:5000`.

### 3. Set Up Next.js Frontend
1. Navigate to the client folder:
   ```bash
   cd ../client
   ```
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Run dev server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## 🧪 Running Integration Tests

Ensure the Express backend is running on `http://localhost:5000`, then run:
```bash
node tests/api.test.js
```
This runs the integration suite verifying auth controllers, predictor rank evaluations, scholarships matching, and AI counselor chat systems.

---

## 🌐 Deployment Details

1. **Frontend (Vercel)**: Automatically deploys Next.js 15 via the Vercel GitHub integration. Ensure you configure `NEXT_PUBLIC_API_URL` pointing to your hosted Express instance.
2. **Backend (Railway)**: Deploy the `server/` directory to Railway. The engine will read the `DATABASE_URL` environment variable to connect to Supabase.
3. **Database (Supabase)**: Create a free PostgreSQL instance in Supabase and paste the connection string into the Railway environment. Run `npx prisma db push` to initialize the database tables.
