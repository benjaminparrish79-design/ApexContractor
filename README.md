# ContractorPro - Contractor Business Management System

A comprehensive, production-ready contractor business management application built with modern web technologies. ContractorPro combines core invoicing, bidding, and project management features with advanced analytics, time tracking, client portals, and automation capabilities.

## 🚀 Features

### Core Features
- **Client Management** - Create, manage, and track all your clients with detailed contact information
- **Project Tracking** - Monitor project status, budget, and progress in real-time
- **Invoice Creation** - Generate professional invoices with automatic numbering and PDF export
- **Bid/Estimate Builder** - Create detailed bids with cost calculations and validity tracking
- **Payment Tracking** - Record payments via multiple methods (card, cash, check, bank transfer)
- **Dashboard** - Real-time metrics including revenue, pending invoices, and active projects
- **Business Settings** - Configure company information, tax rates, and payment terms
- **Notification System** - In-app notifications with customizable preferences
- **Authentication** - Secure Manus OAuth integration with role-based access control

### Advanced Features
- **Analytics Dashboard** - Monthly revenue charts, invoice status distribution, bid conversion rates
- **Time Tracking** - Real-time timer with cost calculations and weekly summaries
- **Client Portal** - Allow clients to view invoices and payment status
- **Project Photos** - Upload and organize project gallery images
- **Recurring Invoices** - Automate invoice generation with flexible frequency options
- **Job Cost Tracking** - Categorize and report on project expenses
- **Team Members** - Manage team members with roles and hourly rates
- **Templates** - Save and reuse invoice and bid templates

## 🛠️ Technology Stack

| Component | Technology |
|-----------|-----------|
| **Frontend** | React 19 + Tailwind CSS 4 + TypeScript |
| **Backend** | Express 4 + tRPC 11 + Node.js |
| **Database** | MySQL/TiDB with Drizzle ORM |
| **Authentication** | Manus OAuth |
| **Payment Processing** | Stripe (integrated) |
| **Hosting** | Manus Platform |
| **Additional** | jsPDF, Recharts, date-fns |

## 📊 Database Schema

The application includes 20 comprehensive tables:

| Category | Tables |
|----------|--------|
| **Core** | users, businessSettings |
| **Clients & Projects** | clients, projects |
| **Financial** | invoices, invoiceItems, bids, bidItems, payments |
| **Operations** | timeEntries, photos, timeline, jobCosts, teamMembers |
| **Advanced** | recurringInvoices, templates, notifications |

## 🎯 Project Statistics

- **Database Tables:** 20 with 200+ columns
- **Frontend Pages:** 22 (17 core + 5 advanced)
- **Backend Procedures:** 50+ tRPC procedures
- **Components:** 50+ UI components using shadcn/ui
- **API Endpoints:** All procedures accessible via `/api/trpc/*`

## 📦 Installation & Setup

### Prerequisites
- Node.js 22.x or higher
- pnpm 10.x or higher
- MySQL/TiDB database

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd contractor-pro-masterpiece
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment variables**
   Create a `.env` file with the following:
   ```
   DATABASE_URL=mysql://user:password@localhost:3306/contractor_pro
   JWT_SECRET=your-secret-key
   VITE_APP_ID=your-app-id
   OAUTH_SERVER_URL=https://api.manus.im
   VITE_OAUTH_PORTAL_URL=https://oauth.manus.im
   ```

4. **Push database schema**
   ```bash
   pnpm db:push
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```

6. **Run tests**
   ```bash
   pnpm test
   ```

## 🏗️ Project Structure

```
contractor-pro-masterpiece/
├── client/                    # React frontend
│   ├── src/
│   │   ├── pages/            # 22 page components
│   │   ├── components/       # 50+ reusable components
│   │   ├── lib/              # tRPC client setup
│   │   ├── contexts/         # React contexts
│   │   ├── hooks/            # Custom hooks
│   │   └── App.tsx           # Main router
│   └── public/               # Static assets
├── server/                    # Express backend
│   ├── routers.ts            # tRPC procedures
│   ├── db.ts                 # Database helpers
│   ├── storage.ts            # S3 integration
│   └── _core/                # Framework code
├── drizzle/                   # Database schema
│   ├── schema.ts             # 20 tables
│   └── migrations/           # Applied migrations
├── shared/                    # Shared constants
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── vite.config.ts            # Build config
└── drizzle.config.ts         # Database config
```

## 🔐 Authentication

ContractorPro uses Manus OAuth for secure authentication. The flow is automatic:

1. User clicks "Sign In"
2. Redirected to Manus OAuth portal
3. After authentication, session cookie is created
4. User context is available in all protected procedures

Protected routes use `protectedProcedure` which automatically injects `ctx.user`.

## 💳 Payment Processing

Stripe integration is built-in and ready for configuration:

1. **Claim Stripe Sandbox** - Visit [https://dashboard.stripe.com/claim_sandbox](https://dashboard.stripe.com/claim_sandbox)
2. **Add API Keys** - Configure in Settings → Secrets
3. **Test Payments** - Use test card: `4242 4242 4242 4242`

## 📈 API Reference

### Key tRPC Routers

| Router | Procedures |
|--------|-----------|
| `clients` | list, get, create, update, delete |
| `projects` | list, get, create, update, delete |
| `invoices` | list, get, create, update, delete |
| `bids` | list, get, create, delete |
| `payments` | list, byInvoice, create |
| `timeEntries` | byProject, create |
| `photos` | byProject, create |
| `notifications` | list, markAsRead |
| `dashboard` | stats |
| `businessSettings` | get, update |

All procedures are type-safe and support real-time data synchronization.

## 🚀 Deployment

### Manus Platform (Recommended)
1. Click "Publish" in the Management UI
2. Assign custom domain
3. Configure production environment variables
4. Enable monitoring and logging

### Render
1. Create new Render service
2. Connect GitHub repository
3. Set environment variables
4. Deploy with Docker

### Docker
```bash
pnpm build
docker build -t contractor-pro .
docker run -p 3000:3000 contractor-pro
```

## 📝 Development Guidelines

### Adding Features

1. **Update Database Schema** - Edit `drizzle/schema.ts`
2. **Run Migrations** - Execute `pnpm db:push`
3. **Add Query Helpers** - Update `server/db.ts`
4. **Create tRPC Procedures** - Add to `server/routers.ts`
5. **Build UI Components** - Create pages in `client/src/pages/`
6. **Write Tests** - Add vitest specs in `server/*.test.ts`

### Code Quality

- **TypeScript** - Full type safety end-to-end
- **Linting** - Run `pnpm format` for consistent code style
- **Testing** - Run `pnpm test` for unit tests
- **Build** - Run `pnpm build` to verify production build

## 🧪 Testing

The project includes Vitest for unit testing:

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test server/auth.logout.test.ts

# Watch mode
pnpm test --watch
```

## 📚 Documentation

- **SETUP.md** - Detailed setup and configuration guide
- **FEATURES.md** - In-depth feature documentation
- **API.md** - Complete API reference
- **DEPLOYMENT.md** - Deployment guides for multiple platforms

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Write tests for new features
4. Run `pnpm format` and `pnpm check`
5. Submit a pull request

## 📄 License

MIT License - See LICENSE file for details

## 🆘 Support

For issues, feature requests, or questions:
- Check existing documentation
- Review API reference
- Open an issue on GitHub
- Contact support team

## 🎉 Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced reporting and export
- [ ] Multi-user team collaboration
- [ ] Integration with accounting software
- [ ] AI-powered invoice analysis
- [ ] Automated payment reminders
- [ ] Client feedback system

---

**Built with ❤️ for contractors and service businesses**
