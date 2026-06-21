# LegalEase – Online Lawyer Hiring Platform

**LegalEase** is a full-stack digital marketplace that connects clients and businesses with verified legal professionals. Users can browse, discover, and hire lawyers across multiple specializations, while lawyers can manage their services and track inbound cases. An admin dashboard provides complete oversight of users, transactions, and platform analytics.

**Live Frontend:** [https://legalease-lawyer-hiring-platform.netlify.app/](https://legalease-lawyer-hiring-platform.netlify.app/)

**Live Backend:** [https://legalease-online-lawyer-hiring-platform.onrender.com/](https://legalease-online-lawyer-hiring-platform.onrender.com/)

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

For the deployed Render backend, use:

```env
NEXT_PUBLIC_API_URL=https://legalease-online-lawyer-hiring-platform.onrender.com/api
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

- **Live Frontend:** [Netlify Deployment](https://legalease-lawyer-hiring-platform.netlify.app/)
- **Live Backend:** [Render Deployment](https://legalease-online-lawyer-hiring-platform.onrender.com/)
- **Client Repository:** [GitHub – Client](https://github.com/kazolhabib/LegalEase-Online-Lawyer-Hiring-Platform)
- **Server Repository:** [GitHub – Server](https://github.com/kazolhabib/LegalEase-Online-Lawyer-Hiring-Platform-Server)

---

## Evaluation & Testing (For Mentors)

To verify the platform's features, role-based workflows, and database updates, you can use the credentials and steps below.

### 1. Test Credentials (Password: `123456` for all)

* **Admin Role:** `admin@gmail.com`
* **Client/User Role:** `client@gmail.com`
* **Lawyer Role:** `rezwan@legalease.com` (Advocate Rezwanul Haque)

### 2. Manual Testing Flow
1. **Reset Database:** Run `node seed.js` in the backend server directory to restore clean seed data.
2. **Initiate Hiring:** Log in as Client (`client@gmail.com`), browse/search for Advocate Rezwanul Haque, visit his profile, and click **Initiate Hiring Case** -> **Confirm Hire**.
3. **Accept Request:** Log in as Lawyer (`rezwan@legalease.com`), visit the **Dashboard** -> **Inbound Consultations**, and click **Accept**.
4. **Complete Payment:** Log in as Client, visit **Dashboard** -> **Hiring History**, and click **Mock Pay** (this changes status to `Paid` and updates lawyer status to `Busy`).
5. **Admin Analytics:** Log in as Admin (`admin@gmail.com`) and visit `/dashboard/admin/analytics` to view system charts and statistics.

### 3. Automated E2E Testing
An automated test runner is included in the project root to perform the entire E2E flow via Puppeteer.
1. Make sure both client and server are running.
2. Launch Chrome with debugging port 9222 active.
3. Run the following command in the client directory:
   ```bash
   node run-test.js
   ```

---

## License 

This project is licensed under the ISC License.
