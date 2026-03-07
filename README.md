# Applyzer

> **AI-Powered Job Application Automation Platform**

[![React](https://img.shields.io/badge/React-19.2-61dafb?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5.0+-646cff?style=flat-square&logo=vite)](https://vitejs.dev)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

## Overview

Applyzer is an intelligent job application automation platform that leverages AI to streamline the job application process. Enter your profile once, and Applyzer generates tailored resumes, cover letters, and cold emails—then sends them directly from your Gmail. Designed to maximize efficiency and increase reply rates, Applyzer has helped 2,400+ users apply to 45,000+ jobs with a 34% reply rate.

## ✨ Features

| Feature | Description |
|---------|-------------|
| **AI-Powered Resume Generation** | Automatically tailors your resume for each job application |
| **Smart Cover Letter Creation** | Generates personalized cover letters aligned with job requirements |
| **Cold Email Templates** | Creates compelling outreach emails sent directly from Gmail |
| **Application Tracking** | Real-time tracker with reply detection and status monitoring |
| **Bulk Application** | Apply to multiple jobs simultaneously with AI optimization |
| **Gmail Integration** | OAuth-secured integration for seamless email sending |
| **Job Dashboard** | Centralized view of all applications with detailed analytics |
| **No Credit Card Required** | Free forever plan available for getting started |

## 🚀 Tech Stack

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 4 + Shadcn UI Components
- **Animation**: Framer Motion
- **Routing**: React Router v7
- **Auth**: Clerk
- **Icons**: Lucide React
- **UI Components**: Radix UI
- **Notifications**: Sonner
- **Package Manager**: npm/yarn

### Development Tools
- **Linting**: ESLint 9
- **Type Checking**: TypeScript
- **Code Formatting**: Tailwind CSS + Prettier

## 📋 Prerequisites

- **Node.js**: v18 or higher
- **npm**: v9 or higher (or yarn/pnpm)
- **Git**: For version control

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/applyzer.git
cd applyzer
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory and add your configuration:
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key_here
```

### 4. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📚 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production (TypeScript + Vite optimization) |
| `npm run lint` | Run ESLint to check code quality |
| `npm run preview` | Preview production build locally |

## 📁 Project Structure

```
src/
├── components/          # Reusable React components
│   ├── landing/         # Landing page sections
│   ├── ui/              # Shadcn UI components
│   └── DashboardLayout.tsx
├── pages/               # Page components
│   ├── Landing.tsx
│   ├── Dashboard.tsx
│   ├── Jobs.tsx
│   ├── Apply.tsx
│   ├── Profile.tsx
│   ├── Resume.tsx
│   ├── Notifications.tsx
│   └── SignIn/Signup.tsx
├── context/             # React Context for state management
├── lib/                 # Utility functions and helpers
│   ├── utils.ts
│   └── clerkAppearance.ts
├── assets/              # Static assets and images
├── App.tsx              # Main app component
└── main.tsx             # Entry point
```

## 🔐 Authentication

Applyzer uses **Clerk** for secure authentication:
- OAuth-based sign-in
- Multi-factor authentication support
- Secure user session management
- Email verification

## 🎨 UI Components

The project uses **Shadcn UI** components for a consistent design system:
- Buttons, Cards, Inputs
- Dropdowns, Dialogs, Tables
- Navigation, Badges, Separators
- And more...

Components are fully customizable and built on Radix UI primitives.

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

### Deploy to Other Platforms
- **Netlify**: Connect GitHub repo → Auto-deploy
- **GitHub Pages**: Configure build output
- **Docker**: Create Dockerfile for containerization

## 📊 Key Metrics

- **45,000+** Applications Sent
- **34%** Average Reply Rate
- **2,400+** Active Users
- **186+** Countries Supported
- **2 minutes** Average Setup Time

## 🔗 Integration Points

### Gmail OAuth
- Secure OAuth 2.0 authentication
- Direct email sending capability
- Read/write email access

### Clerk Authentication
- User session management
- Profile management
- Security policies

## 🐛 Troubleshooting

### Development Server Won't Start
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
npm run dev
```

### Build Errors
```bash
# Check TypeScript compilation
npm run build
```

### Port Already in Use
Vite will automatically use the next available port if 5173 is in use.

## 📝 Code Style Guidelines

- Use TypeScript for all new files
- Follow ESLint configuration
- Use Tailwind CSS for styling
- Implement responsive design with Tailwind breakpoints
- Use Framer Motion for animations

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/yourusername/applyzer/issues)
- **Email**: support@applyzer.com
- **Website**: https://applyzer.com

## 🎯 Roadmap

- [ ] Advanced AI model integration
- [ ] Multi-language support
- [ ] Mobile app (iOS/Android)
- [ ] API for third-party integrations
- [ ] Custom email domain support
- [ ] Interview preparation tools

## 🙏 Acknowledgments

- Built with React, TypeScript, and Vite
- UI powered by Tailwind CSS and Shadcn
- Icons by Lucide React
- Authentication by Clerk
- Animations by Framer Motion

---

**Made with ❤️ by the Applyzer Team**
