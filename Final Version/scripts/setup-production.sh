#!/bin/bash

echo "🚀 Setting up 3DOPENPRINT for production deployment..."

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found. Please create one based on .env.example"
    exit 1
fi

echo "✅ .env file found"

# Check for required environment variables
echo "🔍 Checking required environment variables..."

REQUIRED_VARS=(
    "SMTP_HOST"
    "SMTP_PORT"
    "SMTP_USER"
    "SMTP_PASS"
    "VITE_STRIPE_PUBLISHABLE_KEY"
)

MISSING_VARS=()

for var in "${REQUIRED_VARS[@]}"; do
    if ! grep -q "^${var}=" .env || grep -q "^${var}=.*your-.*" .env; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -ne 0 ]; then
    echo "❌ Missing or incomplete environment variables:"
    for var in "${MISSING_VARS[@]}"; do
        echo "   - $var"
    done
    echo ""
    echo "Please update your .env file with real values."
    exit 1
fi

echo "✅ All required environment variables are set"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application for production..."
npm run build

echo "✅ Production setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Configure your web server to serve the 'dist' folder"
echo "2. Set up your backend API endpoints for:"
echo "   - /api/send-order-confirmation (email service)"
echo "   - /api/create-payment-intent (Stripe payments)"
echo "3. Test email sending with real SMTP credentials"
echo "4. Test payments with Stripe live keys"
echo ""
echo "🔐 Security checklist:"
echo "- ✓ SMTP credentials are configured"
echo "- ✓ Stripe keys are set (use live keys for production)"
echo "- ✓ Environment variables are secure"
echo "- ⚠️  Ensure .env file is not committed to version control"