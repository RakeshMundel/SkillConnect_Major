# SkillConnect — On-Demand Professional Services Marketplace

> A full-stack web application that bridges the gap between skilled professionals and customers, enabling seamless discovery, hiring, real-time communication, and secure payments — all in one platform.

---

## 📌 Problem Statement

Finding reliable, verified local professionals (electricians, plumbers, painters, etc.) is fragmented and trust-deficient. Customers rely on word-of-mouth or unverified classifieds, while skilled professionals lack a digital presence to showcase their expertise and attract clients.

**SkillConnect** solves this by providing a unified marketplace where professionals can build verified profiles and customers can discover, compare, hire, and pay — with complete transparency.

---

## 🎯 Objectives

- Provide a **centralized platform** for discovering and hiring skilled professionals across multiple service categories.
- Enable **secure, split payments** (1/3 deposit + 2/3 on completion) via Stripe to protect both parties.
- Facilitate **real-time communication** between clients and professionals through an integrated chat system.
- Build **trust and accountability** through verified profiles, ratings, reviews, and work-completion proof uploads.
- Deliver a **responsive, modern UI** with smooth animations and an intuitive user experience.

---

## ✨ Key Features

### 🔍 Smart Search & Discovery
- **Category-based browsing** — Men's Salon, Women's Salon, Electrician, Plumber, Painter, Pest Control, AC Repair, Water Purifier, and more.
- **Full-text search** across names, skills, categories, and locations with real-time results.
- **Top Professionals** section on the homepage showcasing highest-rated service providers.

### 👤 Professional Profiles
- Detailed profiles with **photo, skills, experience, certifications, pricing, and location**.
- Profile owners can **create, edit, and manage** their listing through a dedicated dashboard.
- **Membership tiers** — Basic (Free) and Pro ($5/month) with priority search listing and verified badge.

### 💳 Secure Stripe Payments (Split Payment Model)
- **1/3 initial deposit** paid at the time of booking to confirm the hire.
- **2/3 balance payment** released after the professional completes the task and uploads proof of work.
- Full **Stripe Checkout** integration with session management, success/cancel flows, and payment tracking.

### 💬 Real-Time Chat System
- **Firebase Firestore-powered** instant messaging between clients and professionals.
- **Online/offline status indicators** with `lastSeen` timestamps.
- Chat initiated directly from a professional's profile page.
- Persistent chat history with conversation list sidebar.

### 🤖 AI Chatbot Assistant
- Built-in intelligent chatbot to guide users through the platform.
- Helps with navigation, answering FAQs, and recommending services.

### 📋 Booking & Hiring Management
- **My Bookings** dashboard for professionals to view incoming jobs, scheduled dates/times, and mark tasks as complete.
- **Hired Professionals** dashboard for clients to track active hires, view completion proofs, and make balance payments.
- **In-app notifications** when a professional completes a task — prompting the client to review and pay.

### 🔐 Authentication & Security
- **Firebase Authentication** with Google Sign-In (OAuth 2.0).
- Protected routes and user-specific data access.
- Sensitive credentials managed via environment variables.

### 🖼️ Cloud Image Management
- **Cloudinary** integration for persistent profile photo and work-proof image storage.
- Images survive server restarts (critical for Render deployments).

### ⚡ Performance Optimizations
- **Lazy loading** of all page components with React Suspense.
- **Animated route transitions** using Framer Motion.
- **API projection queries** to minimize payload size.
- **Keep-alive pings** to prevent Render cold starts.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                         │
│                                                                 │
│  ┌───────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  React + Vite │  │ React Router │  │   Framer Motion      │  │
│  │  (Frontend)   │  │ (Navigation) │  │   (Animations)       │  │
│  └───────┬───────┘  └──────┬───────┘  └──────────────────────┘  │
│          │                 │                                     │
│  ┌───────▼─────────────────▼───────────────────────────────────┐│
│  │              Firebase SDK (Auth + Firestore)                ││
│  │         Google Sign-In  |  Real-Time Chat  |  Presence      ││
│  └─────────────────────────────────────────────────────────────┘│
└──────────────────────────────┬──────────────────────────────────┘
                               │ REST API Calls
                               ▼
