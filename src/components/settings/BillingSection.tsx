import React, { useState } from 'react';
import { CreditCard, Download, ExternalLink, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

const BillingSection = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const { toast } = useToast();

  // Mock data - in real app this would come from your backend/Stripe
  const currentPlan = {
    name: 'Core',
    isTrialPlan: false,
    trialDaysLeft: 8,
    nextBillingDate: '2024-02-15'
  };

  const usage = {
    used: 87,
    total: 150,
    resetDate: 'February 1st'
  };

  const usagePercentage = (usage.used / usage.total) * 100;
  const getUsageColor = () => {
    if (usagePercentage < 70) return 'bg-accent-green-500';
    if (usagePercentage <= 100) return 'bg-warn-400';
    return 'bg-error-500';
  };

  const plans = {
    core: {
      name: 'Core',
      monthlyPrice: 15,
      annualPrice: 12,
      briefsLimit: 150,
      overagePrice: 2,
      features: ['150 briefs/month', 'Email summaries', 'Basic integrations', 'Standard support']
    },
    pro: {
      name: 'Pro',
      monthlyPrice: 20,
      annualPrice: 16,
      briefsLimit: 250,
      overagePrice: 1.5,
      features: ['250 briefs/month', 'Audio briefs', 'Advanced integrations', 'Priority support', 'Custom scheduling']
    }
  };

  const invoices = [
    { id: 'inv_001', date: '2024-01-15', amount: '$15.00', status: 'Paid', downloadUrl: '#' },
    { id: 'inv_002', date: '2023-12-15', amount: '$15.00', status: 'Paid', downloadUrl: '#' },
    { id: 'inv_003', date: '2023-11-15', amount: '$15.00', status: 'Paid', downloadUrl: '#' },
  ];

  const handleUpgradePlan = () => {
    toast({
      title: "Redirecting to checkout...",
      description: "You'll be redirected to complete your upgrade.",
    });
  };

  const handleBuyBriefs = () => {
    toast({
      title: "Purchase successful!",
      description: "25 additional briefs have been added to your account.",
    });
  };

  const handleCancelSubscription = () => {
    setShowCancelModal(false);
    toast({
      title: "Subscription cancelled",
      description: "Your subscription will remain active until the end of your billing period.",
      variant: "destructive"
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-text-primary mb-2">Billing & Usage</h2>
        <p className="text-text-secondary">Manage your subscription and monitor usage</p>
      </div>

      {/* Current Plan Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Current Plan</span>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{currentPlan.name}</Badge>
              {currentPlan.isTrialPlan && (
                <Badge variant="outline">Trial - {currentPlan.trialDaysLeft} days left</Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-text-secondary">Billing frequency:</span>
              <div className="flex items-center gap-2">
                <span className={!isAnnual ? 'text-text-primary font-medium' : 'text-text-secondary'}>Monthly</span>
                <Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
                <span className={isAnnual ? 'text-text-primary font-medium' : 'text-text-secondary'}>Annual</span>
                {isAnnual && <Badge variant="secondary" className="bg-accent-green-500/20 text-accent-green-500">Save 20%</Badge>}
              </div>
            </div>
            <Button onClick={handleUpgradePlan} size="sm">
              {currentPlan.name === 'Core' ? 'Upgrade Plan' : 'Manage Plan'}
            </Button>
          </div>
          <div className="text-sm text-text-secondary">
            Next billing date: {currentPlan.nextBillingDate}
          </div>
        </CardContent>
      </Card>

      {/* Usage Overview Section */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Briefs used this month</span>
              <span className="text-text-primary font-medium">{usage.used} / {usage.total}</span>
            </div>
            <Progress value={usagePercentage} className="h-3" />
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-text-secondary">
              Your credits reset on {usage.resetDate}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleBuyBriefs}
              className="text-accent-green-500 border-accent-green-500 hover:bg-accent-green-500/10"
            >
              Buy +25 Briefs for $5
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Plan Details Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-text-primary">Plan Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Core Plan */}
          <Card className={currentPlan.name === 'Core' ? 'ring-2 ring-accent-green-500' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Core</span>
                {currentPlan.name === 'Core' && (
                  <Badge className="bg-accent-green-500">Your Plan</Badge>
                )}
              </CardTitle>
              <CardDescription>
                <span className="text-2xl font-bold text-text-primary">
                  ${isAnnual ? plans.core.annualPrice : plans.core.monthlyPrice}
                </span>
                <span className="text-text-secondary">/mo {isAnnual && '(billed annually)'}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {plans.core.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-text-secondary">
                    <div className="w-1.5 h-1.5 bg-accent-green-500 rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
                <li className="flex items-center text-text-secondary">
                  <div className="w-1.5 h-1.5 bg-accent-green-500 rounded-full mr-3"></div>
                  ${plans.core.overagePrice} per +25 briefs
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Pro</span>
                <Badge variant="outline">Upgrade</Badge>
              </CardTitle>
              <CardDescription>
                <span className="text-2xl font-bold text-text-primary">
                  ${isAnnual ? plans.pro.annualPrice : plans.pro.monthlyPrice}
                </span>
                <span className="text-text-secondary">/mo {isAnnual && '(billed annually)'}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm">
                {plans.pro.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-text-secondary">
                    <div className="w-1.5 h-1.5 bg-accent-green-500 rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
                <li className="flex items-center text-text-secondary">
                  <div className="w-1.5 h-1.5 bg-accent-green-500 rounded-full mr-3"></div>
                  ${plans.pro.overagePrice} per +25 briefs
                </li>
              </ul>
              <Button onClick={handleUpgradePlan} className="w-full">
                Upgrade to Pro
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payment & Invoices Section */}
      <Card>
        <CardHeader>
          <CardTitle>Payment & Invoices</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-text-secondary" />
              <div>
                <div className="text-text-primary font-medium">•••• •••• •••• 4242</div>
                <div className="text-sm text-text-secondary">Expires 12/2025</div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              Update
            </Button>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="font-medium text-text-primary">Invoice History</h4>
            <div className="space-y-3">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="text-sm font-medium text-text-primary">{invoice.date}</div>
                      <div className="text-xs text-text-secondary">{invoice.id}</div>
                    </div>
                    <Badge variant="outline" className="text-accent-green-500 border-accent-green-500">
                      {invoice.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-text-primary">{invoice.amount}</span>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cancel or Change Plan Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-text-primary">Need to make changes?</h4>
              <p className="text-sm text-text-secondary">You can cancel your subscription at any time</p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-error-500 border-error-500 hover:bg-error-500/10">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Cancel Subscription
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to cancel your subscription? You'll continue to have access to your current plan until the end of your billing period.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                  <AlertDialogAction onClick={handleCancelSubscription} className="bg-error-500 hover:bg-error-500/80">
                    Cancel Subscription
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingSection;