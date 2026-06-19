# LegalEase – Online Lawyer Hiring Platform

**LegalEase** is a full-stack digital marketplace that connects clients and businesses with verified legal professionals. Users can browse, discover, and hire lawyers across multiple specializations, while lawyers can manage their services and track inbound cases. An admin dashboard provides complete oversight of users, transactions, and platform analytics.

 **Live URL:** [https://legalease-online-lawyer-hiring.vercel.app](https://legalease-online-lawyer-hiring.vercel.app)

---

## Key Features

- **JWT Authentication** – Secure email/password login and Google OAuth with role-based access (User, Lawyer, Admin).
- **Browse & Search Lawyers** – Advanced search with filters for specialization, fee range, availability, and sorting with paginated results.
- **Lawyer Details & Hiring** – Detailed lawyer profiles with hire confirmation modals, reviews, and comment systems.
- **Stripe & Mock Payment** – Integrated Stripe checkout for hiring fees with a sandbox mock-pay option for testing.
- **Role-Specific Dashboards** – Dedicated dashboard views for Users (hiring history, comments, profile), Lawyers (inbound requests, service management), and Admins (user management, transactions, analytics).
- **Dark Mode** – Persistent dark/light theme toggle with system preference detection.
- **Framer Motion Animations** – Hero carousel, staggered card reveals, and smooth page transitions.
- **Responsive Design** – Fully responsive layout optimized for mobile, tablet, and desktop viewports.
- **Custom 404 & Error Pages** – Branded error boundary and not-found pages.
- **Session Persistence** – Users remain logged in across page reloads on private routes.

---

## NPM Packages Used

### Client-Side (Next.js)

| Package | Purpose |
|---------|---------|
| `next` (v16) | React framework with App Router |
| `react` / `react-dom` (v19) | UI rendering library |
| `@heroui/react` / `@heroui/styles` | Component library for UI elements |
| `framer-motion` | Animation library for scroll reveals, transitions |
| `tailwindcss` (v4) | Utility-first CSS framework |
| `@tailwindcss/postcss` | PostCSS integration for Tailwind v4 |

### Server-Side (Express)

| Package | Purpose |
|---------|---------|
| `express` | Web server framework |
| `mongoose` | MongoDB ODM |
| `jsonwebtoken` | JWT token generation & verification |
| `bcryptjs` | Password hashing |
| `cors` | Cross-origin resource sharing |
| `dotenv` | Environment variable management |
| `stripe` | Payment processing integration |
| `nodemon` | Development auto-restart |

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)
- Stripe account (optional, mock-pay available)

### Client Setup

```bash
git clone https://github.com/kazolhabib/LegalEase-Online-Lawyer-Hiring-Platform.git
cd LegalEase-Online-Lawyer-Hiring-Platform
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

Run the development server:

```bash
npm run dev
```

### Server Setup

```bash
git clone https://github.com/kazolhabib/LegalEase-Online-Lawyer-Hiring-Platform-Server.git
cd LegalEase-Online-Lawyer-Hiring-Platform-Server
npm install
```

Create a `.env` file:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5001
```

Run the server:

```bash
npm run dev
```

---

## Links

- **Client Repository:** [GitHub – Client](https://github.com/kazolhabib/LegalEase-Online-Lawyer-Hiring-Platform)
- **Server Repository:** [GitHub – Server](https://github.com/kazolhabib/LegalEase-Online-Lawyer-Hiring-Platform-Server)

---

## License 

This project is licensed under the ISC License.