┌──────────────────────────────────────────────────────────────────┐
│                     BACKEND (Express.js)                         │
│                                                                  │
│  ┌──────────────┐  ┌───────────────┐  ┌───────────────────────┐  │
│  │  Profile API  │  │  Hiring API   │  │  Payment API (Stripe) │  │
│  │  (CRUD)       │  │  (Bookings)   │  │  (Checkout Sessions)  │  │
│  └──────┬────────┘  └──────┬────────┘  └──────────┬────────────┘  │
│         │                  │                      │               │
│  ┌──────▼──────────────────▼──────────────────────▼─────────────┐ │
│  │                    Mongoose ODM                               │ │
│  └──────────────────────────┬────────────────────────────────────┘ │
└─────────────────────────────┬─────────────────────────────────────┘
                              │
              ┌───────────────▼───────────────┐
              │       MongoDB Atlas           │
              │  (Profiles, Hirings, Reviews, │
              │   Notifications, Payments)    │
              └───────────────────────────────┘

              ┌───────────────────────────────┐
              │        Cloudinary CDN         │
              │   (Profile Images, Work       │
              │    Completion Proofs)         │
              └───────────────────────────────┘

              ┌───────────────────────────────┐
              │     Stripe Payment Gateway    │
              │   (Checkout, Webhooks,        │
              │    Session Management)        │
              └───────────────────────────────┘
```

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19 + Vite 7 | SPA with fast HMR and modern JSX |
| **Routing** | React Router v7 | Client-side hash-based routing |
| **Animations** | Framer Motion | Page transitions and micro-interactions |
| **Styling** | Vanilla CSS + Bootstrap 5 | Custom responsive design system |
| **Icons** | React Icons | Consistent iconography (FontAwesome, etc.) |
| **Maps** | React Leaflet + Google Maps API | Location services and map rendering |
| **Backend** | Express.js 5 (Node.js) | RESTful API server |
| **Database** | MongoDB Atlas + Mongoose 9 | NoSQL document storage with schema validation |
| **Authentication** | Firebase Auth (Google OAuth) | Secure user identity management |
| **Real-Time Chat** | Firebase Firestore | Instant messaging and presence tracking |
| **Payments** | Stripe Checkout API | Secure split-payment processing |
| **Image Storage** | Cloudinary | Persistent cloud image hosting and CDN |
| **Deployment** | Render (Backend) + Render Static (Frontend) | Production hosting with CI/CD |
| **Monorepo** | NPM Workspaces | Unified dependency management |

---

## 📊 Database Schema (MongoDB)

### Profile Collection
| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Unique identifier |
| `name` | String | Professional's full name |
| `image` | String | Cloudinary image URL |
| `category` | String | Service category (Electrician, Plumber, etc.) |
| `description` | String | Bio / service description |
| `owner` | String | Firebase UID (links to auth) |
| `location` | String | City, State |
| `phone` | Number | Contact number |
| `skills` | String | Comma-separated skill tags |
| `experience` | Number | Years of experience |
| `certificate` | String | Professional certification |
| `rating` | Number | Average rating (1–5) |
| `price` | Number | Hourly/service fee in USD |
| `membership` | Enum | `Basic` or `Pro` |
| `earnings` | Number | Total earnings on platform |
| `reviews` | [ObjectId] | References to Review documents |

### Hiring Collection
| Field | Type | Description |
|-------|------|-------------|
| `userId` | String | Client's Firebase UID |
| `professionalId` | String | Professional's Firebase UID |
| `professionalName` | String | Display name |
| `amount` | Number | Initial deposit amount (1/3) |
| `scheduledDate` | String | Booking date |
| `scheduledTime` | String | Booking time slot |
| `status` | Enum | `deposit_paid` → `fully_paid` |
| `completionImage` | String | Proof-of-work photo URL |
| `completedAt` | Date | Task completion timestamp |

### Notification Collection
| Field | Type | Description |
|-------|------|-------------|
| `userId` | String | Recipient's Firebase UID |
| `senderId` | String | Sender's Firebase UID |
| `title` | String | Notification heading |
| `message` | String | Notification body |
| `link` | String | Deep link to relevant page |
| `read` | Boolean | Read status |

---

## 🔄 Application Workflow

### For Customers (Hiring Flow)
```
Browse/Search → View Profile → Chat with Professional → Hire & Pay 1/3 Deposit
     → Professional Completes Work → Upload Proof → Client Receives Notification
     → Client Reviews Proof → Pays Remaining 2/3 Balance → Transaction Complete ✅
