# 🌐 Webcraft Studio - Digital Agency Platform

**Production-ready digital agency website with microservices architecture**

Built with **React 18**, **Firebase**, **Firestore**, and **Cloud Functions** for maximum scalability and performance.

---

## ✨ Features

### 🌟 Public Features
- **Portfolio Showcase** - Dynamic project gallery with filtering
- **Service Display** - Editable service offerings with pricing
- **Booking System** - Clients book services directly
- **Testimonials** - User-generated reviews with ratings
- **Contact Forms** - WhatsApp integration + inquiry management
- **Responsive Design** - Mobile-first, works on all devices
- **SEO Optimized** - Built for search engines

### 🛠️ Admin Dashboard
- **Projects Management** - CRUD operations without code
- **Bookings Tracking** - View and manage all bookings
- **Inquiry Management** - Handle client inquiries
- **Review Moderation** - Approve/manage testimonials
- **Content Editor** - Edit all site content (text, images, links)
- **Analytics** - View stats and insights
- **Settings** - Configure everything

---

## 🏗️ Architecture

### Microservices Pattern

```
┌─────────────────────┐
│   React Frontend    │ (Vite + Tailwind)
│  Zustand + Query    │
└──────────┬──────────┘
           │ HTTP/CORS
           ↓
┌─────────────────────────────────────┐
│  Firebase Cloud Functions (Express)  │
├─────────────────────────────────────┤
│ ├─ Auth Service    │ ├─ Projects     │
│ ├─ Bookings        │ ├─ Reviews      │
│ ├─ Inquiries       │ ├─ Content      │
│ └─ Shared Utils    │                 │
└──────────┬──────────────────────────┘
           │ Admin SDK
           ↓
     ┌─────────────┐
     │  Firestore  │
     │  Database   │
     └─────────────┘
```

### Key Technologies

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + Vite | Fast, modular UI |
| **State** | Zustand + TanStack Query | Client & server state |
| **Styling** | Tailwind CSS + Framer Motion | UI & animations |
| **Backend** | Firebase Cloud Functions | Serverless compute |
| **Database** | Firestore | NoSQL, real-time |
| **Auth** | Firebase Auth | User authentication |
| **Hosting** | Vercel + Firebase | Production deployment |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm 8+
- Firebase CLI

### Installation

```bash
# Clone repository
git clone <repo-url>
cd webcraft-studio

# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env.local

# Start development
pnpm dev
```

For detailed setup, see [QUICK-START.md](./QUICK-START.md)

---

## 📁 Project Structure

```
webcraft-studio/
├── apps/frontend/              # React application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── pages/          # Page components
│   │   │   ├── admin/          # Admin dashboard
│   │   │   ├── sections/       # Home sections
│   │   │   ├── forms/          # Form components
│   │   │   └── common/         # Shared components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── store/              # Zustand stores
│   │   ├── config/             # Firebase & API setup
│   │   ├── services/           # API integration
│   │   └── styles/             # Global CSS
│   └── vite.config.js
│
├── services/                   # Backend microservices
│   ├── functions/
│   │   ├── auth/               # Authentication endpoints
│   │   ├── projects/           # Project CRUD API
│   │   ├── bookings/           # Bookings API
│   │   ├── reviews/            # Reviews API
│   │   ├── inquiries/          # Contact form API
│   │   ├── content/            # Site content API
│   │   ├── shared/             # Middleware & utils
│   │   └── index.js            # Express app
│   ├── firebase.json
│   └── package.json
│
├── docs/                       # Documentation
│   ├── QUICK-START.md
│   ├── SETUP-GUIDE.md
│   ├── API-DOCS.md
│   └── DATABASE-SCHEMA.md
│
├── package.json                # Root package
├── pnpm-workspace.yaml         # Workspace config
└── firebase.json               # Firebase config
```

---

## 🔧 Development

### Frontend Development

```bash
cd apps/frontend

# Start dev server (http://localhost:5173)
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run linter
pnpm lint
```

### Backend Development

```bash
cd services

# Start Firebase emulator (http://localhost:5001)
firebase emulators:start

# View emulator UI (http://localhost:4000)
# Deploy to production
firebase deploy --only functions

# View logs
firebase functions:log
```

### Monorepo Commands

```bash
# Install all dependencies
pnpm install

# Build all projects
pnpm build

# Start all dev servers
pnpm dev

# Run linter
pnpm lint

# Format code
pnpm format

# Clean everything
pnpm clean
```

---

## 📡 API Endpoints

### Base URL
- **Dev**: `http://localhost:5001/your-project-id/us-central1/api`
- **Prod**: `https://us-central1-your-project-id.cloudfunctions.net/api`

### Authentication
Include Firebase ID token:
```
Authorization: Bearer <idToken>
```

