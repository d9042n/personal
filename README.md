# Modern Portfolio Website

A dynamic portfolio website built with Next.js 14, featuring three distinct design themes: Gradient, Geometric, and Minimal. This modern web application showcases React development best practices with smooth animations and responsive design.

## ✨ Features

### 🎨 Design Themes

- **Gradient Theme**: Modern, vibrant gradients with smooth spotlight effects
- **Geometric Theme**: Clean, minimalist design with geometric patterns
- **Minimal Theme**: Simple, elegant design with subtle animations

### 🛠 Technical Features

- Built with Next.js 14 and TypeScript
- Server-Side Rendering (SSR) support
- Dynamic profile loading via API
- Environment-based configuration
- Docker containerization for all environments
- Responsive design with Tailwind CSS
- Smooth animations using Framer Motion

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Docker
- Make (optional, for using Makefile commands)

### Development Setup

1. **Clone the repository**

```bash
git clone <repository-url>
cd portfolio-website
```

2. **Environment Setup**

```bash
# Copy environment sample files
make development-env-setup   # For development
make production-env-setup    # For production
```

3. **Start Development Server**

```bash
# Using Make
make development

# Using Docker directly
docker compose -f docker/development/compose.yaml up
```

### Production Deployment

```bash
# Build and start production environment
make production-deploy

# Monitor production logs
make production-logs

# Health check
make production-health
```

## 🔧 Environment Configuration

### Key Environment Variables

| Variable                               | Description              | Default                 |
| -------------------------------------- | ------------------------ | ----------------------- |
| `NEXT_PUBLIC_API_URL`                  | API endpoint URL         | `http://localhost:8000` |
| `NEXT_PUBLIC_DEFAULT_PROFILE_USERNAME` | Default profile username | `default`               |

### Docker Configuration

Each environment (development, staging, production) has its own:

- Dockerfile
- Docker Compose configuration
- Environment variable setup

## 🎨 Theme Features

### Gradient Theme

- Vibrant gradient spotlights
- Modern, dark aesthetic
- Smooth motion effects
- Social media integration

### Geometric Theme

- Clean, tech-inspired design
- Geometric patterns and shapes
- Custom spotlight effects
- Code-like typography

### Minimal Theme

- Simple, elegant layout
- Subtle shape animations
- Clean typography
- High contrast design

## 🛠️ Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Docker](https://www.docker.com/) - Containerization
- [Lucide Icons](https://lucide.dev/) - Icon system

## �� Project Structure

```
portfolio-website/
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   │   ├── error/       # Error components
│   │   ├── landing/     # Landing page components
│   │   └── ui/          # UI components
│   ├── lib/
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
Made with ❤️ by Personal
</p>