```

### For Professionals (Service Flow)
```
Sign Up → Create Profile (Name, Skills, Photo, Price) → Get Listed on Platform
     → Receive Hire Notification → Chat with Client → Perform Service
     → Upload Completion Proof → Receive Balance Payment → Earnings Updated 💰
```

---

## 🗂️ Project Structure

```
SkillConnect_Major/
├── package.json                  # Root monorepo config (NPM Workspaces)
│
├── frontend/                     # React + Vite Application
│   ├── src/
│   │   ├── App.jsx               # Root component with routing
│   │   ├── main.jsx              # Entry point
│   │   ├── firebase.js           # Firebase config (Auth + Firestore)
│   │   ├── config.js             # API base URL configuration
│   │   │
│   │   ├── Context/
│   │   │   ├── AuthContext.jsx    # Firebase auth state + online presence
│   │   │   └── Context.jsx       # App-level shared state
│   │   │
│   │   ├── Components/
│   │   │   ├── Navbar/           # Navigation bar with search
│   │   │   ├── Footer/           # Site footer
│   │   │   ├── Category/         # Service category cards
│   │   │   ├── Professionals/    # Professional listing grid
│   │   │   ├── Profile/          # Profile detail view
│   │   │   ├── YourProfilePage/  # User's own profile dashboard
│   │   │   ├── EditProfile/      # Profile edit form
│   │   │   ├── ProviderForm/     # New provider registration
│   │   │   ├── Chat/             # Real-time messaging (ChatPage, ChatList, Chat)
│   │   │   ├── ChatBot/          # AI-powered assistant chatbot
│   │   │   ├── DescriptionBox/   # Professional description display
│   │   │   ├── ProPageDisplay/   # Professional page layout
│   │   │   ├── RelatedServices/  # Related service suggestions
│   │   │   ├── SocialProof/      # Trust badges and stats
│   │   │   ├── TrustSection/     # Trust & safety information
│   │   │   └── Breadcrums/       # Navigation breadcrumbs
│   │   │
│   │   └── pages/
│   │       ├── Home.jsx           # Landing page
│   │       ├── LoginSignup.jsx    # Authentication page
│   │       ├── ProCategory.jsx    # Category listing page
│   │       ├── ProPage.jsx        # Individual professional page
│   │       ├── SearchResults.jsx  # Search results page
│   │       ├── HiredProfessionals.jsx  # Client's hiring dashboard
│   │       ├── MyBookings.jsx     # Professional's bookings
│   │       ├── Membership.jsx     # Subscription plans page
│   │       ├── AccountSettings.jsx # User settings
│   │       ├── Success.jsx        # Payment success (confetti 🎉)
│   │       └── Cancel.jsx         # Payment cancelled
│   │
│   └── package.json               # Frontend dependencies
│
├── backend/                       # Express.js API Server
│   ├── index.js                   # Server entry — all API routes
│   ├── models/
│   │   ├── profile.js             # Professional profile schema
│   │   ├── hiring.js              # Hiring/booking schema
│   │   ├── notification.js        # In-app notifications schema
│   │   ├── review.js              # Review & ratings schema
│   │   ├── payment.js             # Payment records schema
│   │   ├── booking.js             # Booking details schema
│   │   └── user.js                # User account schema
│   │
│   ├── migrate_to_cloudinary.js   # Image migration script
│   └── package.json               # Backend dependencies
│
└── .gitignore                     # Ignoring node_modules, .env, uploads
```

---

## 🚀 API Endpoints

| Method | Endpoint | Description |
|--------|---------|-------------|
| `GET` | `/` | Health check |
| `GET` | `/allprofiles` | Fetch all professional profiles |
| `GET` | `/topprofessional` | Top-rated professionals (homepage) |
| `GET` | `/search?query=...` | Search profiles by name, skill, category, location |
| `GET` | `/propage/:id` | Get single professional profile |
| `GET` | `/profiles/category/:category` | Filter by service category |
| `GET` | `/myprofile/:uid` | Get profile by Firebase UID |
| `POST` | `/myprofile/upsert` | Create or update own profile |
| `POST` | `/addprofile` | Add new professional profile |
| `POST` | `/removeprofile` | Delete a profile |
| `PUT` | `/updateprofile/:id` | Update profile fields |
| `POST` | `/upload` | Upload image to Cloudinary |
| `POST` | `/create-checkout-session` | Create Stripe checkout (1/3 deposit) |
| `POST` | `/create-balance-checkout-session` | Create Stripe checkout (2/3 balance) |
| `GET` | `/retrieve-session/:sessionId` | Get Stripe session details |
| `POST` | `/record-hiring` | Record a new hiring transaction |
| `GET` | `/hired-professionals/:userId` | Client's hired professionals |
| `GET` | `/my-bookings/:professionalId` | Professional's incoming bookings |
| `POST` | `/complete-task` | Mark task complete + upload proof |
| `POST` | `/mark-fully-paid` | Mark hiring as fully paid |
| `GET` | `/check-hiring/:userId/:profileId` | Check if already hired |
| `GET` | `/notifications/:userId` | Get user notifications |
| `POST` | `/notifications/read` | Mark notification as read |

---

## 💰 Payment Flow (Stripe Integration)

```
┌──────────┐     1/3 Deposit      ┌──────────────┐
│  Client   │ ──────────────────► │  Stripe      │
│           │                     │  Checkout    │
└────┬──────┘                     └──────┬───────┘
     │                                   │
     │  ◄── Redirect to Success Page ────┘
     │
     │  Hiring record created (status: deposit_paid)
     │  Professional receives notification
     │
     ▼  ... Professional completes work ...
     
