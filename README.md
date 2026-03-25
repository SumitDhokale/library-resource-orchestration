# Library Resource Orchestration System

A modern cloud-native solution for managing physical and digital library resources with role-based access control.

## 🚀 Features

- **Cloud-Native Architecture** - Built with React, TypeScript, and Supabase
- **Role-Based Access Control** - Admin, Librarian, and User roles
- **Digital Resource Management** - Upload and manage digital files
- **Real-time Availability Tracking** - Live book availability status
- **Responsive Design** - Modern UI with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 18+
- Supabase account

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd cloud-library-resource-orchestration
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API and copy your project URL and anon key
3. Update `src/supabaseClient.ts`:

```typescript
const supabaseUrl = "your-project-url"
const supabaseKey = "your-anon-key"
```

### 3. Set up Database Schema

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `schema.sql`
4. Run the SQL script

### 4. Initialize Sample Data (Optional)

Run the setup script to populate your database with sample books and digital resources:

```bash
npm run setup
```

This will prompt you for your Supabase URL and service role key, then insert sample data.

### 5. Create Admin User

After running the schema, create your first admin user:

1. Register a new account through the app
2. In Supabase SQL Editor, update the user's role:

```sql
UPDATE user_profiles
SET role = 'admin'
WHERE email = 'your-admin-email@example.com';
```

Or use the setup script which will provide these instructions.

### 5. Run the Application

```bash
npm run dev
```

## 📁 Project Structure

```
src/
├── components/
│   ├── Layout/
│   │   ├── Header.tsx
│   │   ├── Layout.tsx
│   │   └── Sidebar.tsx
│   └── UI/
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       └── Table.tsx
├── pages/
│   ├── Login.tsx
│   ├── admin/
│   │   ├── ActivityLogs.tsx
│   │   ├── AdminDashboard.tsx
│   │   └── ManageUsers.tsx
│   ├── librarian/
│   │   └── LibrarianDashboard.tsx
│   ├── shared/
│   │   ├── BooksPage.tsx
│   │   ├── DigitalResourcesPage.tsx
│   │   ├── HistoryPage.tsx
│   │   ├── SettingsPage.tsx
│   │   └── TransactionsPage.tsx
│   └── user/
│       └── UserDashboard.tsx
├── store/
│   └── index.ts
├── types/
│   └── index.ts
├── utils/
│   └── cn.ts
├── App.tsx
├── main.tsx
└── supabaseClient.ts
```

## 🔐 Authentication & Authorization

The system uses Supabase Auth with role-based access control:

- **Admin**: Full system access, user management, system configuration
- **Librarian**: Book and resource management, transaction processing
- **User**: Browse books, request loans, access digital resources

## 🗄️ Database Schema

### Core Tables

- `user_profiles` - Extended user information with roles
- `books` - Physical book inventory
- `transactions` - Book loans and returns
- `digital_resources` - Digital files and documents
- `notifications` - User notifications
- `activity_logs` - System activity tracking
- `book_reserves` - Book reservation system

### Row Level Security

All tables have RLS policies ensuring users can only access appropriate data based on their role.

## 🎨 UI Components

The app uses a custom component library built on Tailwind CSS:

- Responsive design
- Dark/Light theme support
- Accessible components
- Consistent styling

## 📱 Pages & Features

### Admin Dashboard
- System overview and statistics
- User management
- Activity logs monitoring

### Librarian Dashboard
- Book inventory management
- Transaction processing
- Digital resource uploads

### User Dashboard
- Book browsing and search
- Personal loan history
- Digital resource access

## 🔧 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Environment Variables

Create a `.env.local` file:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

### Supabase Deployment

1. Connect your repository to Supabase
2. Set up automatic deployments
3. Configure environment variables in Supabase dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is developed as part of an academic project.

## 👨‍💻 Developer

**Sumit Ajay Dhokale**
- B.Tech CSE | URN: 1022031003
- ADCET, Ashta | 2025-26