import React, { useState } from 'react';
import { CreditCard, Download, ExternalLink, AlertTriangle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
const BillingSection = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [autoBillEnabled, setAutoBillEnabled] = useState(false);
  const { toast } = useToast();

  // Mock data - in real app this would come from your backend/Stripe
  const currentPlan = {
    name: 'Core',
    isTrialPlan: false,
    trialDaysLeft: 8,
    nextBillingDate: '2024-02-15',
    briefsUsed: 87,
    briefsLimit: 150,
    resetDate: 'February 1st'
  };
  
  const usagePercentage = (currentPlan.briefsUsed / currentPlan.briefsLimit) * 100;

  // Usage graph data
  const dailyUsageData = [
    { date: '1', briefs: 12 }, { date: '2', briefs: 8 }, { date: '3', briefs: 15 },
    { date: '4', briefs: 6 }, { date: '5', briefs: 10 }, { date: '6', briefs: 0 },
    { date: '7', briefs: 0 }, { date: '8', briefs: 14 }, { date: '9', briefs: 11 },
    { date: '10', briefs: 9 }, { date: '11', briefs: 8 }, { date: '12', briefs: 7 }
  ];

  // Feature breakdown data
  const featureBreakdown = [
    { feature: 'Email Brief', isPro: false, creditsPerBrief: 1, usageCount: 35, totalCredits: 35 },
    { feature: 'Slack Brief', isPro: false, creditsPerBrief: 1, usageCount: 28, totalCredits: 28 },
    { feature: 'Meeting Proxy', isPro: true, creditsPerBrief: 2, usageCount: 12, totalCredits: 24 },
    { feature: 'Audio Brief', isPro: true, creditsPerBrief: 1.5, usageCount: 0, totalCredits: 0 }
  ];
  const getUsageColor = (percentage: number) => {
    if (percentage < 70) return 'text-accent-green-500';
    if (percentage <= 100) return 'text-warn-400';
    return 'text-error-500';
  };

  const getProgressColor = (percentage: number) => {
    if (percentage < 70) return 'bg-accent-green-500';
    if (percentage <= 100) return 'bg-warn-400';
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
    },
    teams: {
      name: 'Teams',
      monthlyPrice: 20,
      annualPrice: 18,
      briefsLimit: 'Pooled across team',
      overagePrice: 1.5,
      features: ['Pooled briefs across team', 'Central admin dashboard', 'Role-based access controls', 'Shared team briefs & onboarding flows', 'Priority support & SLAs'],
      isPerUser: true
    }
  };
  const invoices = [{
    id: 'inv_001',
    date: '2024-01-15',
    amount: '$15.00',
    status: 'Paid',
    downloadUrl: '#'
  }, {
    id: 'inv_002',
    date: '2023-12-15',
    amount: '$15.00',
    status: 'Paid',
    downloadUrl: '#'
  }, {
    id: 'inv_003',
    date: '2023-11-15',
    amount: '$15.00',
    status: 'Paid',
    downloadUrl: '#'
  }];
  const handleUpgradePlan = () => {
    toast({
      title: "Redirecting to checkout...",
      description: "You'll be redirected to complete your upgrade."
    });
  };
  const handleCancelSubscription = () => {
    toast({
      title: "Subscription cancelled",
      description: "Your subscription will remain active until the end of your billing period.",
      variant: "destructive"
    });
  };

  const handleAutoBillToggle = (enabled: boolean) => {
    setAutoBillEnabled(enabled);
    const currentPlanKey = currentPlan.name.toLowerCase() as keyof typeof plans;
    const overagePrice = plans[currentPlanKey]?.overagePrice || plans.core.overagePrice;
    
    if (enabled) {
      toast({
        title: "Auto-billing enabled",
        description: `We'll automatically add +25 briefs for $${(overagePrice * 25).toFixed(2)} when you reach your limit.`
      });
    } else {
      toast({
        title: "Auto-billing disabled",
        description: "Brief generation will pause when you reach your limit."
      });
    }
  };
  return <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-text-primary mb-2">Billing & Usage</h2>
        <p className="text-text-secondary">Manage your subscription and monitor usage</p>
      </div>

      {/* Usage Summary Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Current Usage Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className={cn("text-2xl font-bold", getUsageColor(usagePercentage))}>
                {currentPlan.briefsUsed} / {currentPlan.briefsLimit}
              </span>
              <span className="text-sm text-text-secondary">briefs used this month</span>
            </div>
            <Progress 
              value={Math.min(usagePercentage, 100)} 
              className="h-3"
            />
            <div className="flex justify-between text-sm">
              <span className={cn(getUsageColor(usagePercentage))}>
                {usagePercentage >= 100 ? "Overage rates apply" 
                 : usagePercentage >= 80 ? "You're almost at your limit" 
                 : `${usagePercentage.toFixed(0)}% used`}
              </span>
              <span className="text-text-secondary">Resets {currentPlan.resetDate}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Graph */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              briefs: {
                label: "Briefs",
                color: "hsl(var(--brand-200))"
              }
            }}
            className="h-[300px]"
          >
            <BarChart data={dailyUsageData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--text-secondary))' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--text-secondary))' }}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-brand-700 p-3 rounded-lg border border-brand-600 shadow-lg">
                        <p className="text-text-primary">{`Day ${label}: ${payload[0].value} briefs`}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar 
                dataKey="briefs" 
                fill="hsl(var(--brand-200))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Feature Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Feature Name</TableHead>
                <TableHead>Credits per Brief</TableHead>
                <TableHead>Usage Count</TableHead>
                <TableHead>Total Credits</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {featureBreakdown.map((feature) => (
                <TableRow key={feature.feature}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{feature.feature}</span>
                      {feature.isPro && (
                        <Badge variant="outline" className="bg-warn-400/20 text-warn-400 border-warn-400/40">
                          Pro
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{feature.creditsPerBrief}</TableCell>
                  <TableCell>{feature.usageCount}</TableCell>
                  <TableCell>{feature.totalCredits}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Current Plan Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Current Plan</span>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{currentPlan.name}</Badge>
              {currentPlan.isTrialPlan && <Badge variant="outline">Trial - {currentPlan.trialDaysLeft} days left</Badge>}
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
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="text-text-secondary">Auto-bill additional briefs:</span>
                <Switch 
                  checked={autoBillEnabled} 
                  onCheckedChange={handleAutoBillToggle} 
                />
                <span className={autoBillEnabled ? 'text-text-primary font-medium' : 'text-text-secondary'}>
                  {autoBillEnabled ? 'ON' : 'OFF'}
                </span>
                {autoBillEnabled && (
                  <span className="text-sm text-text-secondary">
                    ${(plans[currentPlan.name.toLowerCase() as keyof typeof plans]?.overagePrice * 25).toFixed(2)} per 25 briefs
                  </span>
                )}
              </div>
              <Button onClick={handleUpgradePlan} size="sm">
                {currentPlan.name === 'Core' ? 'Upgrade Plan' : 'Manage Plan'}
              </Button>
            </div>
          </div>
          <div className="text-sm text-text-secondary">
            Next billing date: {currentPlan.nextBillingDate}
          </div>
        </CardContent>
      </Card>


      {/* Plan Details Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-text-primary">Plan Details</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Core Plan */}
          <Card className={currentPlan.name === 'Core' ? 'ring-2 ring-accent-green-500' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Core</span>
                {currentPlan.name === 'Core' && <Badge className="bg-accent-green-500">Your Plan</Badge>}
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
                {plans.core.features.map((feature, index) => <li key={index} className="flex items-center text-text-secondary">
                    <div className="w-1.5 h-1.5 bg-accent-green-500 rounded-full mr-3"></div>
                    {feature}
                  </li>)}
                
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
                {plans.pro.features.map((feature, index) => <li key={index} className="flex items-center text-text-secondary">
                    <div className="w-1.5 h-1.5 bg-accent-green-500 rounded-full mr-3"></div>
                    {feature}
                  </li>)}
                
              </ul>
              <Button onClick={handleUpgradePlan} className="w-full">
                Upgrade to Pro
              </Button>
            </CardContent>
          </Card>

          {/* Teams Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Teams</span>
                <Badge variant="outline">Contact Sales</Badge>
              </CardTitle>
              <CardDescription>
                <span className="text-2xl font-bold text-text-primary">
                  ${isAnnual ? plans.teams.annualPrice : plans.teams.monthlyPrice}
                </span>
                <span className="text-text-secondary">/user/mo {isAnnual && '(billed annually)'}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-text-secondary mb-3">
                Everything in Pro plus:
              </div>
              <ul className="space-y-2 text-sm">
                {plans.teams.features.map((feature, index) => <li key={index} className="flex items-center text-text-secondary">
                    <div className="w-1.5 h-1.5 bg-accent-green-500 rounded-full mr-3"></div>
                    {feature}
                  </li>)}
                <li className="flex items-center text-text-secondary">
                  <div className="w-1.5 h-1.5 bg-accent-green-500 rounded-full mr-3"></div>
                  Same overage as Pro at team level
                </li>
              </ul>
              <Button onClick={handleUpgradePlan} className="w-full" variant="outline">
                Contact Sales
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
              {invoices.map(invoice => <div key={invoice.id} className="flex items-center justify-between py-2">
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
                </div>)}
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
    </div>;
};
export default BillingSection;