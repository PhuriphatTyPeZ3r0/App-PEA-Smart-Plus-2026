# PEA Edit Phone - Next.js Application

A modern Next.js application for managing user profile information, including phone number and email updates with OTP verification.

## Features

- 📱 Phone number and email management
- 🔐 OTP verification system
- 👤 Personal information editing
- 🎨 Responsive UI with Tailwind CSS
- 🌍 Thai language support
- ⚡ Next.js 16 with TypeScript

## Tech Stack

- **Framework**: Next.js 16.2.0
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **React**: 19.2.4
- **Font**: Google Fonts (Prompt with Thai support)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager

### Installation

1. Navigate to the project directory:
```bash
cd mockup-app
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The application auto-reloads as you edit files in `src/app/`.

### Building for Production

Build the project:
```bash
npm run build
```

Start production server:
```bash
npm start
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   ├── change_email/        # Email change page
│   ├── change_phone/        # Phone change page
│   ├── edit_basic_info/     # Basic info editing
│   ├── personal_info/       # Personal information
│   ├── otp_confirm/         # OTP verification
│   ├── otp_confirm_email/   # Email OTP verification
│   ├── success_phone/       # Success page (phone)
│   ├── success_email/       # Success page (email)
│   └── globals.css          # Global styles
└── components/              # Reusable React components
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

See `.env.example` for available configuration options.

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers with iOS 12+ and Android 8+

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)

## License

This project is part of the PEA Smart+ application.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
