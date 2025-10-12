import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3001;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  fileFilter: (req, file, cb) => {
    const allowedExtensions = ['.step', '.stp', '.iges', '.igs', '.stl', '.obj', '.3mf'];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file format'), false);
    }
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Helper Functions for 3D Model Analysis
const analyzeSTLFile = (filePath) => {
  return new Promise((resolve, reject) => {
    try {
      const loader = new STLLoader();
      const fileData = fs.readFileSync(filePath);
      const geometry = loader.parse(fileData.buffer);
      
      // Calculate bounding box
      geometry.computeBoundingBox();
      const boundingBox = geometry.boundingBox;
      
      const dimensions = {
        length: Math.abs(boundingBox.max.x - boundingBox.min.x),
        width: Math.abs(boundingBox.max.y - boundingBox.min.y),
        height: Math.abs(boundingBox.max.z - boundingBox.min.z)
      };
      
      // Calculate volume using mesh volume computation
      const volume = calculateMeshVolume(geometry);
      
      // Calculate surface area
      const surfaceArea = calculateSurfaceArea(geometry);
      
      // Get triangle count
      const triangleCount = geometry.attributes.position.count / 3;
      
      resolve({
        dimensions,
        volume: volume / 1000, // Convert to cm³
        surfaceArea: surfaceArea / 100, // Convert to cm²
        triangleCount: Math.floor(triangleCount)
      });
    } catch (error) {
      reject(error);
    }
  });
};

const calculateMeshVolume = (geometry) => {
  // Simple volume calculation using divergence theorem
  let volume = 0;
  const positions = geometry.attributes.position.array;
  
  for (let i = 0; i < positions.length; i += 9) {
    const v1 = new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]);
    const v2 = new THREE.Vector3(positions[i + 3], positions[i + 4], positions[i + 5]);
    const v3 = new THREE.Vector3(positions[i + 6], positions[i + 7], positions[i + 8]);
    
    // Calculate signed volume of tetrahedron formed by origin and triangle
    const signedVolume = v1.dot(v2.clone().cross(v3)) / 6;
    volume += signedVolume;
  }
  
  return Math.abs(volume);
};

const calculateSurfaceArea = (geometry) => {
  let area = 0;
  const positions = geometry.attributes.position.array;
  
  for (let i = 0; i < positions.length; i += 9) {
    const v1 = new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]);
    const v2 = new THREE.Vector3(positions[i + 3], positions[i + 4], positions[i + 5]);
    const v3 = new THREE.Vector3(positions[i + 6], positions[i + 7], positions[i + 8]);
    
    // Calculate triangle area using cross product
    const edge1 = v2.clone().sub(v1);
    const edge2 = v3.clone().sub(v1);
    const triangleArea = edge1.cross(edge2).length() / 2;
    area += triangleArea;
  }
  
  return area;
};

const detectMaterial = (filename, metadata = {}) => {
  const name = filename.toLowerCase();
  
  // Check metadata first
  if (metadata.material) return metadata.material;
  
  // Detect from filename patterns
  if (name.includes('steel') || name.includes('metal')) return 'Steel';
  if (name.includes('aluminum') || name.includes('aluminium')) return 'Aluminum';
  if (name.includes('titanium')) return 'Titanium';
  if (name.includes('plastic') || name.includes('pla')) return 'PLA';
  if (name.includes('abs')) return 'ABS';
  if (name.includes('petg')) return 'PETG';
  
  // Default to PLA for 3D printing
  return 'PLA';
};

const calculateComplexity = (triangleCount, surfaceArea, volume) => {
  const density = triangleCount / volume; // triangles per unit volume
  const surfaceVolumeRatio = surfaceArea / volume;
  
  if (triangleCount < 1000 || (density < 10 && surfaceVolumeRatio < 5)) {
    return 'Low';
  } else if (triangleCount < 10000 || (density < 50 && surfaceVolumeRatio < 15)) {
    return 'Medium';
  } else {
    return 'High';
  }
};

