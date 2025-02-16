# 🎨 Modern Portfolio Website

A sleek and interactive portfolio website built with Next.js, featuring dynamic design switching between three distinct styles: Gradient, Geometric, and Minimal. This modern web application showcases best practices in React development with smooth animations and responsive design.

## ✨ Features

### 🎯 Design Themes

- **Gradient Design**: Modern, vibrant gradients with smooth animations
- **Geometric Design**: Clean, minimalist design with geometric patterns
- **Minimal Design**: Simple, elegant design with subtle animations

### 🛠 Technical Features

- Built with Next.js 14 and TypeScript
- Server-Side Rendering (SSR) support
- Dynamic profile loading with API integration
- Environment-based configuration
- Docker support for all environments
- Responsive design for all devices

### 🎭 Interactive Elements

- Real-time theme switching
- Smooth animations powered by Framer Motion
- Dynamic spotlight effects
- Social media integration
- Availability status badge

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Docker (optional)

### Local Development Setup

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/portfolio-website.git
cd portfolio-website
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Environment Setup**

```bash
# For development
cp .env.development.sample .env.development

# For staging
cp .env.staging.sample .env.staging

# For production
cp .env.production.sample .env.production
```

4. **Start development server**

```bash
npm run dev
# or
yarn dev
```

### 🐳 Docker Setup

#### Development

```bash
docker compose -f docker/development/compose.yaml up --build
```

#### Staging

```bash
docker compose -f docker/staging/compose.yaml up --build
```

#### Production

```bash
docker compose -f docker/production/compose.yaml up --build
```

## 🔧 Environment Configuration

### Environment Variables

| Variable                               | Description              | Default                 |
| -------------------------------------- | ------------------------ | ----------------------- |
| `NEXT_PUBLIC_API_URL`                  | API endpoint URL         | `http://localhost:8000` |
| `NEXT_PUBLIC_DEFAULT_PROFILE_USERNAME` | Default profile username | `default`               |

### Docker Environment Variables

You can override environment variables during build or runtime:

```bash
# Build with custom environment variables
docker build \
  --build-arg NEXT_PUBLIC_API_URL=https://api.example.com \
  --build-arg NEXT_PUBLIC_DEFAULT_PROFILE_USERNAME=yourprofile \
  -t your-image-name .

# Run with environment variables
docker run \
  -e NEXT_PUBLIC_API_URL=https://api.example.com \
  -e NEXT_PUBLIC_DEFAULT_PROFILE_USERNAME=yourprofile \
  your-image-name
```

## 🎨 Theme Customization

### Available Themes

1. **Gradient Theme**

   - Vibrant, modern design
   - Animated gradient spotlights
   - Smooth color transitions

2. **Geometric Theme**

   - Minimalist and clean
   - Geometric patterns
   - Custom spotlight effects

3. **Minimal Theme**
   - Simple and elegant
   - Subtle animations
   - Clean typography

## 🛠️ Built With

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Programming language
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Lucide Icons](https://lucide.dev/) - Icon library

## 📱 Responsive Design

The portfolio is fully responsive and optimized for:

- 📱 Mobile devices (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Large screens (1440px+)

## 📂 Project Structure

```
portfolio-website/
├── src/
│   ├── app/              # Next.js app directory
│   │   └── page.tsx     # Main page component
│   ├── components/       # React components
│   │   ├── error/       # Error components
│   │   ├── landing/     # Landing page components
│   │   └── ui/          # UI components
│   ├── lib/             # Utility functions
│   ├── services/        # API services
│   ├── styles/          # Global styles
│   └── types/           # TypeScript types
├── docker/              # Docker configurations
│   ├── development/     # Development environment
│   ├── staging/         # Staging environment
│   └── production/      # Production environment
└── public/              # Static files
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting solutions
- The open-source community

---

<p align="center">
Made with ❤️ by [Your Name]
</p>
