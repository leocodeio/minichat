# MiniChat

A real-time chat application built with Next.js, featuring instant messaging, typing indicators, online presence, and message read receipts.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- pnpm package manager

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd minichat
   pnpm install
   ```

2. **Set up the database:**
   ```bash
   # Set up Prisma and run migrations
   pnpm run prisma:local
   ```

3. **Configure environment variables:**
   Create a `.env.local` file with:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/minichat"

   # Better Auth
   NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"
   BETTER_AUTH_SECRET="your-secret-key"
   BETTER_AUTH_GOOGLE_ID="your-google-client-id"
   BETTER_AUTH_GOOGLE_SECRET="your-google-client-secret"

   # WebSocket Server
   NEXT_PUBLIC_WEBSOCKET_URL="http://localhost:3001"
   WEBSOCKET_PORT=3001
   ```

### Running the Application

**Development Mode (with WebSocket):**
```bash
pnpm run dev
```
This starts both the Next.js app (port 3000) and WebSocket server (port 3001) simultaneously.

**Production Mode:**
```bash
# Build the Next.js app
pnpm run build

# Start both servers
pnpm run start:full
```

**Individual Services:**
```bash
# Next.js only
pnpm run dev:next

# WebSocket server only
pnpm run dev:websocket
```

## 🏗️ Architecture

### Tech Stack
- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, Better Auth
- **Database:** PostgreSQL with Prisma ORM
- **Real-time:** Socket.IO (separate server)
- **UI:** shadcn/ui, Radix UI
- **Styling:** Tailwind CSS with custom themes

### Project Structure
```
minichat/
├── src/
│   ├── app/                 # Next.js App Router
│   ├── components/          # React components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities
│   └── server/             # Server-side code
├── websocket-server.js     # Standalone WebSocket server
├── prisma/                 # Database schema & migrations
└── public/                 # Static assets
```

## ✨ Features

- 🔐 **Authentication:** Email/password and Google OAuth
- 💬 **Real-time Messaging:** Instant message delivery
- ⌨️ **Typing Indicators:** See when others are typing
- 👥 **Online Presence:** User online/offline status
- 📖 **Read Receipts:** Message delivery and read status
- 🎨 **Themes:** Light/dark mode with custom colors
- 🌍 **Internationalization:** Multi-language support (EN, ES, FR)
- 📱 **Responsive:** Mobile-first design

## 🔧 Development

### Available Scripts
- `pnpm run dev` - Start development servers (Next.js + WebSocket)
- `pnpm run build` - Build for production
- `pnpm run lint` - Run ESLint
- `pnpm run prisma:local` - Set up database locally

### WebSocket Architecture
The application uses a **separate WebSocket server** for real-time features:
- **Next.js App:** Port 3000 (HTTP API routes)
- **WebSocket Server:** Port 3001 (Socket.IO real-time communication)

This separation allows:
- Better scalability
- No custom server configuration needed
- Standard Next.js deployment
- Independent WebSocket server management

## 🚀 Deployment

### Environment Variables for Production
```env
# Production URLs
NEXT_PUBLIC_BETTER_AUTH_URL="https://yourdomain.com"
NEXT_PUBLIC_WEBSOCKET_URL="wss://websocket.yourdomain.com"
WEBSOCKET_PORT=3001

# Database
DATABASE_URL="postgresql://..."

# Auth
BETTER_AUTH_SECRET="..."
BETTER_AUTH_GOOGLE_ID="..."
BETTER_AUTH_GOOGLE_SECRET="..."
```

### Deployment Steps
1. Deploy Next.js app to Vercel/Netlify
2. Deploy WebSocket server to a VPS or cloud service
3. Configure environment variables
4. Set up PostgreSQL database
5. Run database migrations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

---

Built with ❤️ using Next.js and Socket.IO