┌──────────┐     2/3 Balance      ┌──────────────┐
│  Client   │ ──────────────────► │  Stripe      │
│           │                     │  Checkout    │
└────┬──────┘                     └──────┬───────┘
     │                                   │
     │  Hiring status → fully_paid       │
     │  Professional earnings updated    │
     └───────────────────────────────────┘
```

---

## 🖥️ Screenshots & UI Highlights

- **Landing Page** — Hero section with service categories, top professionals carousel, trust badges, and social proof statistics.
- **Search** — Real-time search with results across names, categories, skills, and locations.
- **Professional Profile** — Detailed view with photo, skills, experience, certifications, hire button, and chat initiation.
- **Real-Time Chat** — Split-pane chat interface with conversation list and message area.
- **Hiring Dashboard** — Track active hires, view completion proofs, and manage payments.
- **My Bookings** — Professional's view of incoming jobs with scheduled dates and completion workflow.
- **Membership Page** — Side-by-side Basic vs Pro tier comparison with Stripe-powered upgrade.
- **Payment Success** — Confetti animation on successful payment with booking confirmation.

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- npm v9+
- MongoDB Atlas account
- Firebase project (Auth + Firestore enabled)
- Stripe account (test/live keys)
- Cloudinary account

### 1. Clone & Install
```bash
git clone https://github.com/your-username/SkillConnect_Major.git
cd SkillConnect_Major
npm install
```

### 2. Backend Environment Variables
Create `backend/.env`:
```env
PORT=4000
MONGODB_URI=your_mongodb_atlas_connection_string
STRIPE_SECRET_KEY=your_stripe_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:5173
```

### 3. Run the Application
```bash
# Start both frontend and backend concurrently
npm run dev

# Or separately
npm run frontend    # React dev server on :5173
npm run backend     # Express API on :4000
```

---

## 🌐 Deployment

| Service | Platform | URL |
|---------|---------|-----|
| Frontend | Render (Static Site) | `https://skillconnect-frontend-static.onrender.com` |
| Backend | Render (Web Service) | Configured via `RENDER_EXTERNAL_URL` |
| Database | MongoDB Atlas | Cloud-hosted cluster |
| Images | Cloudinary CDN | Global edge delivery |

---

## 📈 Future Scope

- [ ] **AI-Powered Recommendations** — Suggest professionals based on user history and preferences.
- [ ] **Review & Rating System** — Star ratings and written reviews after service completion.
- [ ] **Google Maps Integration** — Find nearby professionals with map-based search.
- [ ] **Push Notifications** — Browser/mobile push for booking updates.
- [ ] **Admin Dashboard** — Platform analytics, user management, and dispute resolution.
- [ ] **Multi-Language Support** — Localization for regional adoption.
- [ ] **Mobile App** — React Native version for iOS and Android.

---

## 👥 Team

| Name | Role |
|------|------|
| Rashi | Full-Stack Developer & Project Lead |

---

## 📄 License

This project was developed as a **Major Project** for academic purposes.

---

<p align="center">
  <b>SkillConnect</b> — Connecting Skills with Opportunities 🚀
</p>
