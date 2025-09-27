import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';

export default function LicensePage() {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  return (
    <div className='space-y-8 2xl:space-y-12'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>License</h1>
      </div>

      <div className='grid gap-6 md:grid-cols-2'>
        {/* Free Plan */}
        <Card>
          <CardHeader>
            <CardTitle className='text-xl'>Free</CardTitle>
            <CardDescription>Good for getting started</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className='list-disc pl-5 space-y-2 text-sm'>
              <li>Maximum 1 workspace / 1 project</li>
              <li>Maximum 5 people in a project</li>
            </ul>
          </CardContent>
          <CardFooter className='justify-between'>
            <span className='text-sm text-muted-foreground'>Current plan</span>
          </CardFooter>
        </Card>

        {/* Pro Plan */}
        <Card>
          <CardHeader>
            <CardTitle className='text-xl'>Pro</CardTitle>
            <CardDescription>For growing teams</CardDescription>
            <CardAction>
              <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
                <DialogTrigger asChild>
                  <Button size='lg'>Choose Pro</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Choose payment method</DialogTitle>
                    <DialogDescription>
                      Select a payment method to upgrade to Pro.
                    </DialogDescription>
                  </DialogHeader>

                  <div className='grid gap-4'>
                    <Card className='cursor-pointer hover:border-primary' onClick={() => setIsPaymentOpen(false)}>
                      <CardHeader>
                        <CardTitle className='text-base'>Credit / Debit Card</CardTitle>
                        <CardDescription>Pay securely with your card</CardDescription>
                      </CardHeader>
                    </Card>

                    <Card className='cursor-pointer hover:border-primary' onClick={() => setIsPaymentOpen(false)}>
                      <CardHeader>
                        <CardTitle className='text-base'>PayPal</CardTitle>
                        <CardDescription>Checkout with your PayPal account</CardDescription>
                      </CardHeader>
                    </Card>

                    <Card className='cursor-pointer hover:border-primary' onClick={() => setIsPaymentOpen(false)}>
                      <CardHeader>
                        <CardTitle className='text-base'>Bank Transfer</CardTitle>
                        <CardDescription>We’ll provide bank details after selection</CardDescription>
                      </CardHeader>
                    </Card>
                  </div>
                </DialogContent>
              </Dialog>
            </CardAction>
          </CardHeader>
          <CardContent>
            <ul className='list-disc pl-5 space-y-2 text-sm'>
              <li>Maximum 3 workspaces and 3 projects per workspace</li>
              <li>Maximum 10 people in a project</li>
            </ul>
          </CardContent>
          <CardFooter className='justify-between'>
            <span className='text-sm text-muted-foreground'>Upgrade to unlock more</span>
          </CardFooter>
        </Card>
      </div>

      {/* White space at the end */}
      <div className='h-16' />
    </div>
  );
}
