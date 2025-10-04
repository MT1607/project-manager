import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface PaymentResult {
  success: boolean;
  message: string;
  orderId?: string;
}

export default function PaymentReturnPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const processPaymentReturn = async () => {
      try {
        // Get parameters from MoMo return URL
        const resultCode = searchParams.get('resultCode');
        const orderId = searchParams.get('orderId');
        const message = searchParams.get('message') || '';

        // Check if payment was successful (MoMo returns resultCode = 0 for success)
        const isSuccess = resultCode === '0';

        if (isSuccess) {
          setPaymentResult({
            success: true,
            message: 'Payment successful! Your Pro license has been activated.',
            orderId: orderId || undefined,
          });
        } else {
          setPaymentResult({
            success: false,
            message: message || 'Payment failed. Please try again.',
            orderId: orderId || undefined,
          });
        }
      } catch (error) {
        console.error('Error processing payment return:', error);
        setPaymentResult({
          success: false,
          message: 'An error occurred while processing your payment.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    processPaymentReturn();
  }, [searchParams]);

  const handleContinue = () => {
    navigate('/dashboard/license');
  };

  const handleRetry = () => {
    navigate('/dashboard/license');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
            <p className="text-lg font-medium">Processing your payment...</p>
            <p className="text-sm text-gray-600 mt-2">Please wait while we verify your transaction.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {paymentResult?.success ? (
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          ) : (
            <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
          )}
          <CardTitle className="text-2xl">
            {paymentResult?.success ? 'Payment Successful!' : 'Payment Failed'}
          </CardTitle>
          <CardDescription className="text-base">
            {paymentResult?.message}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {paymentResult?.orderId && (
            <div className="bg-gray-100 p-3 rounded-md">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Order ID:</span> {paymentResult.orderId}
              </p>
            </div>
          )}
          
          <div className="flex flex-col gap-2">
            {paymentResult?.success ? (
              <Button onClick={handleContinue} className="w-full">
                Continue to License
              </Button>
            ) : (
              <Button onClick={handleRetry} variant="outline" className="w-full">
                Try Again
              </Button>
            )}
            
            <Button 
              onClick={() => navigate('/dashboard')} 
              variant="ghost" 
              className="w-full"
            >
              Back to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}