### Projects
```
GET    /api/projects              # List all projects
GET    /api/projects/:id          # Get project details
POST   /api/projects              # Create project (admin)
PUT    /api/projects/:id          # Update project (admin)
DELETE /api/projects/:id          # Delete project (admin)
```

### Bookings
```
POST   /api/bookings              # Create booking
GET    /api/bookings              # List bookings (admin)
PUT    /api/bookings/:id          # Update booking (admin)
DELETE /api/bookings/:id          # Delete booking (admin)
```

### Reviews
```
GET    /api/reviews               # List reviews
POST   /api/reviews               # Submit review
DELETE /api/reviews/:id           # Delete review (admin)
```

### Inquiries
```
POST   /api/inquiries             # Submit inquiry
GET    /api/inquiries             # List inquiries (admin)
DELETE /api/inquiries/:id         # Delete inquiry (admin)
```

### Content
```
GET    /api/content               # Get site content
PUT    /api/content               # Update content (admin)
```

---

## 🗄️ Database Schema

### Collections Structure

**projects/** - Portfolio projects
```javascript
{
  title: "Project Name",
  description: "Description",
  category: "web-design",
  images: ["url1", "url2"],
  liveUrl: "https://...",
  gitUrl: "https://...",
  features: ["Feature 1", "Feature 2"],
  technologies: ["React", "Firebase"],
  featured: false,
  status: "active",
  isPublished: true,
  createdAt: timestamp,
  updatedAt: timestamp,
  createdBy: "uid"
}
```

**bookings/** - Client bookings
```javascript
{
  name: "Client Name",
  businessName: "Company",
  email: "client@example.com",
  phone: "+91...",
  serviceType: "Web Development",
  requirements: "Details...",
  date: timestamp,
  status: "pending",
  createdAt: timestamp
}
```

**reviews/** - User testimonials
```javascript
{
  authorName: "John",
  authorEmail: "john@example.com",
  rating: 5,
  text: "Great service!",
  isApproved: true,
  createdAt: timestamp
}
```

Full schema: [DATABASE-SCHEMA.md](./docs/DATABASE-SCHEMA.md)

---

## 🌍 Deployment

### Frontend (Vercel)

```bash
cd apps/frontend
pnpm build
vercel deploy --prod
```

### Backend (Firebase)

```bash
cd services
firebase deploy --only functions
```

### Full Deployment

```bash
npm run deploy:frontend
npm run deploy:functions
```

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed guide

---

## 🔐 Security

- **Firebase Auth** for user authentication
- **JWT tokens** for API requests
- **Firestore security rules** for data protection
- **CORS** for cross-origin requests
- **Input validation** on all endpoints
- **Rate limiting** to prevent abuse

---

## 📊 Performance

- **Vite bundling** - Sub-second build times
- **Code splitting** - Automatic with React.lazy()
- **Image optimization** - CDN URLs only
- **Query caching** - TanStack Query 5 min TTL
- **Firebase Realtime** - Push updates without polling
- **Cloud Functions** - Serverless auto-scaling

---

## 🛠️ Customization

### Add New Service

1. Create microservice in `services/functions/[name]/index.js`
2. Import in `services/functions/index.js`
3. Add route: `app.use('/api/[name]', router)`
4. Create hook in `apps/frontend/src/hooks/`

### Add New Page

1. Create component in `apps/frontend/src/components/pages/`
2. Add route in `apps/frontend/src/App.jsx`
3. Use hooks for data fetching

### Change Brand Colors

Edit `apps/frontend/src/styles/globals.css` CSS variables

---

## 📚 Documentation

- [Quick Start Guide](./QUICK-START.md) - Get up & running in 5 min
- [Setup Guide](./docs/SETUP-GUIDE.md) - Detailed setup instructions
- [API Documentation](./docs/API-DOCS.md) - All endpoints
- [Database Schema](./docs/DATABASE-SCHEMA.md) - Collection structure
- [Deployment Guide](./docs/DEPLOYMENT.md) - Production deployment

---

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Commit changes: `git commit -m "Add feature"`
3. Push branch: `git push origin feature/name`
4. Open Pull Request

---

## 📄 License

MIT License - Built by Manas for Webcraft Studio

---

## 📞 Support

- **Email**: webcraft1130@gmail.com
- **WhatsApp**: 8822322905
- **Website**: [webcraft.dev](https://webcraft.dev)

---

## 🎯 Roadmap

- [ ] Email notifications
- [ ] Payment integration (Stripe)
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] API rate limiting (Redis)
- [ ] Image optimization service
- [ ] Blog module
- [ ] Team collaboration

---

**Built with ❤️ by Manas**

⭐ **If you found this useful, please star the repository!**

🚀 **Ready to launch?** See [QUICK-START.md](./QUICK-START.md)
