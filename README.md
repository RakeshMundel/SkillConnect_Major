# SkillConnect Major Project

SkillConnect is a full-stack platform designed to connect professionals and clients efficiently. This project is structured as a monorepo using NPM Workspaces.

## 🚀 Project Structure

- `frontend/`: React + Vite application for the user interface.
- `backend/`: Express.js server and MongoDB integration.
- `package.json`: Root configuration managing both workspaces.

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- MongoDB account (Atlas or local)

### Installation

1. Clone the repository.
2. Install all dependencies from the **root directory**:
   ```bash
   npm install
   ```

### Configuration

Create a `.env` file in the `backend/` directory with the following variables:
```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
STRIPE_SECRET_KEY=your_stripe_key
GOOGLE_MAPS_API_KEY=your_google_maps_key
```

## 💻 Running the Project

You can run the frontend and backend simultaneously from the root directory:

- **Start both (Dev Mode):**
  ```bash
  npm run dev
  ```

- **Start Frontend only:**
  ```bash
  npm run frontend
  ```

- **Start Backend only:**
  ```bash
  npm run backend
  ```

## 🔒 Security

- Sensitive keys are managed via `.env` files.
- `node_modules` and `.env` files are excluded from git via `.gitignore`.

## 📈 Future Features

- [ ] Stripe Payment Integration
- [ ] Google Maps Location Service
- [ ] Real-time Chat
- [ ] Enhanced User Profiles
