# Portfolio Landing Page

A modern, customizable portfolio landing page with multiple themes and social media integration.

## Features

- 🎨 Three distinct themes:
  - Geometric (tech-inspired)
  - Minimal (clean and simple)
  - Artistic (creative and bold)
- 🔄 Real-time theme switching
- 📱 Fully responsive design
- ✨ Smooth animations using Framer Motion
- 🔗 Comprehensive social media integration:
  - GitHub
  - LinkedIn
  - Twitter
  - Facebook
  - LeetCode
  - HackerRank
  - Medium
  - Stack Overflow
  - Portfolio
  - YouTube
  - Dev.to

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide Icons

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/portfolio-landing.git
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=your_api_url
NEXT_PUBLIC_DEFAULT_PROFILE_USERNAME=default
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## API Integration

The application expects an API response in the following format:

```json
{
  "username": "username",
  "profile": {
    "is_available": true,
    "badge": "available",
    "name": "Full Name",
    "title": "Professional Title",
    "description": "Professional description",
    "social_links": {
      "github": "https://github.com/username",
      "linkedin": "https://linkedin.com/in/username",
      "twitter": "https://twitter.com/username",
      "facebook": "https://facebook.com/username",
      "leetcode": "https://leetcode.com/username",
      "hackerrank": "https://hackerrank.com/username",
      "medium": "https://medium.com/@username",
      "stackoverflow": "https://stackoverflow.com/users/userid",
      "portfolio": "https://portfolio.com",
      "youtube": "https://youtube.com/@username",
      "devto": "https://dev.to/username"
    }
  }
}
```

## Docker Support

### Development

```bash
docker-compose -f docker/development/compose.yaml up
```

### Production

```bash
docker-compose -f docker/production/compose.yaml up
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting solutions
- The open-source community

---

<p align="center">
Made with ❤️ by Personal
</p>
