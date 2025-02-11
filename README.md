# Modern Portfolio Website

A sleek and interactive portfolio website built with Next.js, featuring dynamic design switching between gradient and geometric styles. The website showcases modern web development practices with smooth animations and responsive design.

## 🌟 Features

- **Dynamic Profile Loading**:

  - Load profile data from API
  - URL-based profile access (?username=xyz)
  - Error handling and loading states

- **Dynamic Design Switching**:

  - Gradient Design: Modern, colorful gradients with smooth animations
  - Geometric Design: Clean, minimalist design with geometric patterns

- **Interactive Elements**:

  - Smooth animations powered by Framer Motion
  - Responsive spotlight effects
  - Social media integration
  - Availability status badge

- **Technical Features**:
  - Built with Next.js 14
  - TypeScript for type safety
  - Tailwind CSS for styling
  - Framer Motion for animations
  - Responsive design for all devices
  - API integration with error handling

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/portfolio-website.git
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:

- Copy the appropriate sample env file:

```bash
# For development
cp .env.development.sample .env.development
# For staging
cp .env.staging.sample .env.staging
# For production
cp .env.production.sample .env.production
```

- Edit the copied file with your actual values

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Usage

Access different profiles by using the username parameter:

## 🛠️ Built With

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Programming language
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Lucide Icons](https://lucide.dev/) - Icon library

## 📝 Customization

To customize the portfolio content, modify the following variables in `src/app/page.tsx`:

```typescript
const badge = "Available for hire";
const name = "Your Name";
const title = "Your Title";
const description = "Your description";
const socialLinks = {
  github: "your-github-url",
  linkedin: "your-linkedin-url",
  twitter: "your-twitter-url",
};
const isAvailable = true; // Set to true/false based on availability
```

## 📱 Responsive Design

The portfolio is fully responsive and optimized for:

- Mobile devices
- Tablets
- Desktop screens

## 🎨 Design Modes

### Gradient Mode

- Modern and vibrant design
- Animated gradient spotlights
- Smooth color transitions
- Social media integration

### Geometric Mode

- Minimalist and clean design
- Geometric patterns and shapes
- Custom spotlight effects
- Focus on typography

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🔧 Environment Variables

The application uses the following environment variables:

| Variable            | Description          | Example               |
| ------------------- | -------------------- | --------------------- |
| NEXT_PUBLIC_API_URL | Base URL for the API | http://localhost:8000 |

Different environments (development, staging, production) use separate .env files:

- `.env.development` for development
- `.env.staging` for staging
- `.env.production` for production
