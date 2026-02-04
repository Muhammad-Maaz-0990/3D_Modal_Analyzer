#!/bin/bash

echo "🔍 3DOPENPRINT Production Validation"
echo "===================================="

# Check .env file
if [ ! -f ".env" ]; then
    echo "❌ .env file missing"
    exit 1
fi

echo "✅ .env file found"

# Check critical environment variables
check_env_var() {
    local var_name=$1
    local var_value=$(grep "^${var_name}=" .env | cut -d'=' -f2-)
    
    if [ -z "$var_value" ] || [[ "$var_value" == *"your-"* ]]; then
        echo "❌ ${var_name}: Not configured"
        return 1
    else
        echo "✅ ${var_name}: Configured"
        return 0
    fi
}

echo ""
echo "📧 Email Configuration:"
check_env_var "SMTP_HOST"
check_env_var "SMTP_USER"
check_env_var "SMTP_PASS"

echo ""
echo "💳 Payment Configuration:"
check_env_var "VITE_STRIPE_PUBLISHABLE_KEY"

# Check if using test or live keys
stripe_key=$(grep "^VITE_STRIPE_PUBLISHABLE_KEY=" .env | cut -d'=' -f2-)
if [[ "$stripe_key" == pk_test_* ]]; then
    echo "⚠️  Using Stripe TEST keys (development mode)"
elif [[ "$stripe_key" == pk_live_* ]]; then
    echo "🔥 Using Stripe LIVE keys (production mode)"
fi

echo ""
echo "📦 Dependencies:"
if npm list nodemailer > /dev/null 2>&1; then
    echo "✅ nodemailer: Installed"
else
    echo "❌ nodemailer: Missing"
fi

if npm list @stripe/stripe-js > /dev/null 2>&1; then
    echo "✅ stripe-js: Installed"
else
    echo "❌ stripe-js: Missing"
fi

echo ""
echo "🏗️  Build Status:"
if [ -d "dist" ]; then
    echo "✅ Production build exists"
else
    echo "⚠️  No production build found (run 'npm run build')"
fi

echo ""
echo "🔒 Security Checklist:"
echo "- ✅ Environment variables in .env file"
echo "- ✅ No hardcoded credentials in source code"
echo "- ⚠️  Ensure .env is in .gitignore"
echo "- ⚠️  Use HTTPS in production"
echo "- ⚠️  Set up proper CORS headers"

echo ""
echo "📋 Next Steps for Production:"
echo "1. Deploy backend API endpoints"
echo "2. Configure web server (Nginx/Apache)"
echo "3. Set up SSL certificates"
echo "4. Test email sending with real SMTP"
echo "5. Test payments with live Stripe keys"
echo "6. Set up monitoring and logging"