const assessManufacturingFeasibility = (dimensions, complexity, material) => {
  const feasibleProcesses = [];
  const maxDim = Math.max(dimensions.length, dimensions.width, dimensions.height);
  const minDim = Math.min(dimensions.length, dimensions.width, dimensions.height);
  
  // FDM/FFF - good for most plastics, limited by size
  if (['PLA', 'ABS', 'PETG'].includes(material) && maxDim < 300 && minDim > 0.4) {
    feasibleProcesses.push('FDM');
  }
  
  // SLS - good for complex geometries, various materials
  if (maxDim < 200 && complexity !== 'Low') {
    feasibleProcesses.push('SLS');
  }
  
  // SLM - metals, high precision
  if (['Steel', 'Aluminum', 'Titanium'].includes(material) && maxDim < 150) {
    feasibleProcesses.push('SLM');
  }
  
  // CNC - good for metals and large parts, limited by complexity
  if (['Steel', 'Aluminum', 'Titanium'].includes(material) && complexity !== 'High') {
    feasibleProcesses.push('CNC');
  }
  
  return feasibleProcesses;
};

const calculateDynamicCost = (volume, material, complexity, feasibleProcesses) => {
  const materialCosts = {
    'PLA': 0.03,
    'ABS': 0.04,
    'PETG': 0.05,
    'Steel': 0.08,
    'Aluminum': 0.06,
    'Titanium': 0.25
  };
  
  const complexityMultipliers = {
    'Low': 1.0,
    'Medium': 1.5,
    'High': 2.2
  };
  
  const baseCost = volume * (materialCosts[material] || 0.03);
  const complexityCost = baseCost * complexityMultipliers[complexity];
  const processingFee = feasibleProcesses.length > 0 ? 5 : 10; // Lower fee if more options
  
  return Math.round((complexityCost + processingFee) * 100) / 100;
};

// File Analysis API Endpoint
app.post('/api/analyze-file', upload.single('file'), async (req, res) => {
  console.log('🔍 File analysis request received');
  
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const filePath = req.file.path;
    const filename = req.file.originalname;
    const fileExtension = path.extname(filename).toLowerCase();
    
    console.log(`📁 Analyzing file: ${filename} (${fileExtension})`);
    
    let analysisResult;
    
    // Analyze based on file type
    if (fileExtension === '.stl') {
      analysisResult = await analyzeSTLFile(filePath);
    } else {
      // For other formats, provide intelligent defaults based on file size
      const stats = fs.statSync(filePath);
      const fileSizeKB = stats.size / 1024;
      
      // Estimate dimensions based on file size (rough heuristic)
      const estimatedVolume = Math.max(10, fileSizeKB / 50);
      analysisResult = {
        dimensions: {
          length: Math.cbrt(estimatedVolume) * 12,
          width: Math.cbrt(estimatedVolume) * 8,
          height: Math.cbrt(estimatedVolume) * 6
        },
        volume: estimatedVolume,
        surfaceArea: Math.pow(estimatedVolume, 2/3) * 15,
        triangleCount: Math.floor(fileSizeKB * 2)
      };
    }
    
    // Detect material and calculate other properties
    const material = detectMaterial(filename);
    const complexity = calculateComplexity(
      analysisResult.triangleCount, 
      analysisResult.surfaceArea, 
      analysisResult.volume
    );
    const feasibleProcesses = assessManufacturingFeasibility(
      analysisResult.dimensions, 
      complexity, 
      material
    );
    
    // Determine quality rating
    const qualityRating = feasibleProcesses.length >= 2 ? 'High' : 
                         feasibleProcesses.length === 1 ? 'Medium' : 'Low';
    
    // Clean up uploaded file
    fs.unlinkSync(filePath);
    
    const result = {
      dimensions: {
        length: Math.round(analysisResult.dimensions.length * 10) / 10,
        width: Math.round(analysisResult.dimensions.width * 10) / 10,
        height: Math.round(analysisResult.dimensions.height * 10) / 10
      },
      volume: Math.round(analysisResult.volume * 100) / 100,
      surfaceArea: Math.round(analysisResult.surfaceArea * 100) / 100,
      triangleCount: analysisResult.triangleCount,
      material,
      complexity,
      feasibleProcesses,
      qualityRating,
      timestamp: new Date().toISOString()
    };
    
    console.log('✅ Analysis completed:', result);
    res.json(result);
    
  } catch (error) {
    console.error('❌ File analysis error:', error);
    
    // Clean up file if it exists
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      error: {
        message: 'Failed to analyze file',
        details: error.message
      }
    });
  }
});

