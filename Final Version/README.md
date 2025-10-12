# 3DOPENPRINT - Professional 3D Printing Service

A modern, production-ready web application for 3D printing services with real-time file analysis, payment processing, and automated email confirmation.

## 🚀 Features

- **File Upload & Analysis**: Support for STL, OBJ, STEP, IGES, and 3MF files
- **Real-time 3D Preview**: Interactive model viewer with Three.js
- **Smart Cost Estimation**: AI-powered pricing based on material and complexity
- **Stripe Payment Integration**: Secure payment processing
- **Automated Email Confirmations**: Professional order confirmation emails
- **Responsive Design**: Mobile-first, dark theme support
- **Production Ready**: Environment-based configuration

## 🛠️ Quick Start

### Development Setup

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your actual credentials

# Start development server
npm run dev
```

### Production Deployment

```bash
# Run the automated setup script
./scripts/setup-production.sh

# Or manually:
npm run build
npm run preview
```

## ⚙️ Environment Configuration

Update the `.env` file with your production credentials:

```env
# Email Configuration (Required for order confirmations)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@3dopenprint.com

# Stripe Configuration (Required for payments)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_public_key
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key

# Application Settings
NODE_ENV=production
PORT=3000
```

### Email Setup Instructions

**Gmail Setup:**
1. Enable 2-Factor Authentication
2. Generate an App Password
3. Use the App Password as `SMTP_PASS`

**Other Providers:**
- **Outlook**: `smtp.live.com:587`
- **SendGrid**: `smtp.sendgrid.net:587`
- **Mailgun**: `smtp.mailgun.org:587`

## 📋 API Endpoints

- `POST /api/send-order-confirmation` - Send order confirmation emails
- `POST /api/create-payment-intent` - Create Stripe payment intents

## 🏗️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **3D Rendering**: Three.js, React Three Fiber
- **Payments**: Stripe API
- **Email**: Nodemailer
- **UI Components**: Radix UI, Lucide Icons
- **Routing**: React Router DOM

## 📁 Project Structure

```
src/
├── components/         # Reusable UI components
├── pages/             # Route components
├── hooks/             # Custom React hooks
├── lib/               # Utility functions
├── config/            # Environment configuration
└── services/          # API services

api/                   # Backend API endpoints
scripts/               # Deployment scripts
```

## 🔒 Security Features

- Environment variable validation
- Email format validation
- Secure payment processing
- Error handling and logging
- Production-ready SMTP configuration

## 📞 Support

For questions or issues, please contact our support team or create an issue in this repository.

## Project info

**URL**: https://lovable.dev/projects/186b33ca-4c55-4eba-95be-316a94f9e41a

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/186b33ca-4c55-4eba-95be-316a94f9e41a) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/186b33ca-4c55-4eba-95be-316a94f9e41a) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
