# Vercel Deployment Guide

## Prerequisites
- [Vercel CLI](https://vercel.com/download) installed: `npm i -g vercel`
- Node.js 18+ installed

## Deploy Steps

### 1. Install Vercel CLI (if not installed)
```bash
npm i -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy from this folder
```bash
# For preview deployment
vercel

# For production deployment
vercel --prod
```

### 4. Set Environment Variables
After first deployment, add your environment variables via:
```bash
vercel env add STRIPE_SECRET_KEY
vercel env add VITE_STRIPE_PUBLISHABLE_KEY
vercel env add EMAIL_HOST
vercel env add EMAIL_PORT
vercel env add EMAIL_USER
vercel env add EMAIL_PASSWORD
vercel env add EMAIL_FROM
```

Or add them via Vercel Dashboard:
1. Go to your project on vercel.com
2. Settings → Environment Variables
3. Add all variables from `.env.example`

### 5. Redeploy with Environment Variables
```bash
vercel --prod
```

## Quick Deploy (One Command)
```bash
vercel --prod
```

## Local Development
```bash
npm install
npm run dev
```

## Configuration Files
- `vercel.json` - Vercel deployment configuration
- `.vercelignore` - Files to exclude from deployment
- `.env.example` - Environment variables template

## API Routes
The `/api` folder contains serverless functions that will be automatically deployed:
- `/api/create-payment-intent.js` - Stripe payment processing
- `/api/send-order-confirmation.js` - Email notifications

## Notes
- Frontend builds to static files in `dist/` folder
- API routes become serverless functions
- All environment variables must be set in Vercel dashboard
- No GitHub connection required for CLI deployment