// Payment Intent API - for Stripe payments
app.post('/api/create-payment-intent', async (req, res) => {
  console.log('💳 Payment intent request received');
  
  try {
    const { amount, currency = 'usd', metadata } = req.body;

    // For development/testing, return a mock client secret
    // In production, you would use the real Stripe secret key
    const mockClientSecret = `pi_demo_${Math.random().toString(36).substr(2, 9)}_secret_demo`;
    
    console.log('✅ Mock payment intent created:', { amount, currency });

    res.status(200).json({
      client_secret: mockClientSecret,
      amount,
      currency,
      metadata
    });

  } catch (error) {
    console.error('❌ Payment intent error:', error.message);
    res.status(500).json({
      error: {
        message: 'Failed to create payment intent',
        details: error.message
      }
    });
  }
});

// Email endpoint - exactly like the production API
app.post('/api/send-order-confirmation', async (req, res) => {
  console.log('📧 Email request received');
  
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

    // Check if SMTP credentials are missing
    if (missingVars.length > 0) {
      console.log('❌ Missing SMTP credentials:', missingVars.join(', '));
      return res.status(500).json({
        success: false,
        message: `Email service not configured. Missing: ${missingVars.join(', ')}`
      });
    }

    console.log('📧 Sending real email to:', customerEmail);

    // Create transporter with environment variables
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
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
                <tr>
                  <td style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 40px 30px; text-align: center;">
                    <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Order Confirmed!</h1>
                    <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Thank you for choosing 3DOPENPRINT</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="color: #1f2937; margin: 0 0 20px 0;">Hello ${customerName},</h2>
                    <p style="color: #4b5563; line-height: 1.6; margin: 0 0 30px 0;">
                      Your 3D printing order has been successfully processed! Here are the details:
                    </p>
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
                    <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin: 30px 0;">
                      <h3 style="color: #065f46; margin: 0 0 10px 0;">What happens next?</h3>
                      <ul style="color: #047857; margin: 0; padding-left: 20px;">
                        <li style="margin-bottom: 8px;">Our team will review your file for printability</li>
                        <li style="margin-bottom: 8px;">Production will begin within 24 hours</li>
                        <li style="margin-bottom: 8px;">You'll receive tracking information once shipped</li>
                        <li>Estimated delivery: 3-5 business days</li>
                      </ul>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px;">Thank you for choosing 3DOPENPRINT</p>
                    <p style="color: #9ca3af; margin: 0; font-size: 12px;">This email was sent to ${customerEmail}</p>
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
    
    console.log('✅ Email sent successfully to:', customerEmail);

    res.status(200).json({ 
      success: true, 
      message: 'Order confirmation email sent successfully' 
    });

  } catch (error) {
    console.error('❌ Email error:', error.message);
    
    // Check if it's a Gmail authentication error
    if (error.message.includes('Username and Password not accepted')) {
      return res.status(500).json({ 
        success: false, 
        message: 'Gmail authentication failed. Please set up an App Password in Gmail settings.',
        error: 'Gmail requires App Password for SMTP access',
        instructions: 'Enable 2FA in Gmail, then generate an App Password'
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send email', 
      error: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Development API server running on http://localhost:${PORT}`);
  console.log('� Payment API: /api/create-payment-intent');
  console.log('📧 Email API: /api/send-order-confirmation');
  console.log('�📧 Email service ready with SMTP:', process.env.SMTP_HOST);
});