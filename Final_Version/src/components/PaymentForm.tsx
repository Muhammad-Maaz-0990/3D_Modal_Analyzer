import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Lock, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PaymentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (paymentIntent: any, customerData: {name: string; email: string}) => void;
  orderDetails: {
    fileName: string;
    material: string;
    price: number;
    process: string;
  };
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  isOpen,
  onClose,
  onPaymentSuccess,
  orderDetails
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [billingDetails, setBillingDetails] = useState({
    name: '',
    email: '',
    address: {
      line1: '',
      city: '',
      postal_code: '',
      country: 'US'
    }
  });

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setBillingDetails(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev.address],
          [child]: value
        }
      }));
    } else {
      setBillingDetails(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const createPaymentIntent = async () => {
    // In a real app, this would be your backend API
    // For demo, we'll simulate creating a payment intent
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(orderDetails.price * 100), // Convert to cents
        currency: 'usd',
        metadata: {
          fileName: orderDetails.fileName,
          material: orderDetails.material,
          process: orderDetails.process
        }
      }),
    });

    if (!response.ok) {
      // For demo purposes, simulate a client secret
      return {
        client_secret: 'pi_demo_' + Math.random().toString(36).substr(2, 9) + '_secret_demo'
      };
    }

    return await response.json();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      toast({
        variant: "destructive",
        title: "Stripe not loaded",
        description: "Please wait for Stripe to load and try again."
      });
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      toast({
        variant: "destructive",
        title: "Card element not found",
        description: "Please refresh the page and try again."
      });
      return;
    }

    // Validate required fields
    if (!billingDetails.name || !billingDetails.email) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields."
      });
      return;
    }

    setIsProcessing(true);

    try {
      // For development/demo mode, simulate successful payment
      // Skip real Stripe payment processing
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing time
      
      // Create mock successful payment intent
      const mockPaymentIntent = {
        id: 'pi_demo_' + Math.random().toString(36).substr(2, 9),
        status: 'succeeded',
        amount: Math.round(orderDetails.price * 100),
        currency: 'usd',
        payment_method: {
          card: {
            brand: 'visa',
            last4: '4242'
          }
        }
      };

      toast({
        title: "Payment successful!",
        description: "Your order has been processed."
      });
      
      // Pass customer data along with payment intent
      onPaymentSuccess(mockPaymentIntent, {
        name: billingDetails.name,
        email: billingDetails.email
      });

    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Payment error",
        description: err.message || "An unexpected error occurred."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-background/95 backdrop-blur border-accent/30">
        <CardHeader className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-accent/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <span>Payment Details</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Order Summary */}
          <div className="bg-accent/5 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Order Summary</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>File:</span>
                <span className="font-medium truncate ml-2">{orderDetails.fileName}</span>
              </div>
              <div className="flex justify-between">
                <span>Material:</span>
                <span className="font-medium">{orderDetails.material}</span>
              </div>
              <div className="flex justify-between">
                <span>Process:</span>
                <span className="font-medium">{orderDetails.process}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>${orderDetails.price}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Billing Information */}
            <div className="space-y-3">
              <h3 className="font-semibold">Billing Information</h3>
              
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={billingDetails.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={billingDetails.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="john@example.com"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={billingDetails.address.line1}
                  onChange={(e) => handleInputChange('address.line1', e.target.value)}
                  placeholder="123 Main Street"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={billingDetails.address.city}
                    onChange={(e) => handleInputChange('address.city', e.target.value)}
                    placeholder="New York"
                  />
                </div>
                <div>
                  <Label htmlFor="postal">Postal Code</Label>
                  <Input
                    id="postal"
                    value={billingDetails.address.postal_code}
                    onChange={(e) => handleInputChange('address.postal_code', e.target.value)}
                    placeholder="10001"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Card Information */}
            <div className="space-y-3">
              <Label className="flex items-center space-x-2">
                <Lock className="w-4 h-4" />
                <span>Card Information</span>
              </Label>
              <div className="border rounded-md p-3 bg-background">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: 'hsl(var(--foreground))',
                        '::placeholder': {
                          color: 'hsl(var(--muted-foreground))',
                        },
                      },
                    },
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Use test card: 4242 4242 4242 4242, any future date, any CVC
              </p>
            </div>

            <Button
              type="submit"
              className="w-full h-12"
              disabled={!stripe || isProcessing}
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Pay ${orderDetails.price}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};