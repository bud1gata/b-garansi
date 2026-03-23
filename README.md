# Warranty & Service Tracker (WST)

A comprehensive web platform that empowers users to easily archive purchase receipts, automatically monitor real-time warranty expirations, and meticulously log the maintenance history of their personal assets and devices.

## Features
- **Asset Management**: Seamlessly add devices (laptops, phones, cameras, vehicles) alongside purchase dates and warranty durations.
- **Smart Warranty Tracking**: The dashboard clearly visualizes remaining warranty durations via a simple traffic-light color system (Green = Active, Yellow = Expiring soon, Red = Expired).
- **Service Logging**: Keep track of every repair, exactly what the issue was, and how much it cost over time.
- **Digital Receipt Vault**: Upload photos/PDFs of your purchase receipts to a secure lightbox viewer so you never lose them when claiming warranties.
- **Secure Authentication**: Built-in user registration and JWT-based session management to keep your asset data private.
- **Admin Approval Workflow**: An exclusive Admin dashboard ensures total platform security by requiring manual approval for new users before they can access the application.

## Tech Stack
**Frontend:**
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS (Modern Glassmorphism UI)
- **Icons & Tooling:** Lucide React, date-fns

**Backend:**
- **Framework:** Node.js + Express.js
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JSON Web Tokens (JWT) + bcryptjs
- **File Uploads:** Multer (Local storage processing)

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16.x or newer recommended)
- A [MongoDB Cluster URI](https://www.mongodb.com/) for the backend `.env` file.

### Installation

1. **Clone or navigate to the project repository**
```bash
cd b-garansi
```

2. **Install Frontend Dependencies** (at the root level)
```bash
npm install
```

3. **Install Backend Dependencies**
```bash
cd backend
npm install
```

### Environment Configuration
Ensure you have the following `.env` files created based on the examples:

**1. Root (`/b-garansi/.env.local` for Next.js)**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**2. Backend (`/b-garansi/backend/.env` for Express)**
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/?appName=cluster
JWT_SECRET=supersecretjwtkey123
```

---

## 💻 Running the Application

To run the application locally, you'll need to spin up both the Frontend and the Backend simultaneously. The easiest way is to open two separate terminal windows.

**Terminal 1 (Backend Server)**
```bash
cd backend
npm run dev
```
*(The API will start listening on `http://localhost:5000`)*

**Terminal 2 (Frontend Server)**
```bash
# From the project root (b-garansi)
npm run dev
```
*(The UI will compile and become available at `http://localhost:3000`)*

You can now navigate your browser to **[http://localhost:3000](http://localhost:3000)** to register your first account!

> [!IMPORTANT]
> **Admin Account Setup:** By default, new users cannot log in until an Administrator approves their account. To claim the Admin role, you must create your very first account using the exact email address: **`admin@wst.com`**. This specific email will automatically trigger the system to grant you full "Admin Dashboard" access where you can approve all subsequent users.

---

## Folder Structure
```text
b-garansi/                # Next.js Frontend Root
├── app/                  # App Router Pages & Layouts
├── components/           # Reusable React components (UI, Items, Navbar)
├── context/              # React Context (AuthContext)
├── lib/                  # Utilities (API fetch wrapper)
├── backend/              # Express.js API Sub-folder
│   ├── controllers/      # API logic (Items, Services, Auth)
│   ├── models/           # Mongoose schemas
│   ├── routes/           # Express routers
│   ├── middleware/       # JWT token auth & Multer upload config
│   ├── uploads/          # Locally hosted digital receipt images
│   └── server.js         # Backend Entry Point
└── README.md
```

---

## 📬 Contact
For any inquiries, feel free to reach out to the project creator:
- **Email:** [me@budiputra.web.id](mailto:me@budiputra.web.id)
