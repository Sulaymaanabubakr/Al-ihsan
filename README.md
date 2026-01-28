# Al-Ihsan Relief Website

A modern, responsive web application for Al-Ihsan Relief - a humanitarian organization dedicated to providing dignity, hope, and essential aid to communities in need.

## 🌟 About Al-Ihsan Relief

Al-Ihsan Relief is a faith-based humanitarian organization committed to:
- Providing emergency relief and humanitarian aid
- Facilitating Zakat and Sadaqah distributions
- Supporting community development initiatives
- Offering hope and dignity to those in need

## 🚀 Tech Stack

### Frontend
- **React 18.3.1** - Modern UI framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons

### Backend & Services
- **Firebase** - Authentication, Firestore database, hosting
- **React Router DOM** - Client-side routing
- **React Helmet Async** - SEO optimization

### Development Tools
- **ESLint** - Code linting and quality
- **PostCSS** - CSS processing
- **TypeScript** - Static type checking

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (Header, Footer, etc.)
│   └── ui/             # UI components (Buttons, Cards, etc.)
├── pages/              # Page components
│   ├── public/         # Public pages (Home, About, Donate, etc.)
│   └── admin/          # Admin pages (Dashboard, Login)
├── context/            # React context providers
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── types/              # TypeScript type definitions
├── assets/             # Static assets
└── styles/             # Global styles
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd al-ihsan-relief
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Fill in your Firebase configuration values in `.env`:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🌐 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint code checks

## 🔧 Firebase Configuration

### Setup Firebase Project

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password)
3. Set up Firestore Database
4. Configure Security Rules
5. Get your Firebase configuration keys

### Security Rules

The project includes Firebase security rules in `firestore.rules`. Make sure to deploy these rules to your Firebase project.

## 🚀 Deployment

### Vercel (Recommended)

1. **Automatic Deployment via Git**
   - Push your code to GitHub/GitLab/Bitbucket
   - Import your repository on Vercel
   - Set environment variables in Vercel dashboard
   - Deploy automatically

2. **Manual Deployment via CLI**
   ```bash
   npm i -g vercel
   vercel login
   vercel --prod
   ```

### Environment Variables for Production
Set these in your deployment platform:
- All `VITE_FIREBASE_*` variables from your `.env` file

## 📱 Features

### Public Features
- **Home** - Landing page with mission and impact
- **About** - Organization information and team
- **Donate** - Secure donation platform
- **Apply** - Volunteer and assistance applications
- **Gallery** - Photo gallery of relief work
- **Contact** - Contact information and form
- **Zakat Calculator** - Islamic charity calculations
- **Focus Areas** - Key humanitarian initiatives

### Admin Features
- **Secure Authentication** - Admin login system
- **Dashboard** - Content management interface
- **Content Management** - Update website content
- **Donation Management** - Track and manage donations

## 🎨 Design System

### Colors
- **Primary**: Emerald (`#059669`)
- **Secondary**: Various shades of green and blue
- **Accent**: Warm colors for CTAs

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)

## 🔒 Security Considerations

- Firebase security rules implemented
- Environment variables for sensitive data
- Input validation and sanitization
- Secure authentication flows
- XSS prevention measures

## 📈 SEO & Performance

- **Meta Tags**: Comprehensive SEO meta tags
- **Open Graph**: Social media sharing optimization
- **Twitter Cards**: Twitter-specific meta tags
- **Sitemap**: XML sitemap for search engines
- **Robots.txt**: Search engine crawling instructions
- **Performance**: Optimized images and lazy loading
- **PWA Ready**: Progressive Web App capabilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Code Style

- Follow ESLint configuration
- Use TypeScript for type safety
- Component-based architecture
- Semantic HTML5
- Mobile-first responsive design
- Accessibility best practices

## 🐛 Bug Reporting

Report bugs via GitHub issues with:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

- **Website**: https://al-ihsan-relief.vercel.app/
- **Email**: info@al-ihsan-relief.org
- **Social Media**: [Add social media links]

## 🙏 Acknowledgments

- Firebase for backend services
- Vercel for hosting
- Open source community
- Our generous donors and volunteers

---

**Built with ❤️ for humanity and service to others**
