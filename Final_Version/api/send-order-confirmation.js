// API endpoint for sending order confirmation emails
// This would typically be implemented in your backend (Node.js, Python, etc.)

import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { orderDetails, customerEmail, customerName } = req.body;

    // Validate required fields
    if (!orderDetails || !customerEmail || !customerName) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: orderDetails, customerEmail, customerName' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email address format' 
      });
    }

    // Validate environment variables
    const requiredEnvVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'];
    const missingVars = requiredEnvVars.filter(varName => 
      !process.env[varName] || process.env[varName].includes('your-')
    );

    if (missingVars.length > 0) {
      return res.status(500).json({
        success: false,
        message: `Email service not configured. Missing: ${missingVars.join(', ')}`
      });
    }

    // Create transporter with environment variables
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // HTML email template
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation - 3DOPENPRINT</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 40px 30px; text-align: center;">
                    <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Order Confirmed!</h1>
                    <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Thank you for choosing 3DOPENPRINT</p>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="color: #1f2937; margin: 0 0 20px 0;">Hello ${customerName},</h2>
                    <p style="color: #4b5563; line-height: 1.6; margin: 0 0 30px 0;">
                      Your 3D printing order has been successfully processed! Here are the details:
                    </p>
                    
                    <!-- Order Details Table -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin: 30px 0;">
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Order ID:</td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; text-align: right;">${orderDetails.orderId}</td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">File Name:</td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; text-align: right;">${orderDetails.fileName}</td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Material:</td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; text-align: right;">${orderDetails.material}</td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Total Amount:</td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #10b981; text-align: right; font-weight: bold;">$${orderDetails.price}</td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Payment Method:</td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; text-align: right;">${orderDetails.paymentMethod}</td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Order Date:</td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; text-align: right;">${orderDetails.timestamp}</td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; font-weight: bold; color: #374151;">Payment ID:</td>
                        <td style="padding: 12px 0; color: #6b7280; text-align: right; font-family: monospace;">${orderDetails.paymentId}</td>
                      </tr>
                    </table>
                    
                    <!-- Next Steps -->
                    <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin: 30px 0;">
                      <h3 style="color: #065f46; margin: 0 0 10px 0;">What happens next?</h3>
                      <ul style="color: #047857; margin: 0; padding-left: 20px;">
                        <li style="margin-bottom: 8px;">Our team will review your file for printability</li>
                        <li style="margin-bottom: 8px;">Production will begin within 24 hours</li>
                        <li style="margin-bottom: 8px;">You'll receive tracking information once shipped</li>
                        <li>Estimated delivery: 3-5 business days</li>
                      </ul>
                    </div>
                    
                    <p style="color: #4b5563; line-height: 1.6; margin: 30px 0 0 0;">
                      If you have any questions about your order, please don't hesitate to contact our support team.
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px;">
                      Thank you for choosing 3DOPENPRINT
                    </p>
                    <p style="color: #9ca3af; margin: 0; font-size: 12px;">
                      This email was sent to ${customerEmail}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // Send email
    const mailOptions = {
      from: `"3DOPENPRINT" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: customerEmail,
      subject: `Order Confirmation - ${orderDetails.orderId}`,
      html: htmlTemplate,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ 
      success: true, 
      message: 'Order confirmation email sent successfully' 
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send email', 
      error: error.message 
    });
  }
}