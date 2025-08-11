import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { CreditCard, TrendingUp, Users, AlertTriangle, CheckCircle, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const UsageSummarySection = () => {
  const [viewToggle, setViewToggle] = useState<"daily" | "weekly">("daily");
  const [teamsToggle, setTeamsToggle] = useState<"pooled" | "personal">("pooled");
  
  // Mock data - in real app this would come from API
  const currentPlan = {
    name: 'Pro',
    isTrialActive: true,
    trialDaysLeft: 8,
    briefsUsed: 187,
    briefsLimit: 250,
    resetDate: 'February 1st',
    overagePrice: 1.5
  };

  const usagePercentage = (currentPlan.briefsUsed / currentPlan.briefsLimit) * 100;
  
  const getUsageColor = (percentage: number) => {
    if (percentage < 70) return "text-accent-green-500";
    if (percentage <= 100) return "text-warn-400";
    return "text-error-500";
  };

  const getProgressColor = (percentage: number) => {
    if (percentage < 70) return "bg-accent-green-500";
    if (percentage <= 100) return "bg-warn-400"; 
    return "bg-error-500";
  };

  const dailyUsageData = [
    { date: '1', briefs: 12, topFeature: 'Email Brief' },
    { date: '2', briefs: 8, topFeature: 'Meeting Proxy' },
    { date: '3', briefs: 15, topFeature: 'Slack Brief' },
    { date: '4', briefs: 6, topFeature: 'Audio Brief' },
    { date: '5', briefs: 10, topFeature: 'Email Brief' },
    { date: '6', briefs: 0, topFeature: 'None' },
    { date: '7', briefs: 0, topFeature: 'None' },
    { date: '8', briefs: 14, topFeature: 'Catch Me Up' },
    { date: '9', briefs: 11, topFeature: 'Email Brief' },
    { date: '10', briefs: 9, topFeature: 'Meeting Proxy' }
  ];

  const weeklyUsageData = [
    { date: 'Week 1', briefs: 45, topFeature: 'Email Brief' },
    { date: 'Week 2', briefs: 52, topFeature: 'Slack Brief' },
    { date: 'Week 3', briefs: 41, topFeature: 'Meeting Proxy' },
    { date: 'Week 4', briefs: 49, topFeature: 'Email Brief' }
  ];

  const featureBreakdown = [
    { feature: 'Email Brief', isPro: false, creditsPerBrief: 1, usageCount: 68, totalCredits: 68, percentage: 36 },
    { feature: 'Slack Brief', isPro: false, creditsPerBrief: 1, usageCount: 45, totalCredits: 45, percentage: 24 },
    { feature: 'Meeting Proxy', isPro: true, creditsPerBrief: 2, usageCount: 22, totalCredits: 44, percentage: 24 },
    { feature: 'Audio Brief', isPro: true, creditsPerBrief: 1.5, usageCount: 20, totalCredits: 30, percentage: 16 }
  ];

  const teamMembers = [
    { name: 'Alex Johnson', role: 'Product Manager', briefsUsed: 45, creditsConsumed: 52, topFeature: 'Email Brief' },
    { name: 'Sarah Chen', role: 'Designer', briefsUsed: 38, creditsConsumed: 41, topFeature: 'Slack Brief' },
    { name: 'Michael Torres', role: 'Engineer', briefsUsed: 52, creditsConsumed: 68, topFeature: 'Meeting Proxy' },
    { name: 'Emma Davis', role: 'Marketing', briefsUsed: 32, creditsConsumed: 34, topFeature: 'Audio Brief' }
  ];

  const getInsightMessage = () => {
    if (currentPlan.isTrialActive) {
      const topFeature = featureBreakdown.find(f => f.isPro)?.feature;
      return `Don't lose your favorite features. You've used ${topFeature} ${featureBreakdown.find(f => f.feature === topFeature)?.usageCount} times. Upgrade now to keep it.`;
    }
    
    if (usagePercentage >= 100) {
      return `You're over your included credits. Add +25 briefs for $${currentPlan.overagePrice * 25}.`;
    }
    
    if (usagePercentage >= 80) {
      return `Heads up — you're almost at your limit. Buy +25 more for $${currentPlan.overagePrice * 25} or upgrade to Pro.`;
    }

    const topProFeature = featureBreakdown.find(f => f.isPro && f.percentage > 20);
    if (topProFeature && currentPlan.name === 'Core') {
      return `Your #1 feature is a Pro exclusive. Upgrade to unlock unlimited access.`;
    }

    return `You're using ${usagePercentage.toFixed(0)}% of your monthly credits. Great job staying within limits!`;
  };

  const getQuickActionButton = () => {
    if (currentPlan.isTrialActive) {
      return { text: "Upgrade to Keep Pro", variant: "default" as const };
    }
    
    switch (currentPlan.name) {
      case 'Core':
        return { text: "Upgrade to Pro", variant: "default" as const };
      case 'Pro':
        return { text: "Manage Plan", variant: "outline" as const };
      case 'Teams':
        return { text: "Manage Seats & Plan", variant: "outline" as const };
      default:
        return { text: "Manage Plan", variant: "outline" as const };
    }
  };

  const quickAction = getQuickActionButton();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">Usage Summary</h2>
            <p className="text-text-secondary mt-1 max-w-2xl">
              Track your briefs, see where they're going, and understand how much value Brief Me is delivering.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline"
              className="hidden sm:flex"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Buy +25 Briefs
            </Button>
            <Button variant={quickAction.variant}>
              {quickAction.text}
              <ArrowUpRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
        
        {currentPlan.isTrialActive ? (
          <div className="flex items-center gap-3 p-4 bg-warn-500/10 border border-warn-500/20 rounded-xl">
            <Badge variant="outline" className="bg-warn-500 text-text-inverse border-warn-500">
              Pro Trial — {currentPlan.trialDaysLeft} days left
            </Badge>
            <p className="text-sm text-text-secondary">
              You've enjoyed full access to all Pro features. See what you've used so far — and keep it going after your trial ends.
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Badge variant="outline">
              {currentPlan.name} Plan
            </Badge>
            <span className="text-sm text-text-secondary">
              Credits reset on {currentPlan.resetDate}
            </span>
          </div>
        )}
      </div>

      {/* Current Usage Overview */}
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

      {/* Teams Toggle (only for Teams plan) */}
      {currentPlan.name === 'Teams' && (
        <div className="flex justify-center">
          <Tabs value={teamsToggle} onValueChange={(value) => setTeamsToggle(value as "pooled" | "personal")}>
            <TabsList>
              <TabsTrigger value="pooled">Pooled Usage</TabsTrigger>
              <TabsTrigger value="personal">My Usage</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      )}

      {/* Usage Graph */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Usage Over Time</CardTitle>
            <Tabs value={viewToggle} onValueChange={(value) => setViewToggle(value as "daily" | "weekly")}>
              <TabsList>
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
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
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={viewToggle === "daily" ? dailyUsageData : weeklyUsageData}>
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
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                />
                <Bar 
                  dataKey="briefs" 
                  fill="hsl(var(--brand-200))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
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
                <TableHead>% of Usage</TableHead>
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
                  <TableCell>{feature.percentage}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Teams Member Breakdown (only for Teams plan and pooled view) */}
      {currentPlan.name === 'Teams' && teamsToggle === 'pooled' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Member Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Briefs Used</TableHead>
                  <TableHead>Credits Consumed</TableHead>
                  <TableHead>Top Feature</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembers.map((member) => (
                  <TableRow key={member.name}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell className="text-text-secondary">{member.role}</TableCell>
                    <TableCell>{member.briefsUsed}</TableCell>
                    <TableCell>{member.creditsConsumed}</TableCell>
                    <TableCell>{member.topFeature}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Insights Section */}
      <Card className="border-l-4 border-l-accent-green-500">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            {usagePercentage >= 80 ? (
              <AlertTriangle className="h-5 w-5 text-warn-400 mt-0.5 flex-shrink-0" />
            ) : (
              <CheckCircle className="h-5 w-5 text-accent-green-500 mt-0.5 flex-shrink-0" />
            )}
            <div>
              <h3 className="font-medium text-text-primary mb-1">Insights</h3>
              <p className="text-text-secondary">{getInsightMessage()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button>
              <CreditCard className="h-4 w-4 mr-2" />
              Buy +25 Briefs
            </Button>
            <Button variant="outline">
              View Plan & Billing Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsageSummarySection;