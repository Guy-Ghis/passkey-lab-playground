import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Shield, Clock, TrendingUp, Lock, Fingerprint, CreditCard } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  username: string;
  publicKey?: string;
  createdAt: Date;
}

interface ConversionMetric {
  flow: 'passkey' | 'password';
  startTime: number;
  endTime?: number;
  duration?: number;
  completed: boolean;
}

const PasskeyLab: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'register' | 'login' | 'dashboard' | 'banking'>('home');
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authFlow, setAuthFlow] = useState<'passkey' | 'password'>('passkey');
  const [conversionMetrics, setConversionMetrics] = useState<ConversionMetric[]>([]);
  const [currentMetric, setCurrentMetric] = useState<ConversionMetric | null>(null);
  const [transactionAmount, setTransactionAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Simulate WebAuthn support check
  const isWebAuthnSupported = typeof window !== 'undefined' && 
    window.PublicKeyCredential && 
    typeof window.PublicKeyCredential === 'function';

  const startConversionTracking = (flow: 'passkey' | 'password') => {
    const metric: ConversionMetric = {
      flow,
      startTime: Date.now(),
      completed: false
    };
    setCurrentMetric(metric);
  };

  const completeConversionTracking = () => {
    if (currentMetric) {
      const completedMetric = {
        ...currentMetric,
        endTime: Date.now(),
        duration: Date.now() - currentMetric.startTime,
        completed: true
      };
      setConversionMetrics(prev => [...prev, completedMetric]);
      setCurrentMetric(null);
      
      toast({
        title: "Conversion Tracked",
        description: `${completedMetric.flow} flow completed in ${(completedMetric.duration! / 1000).toFixed(1)}s`,
      });
    }
  };

  // Simulate passkey registration
  const handlePasskeyRegistration = async () => {
    if (!username.trim()) {
      toast({
        title: "Error",
        description: "Please enter a username",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!isWebAuthnSupported) {
        throw new Error("WebAuthn not supported in this browser");
      }

      // Simulate successful passkey creation
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        username: username.trim(),
        publicKey: 'simulated-public-key-' + Date.now(),
        createdAt: new Date()
      };

      setUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      completeConversionTracking();
      
      toast({
        title: "Registration Successful",
        description: "Passkey registered successfully!",
      });
      
      setCurrentView('dashboard');
      setUsername('');
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate password registration
  const handlePasswordRegistration = async () => {
    if (!username.trim() || !password.trim()) {
      toast({
        title: "Error",
        description: "Please enter username and password",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate longer network delay for password flow
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        username: username.trim(),
        createdAt: new Date()
      };

      setUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      completeConversionTracking();
      
      toast({
        title: "Registration Successful",
        description: "Account created successfully!",
      });
      
      setCurrentView('dashboard');
      setUsername('');
      setPassword('');
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Failed to create account",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate passkey authentication
  const handlePasskeyLogin = async () => {
    if (!username.trim()) {
      toast({
        title: "Error",
        description: "Please enter a username",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const user = users.find(u => u.username === username.trim());
      if (!user || !user.publicKey) {
        throw new Error("User not found or no passkey registered");
      }

      setCurrentUser(user);
      completeConversionTracking();
      
      toast({
        title: "Login Successful",
        description: "Authenticated with passkey!",
      });
      
      setCurrentView('dashboard');
      setUsername('');
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Authentication failed",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate step-up authentication for high-value transactions
  const handleTransaction = async () => {
    const amount = parseFloat(transactionAmount);
    
    if (amount > 150) {
      // Trigger step-up authentication
      setIsLoading(true);
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        toast({
          title: "Step-up Authentication Required",
          description: "High-value transaction requires additional verification",
        });
        
        // Simulate step-up passkey authentication
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        toast({
          title: "Transaction Approved",
          description: `€${amount} transaction completed with step-up authentication`,
        });
        
        setTransactionAmount('');
      } catch (error) {
        toast({
          title: "Transaction Failed",
          description: "Step-up authentication failed",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      toast({
        title: "Transaction Approved",
        description: `€${amount} transaction completed`,
      });
      setTransactionAmount('');
    }
  };

  const averageConversionTime = (flow: 'passkey' | 'password') => {
    const flowMetrics = conversionMetrics.filter(m => m.flow === flow && m.completed);
    if (flowMetrics.length === 0) return 0;
    return flowMetrics.reduce((sum, m) => sum + (m.duration || 0), 0) / flowMetrics.length;
  };

  const renderHome = () => (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-security">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-primary rounded-full">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Passkey Lab</CardTitle>
          <CardDescription>
            Explore the future of authentication with WebAuthn and FIDO2
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={() => {
              setCurrentView('register');
              startConversionTracking('passkey');
            }}
            className="w-full bg-gradient-primary hover:shadow-security transition-all duration-300"
          >
            <Fingerprint className="mr-2 h-4 w-4" />
            Get Started
          </Button>
          
          <div className="flex items-center justify-center space-x-2">
            <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
              <CheckCircle className="mr-1 h-3 w-3" />
              WebAuthn Ready
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderRegister = () => (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-card-custom">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>Choose your preferred authentication method</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={authFlow} onValueChange={(value) => setAuthFlow(value as 'passkey' | 'password')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="passkey">Passkey</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
            
            <TabsContent value="passkey" className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                />
              </div>
              <Button 
                onClick={handlePasskeyRegistration}
                disabled={isLoading}
                className="w-full bg-gradient-primary hover:shadow-security"
              >
                {isLoading ? <Clock className="mr-2 h-4 w-4 animate-spin" /> : <Fingerprint className="mr-2 h-4 w-4" />}
                {isLoading ? 'Creating...' : 'Register with Passkey'}
              </Button>
            </TabsContent>
            
            <TabsContent value="password" className="space-y-4">
              <div>
                <Label htmlFor="username-pwd">Username</Label>
                <Input
                  id="username-pwd"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </div>
              <Button 
                onClick={handlePasswordRegistration}
                disabled={isLoading}
                className="w-full"
                variant="secondary"
              >
                {isLoading ? <Clock className="mr-2 h-4 w-4 animate-spin" /> : <Lock className="mr-2 h-4 w-4" />}
                {isLoading ? 'Creating...' : 'Register with Password'}
              </Button>
            </TabsContent>
          </Tabs>
          
          <div className="mt-4 text-center">
            <Button 
              variant="ghost" 
              onClick={() => {
                setCurrentView('login');
                startConversionTracking(authFlow);
              }}
            >
              Already have an account? Sign in
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderLogin = () => (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-card-custom">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Access your account securely</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="login-username">Username</Label>
            <Input
              id="login-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </div>
          <Button 
            onClick={handlePasskeyLogin}
            disabled={isLoading}
            className="w-full bg-gradient-primary hover:shadow-security"
          >
            {isLoading ? <Clock className="mr-2 h-4 w-4 animate-spin" /> : <Fingerprint className="mr-2 h-4 w-4" />}
            {isLoading ? 'Signing in...' : 'Sign in with Passkey'}
          </Button>
          
          <div className="text-center">
            <Button 
              variant="ghost" 
              onClick={() => {
                setCurrentView('register');
                startConversionTracking('passkey');
              }}
            >
              Don't have an account? Sign up
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderDashboard = () => (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {currentUser?.username}</h1>
            <p className="text-muted-foreground">Your secure dashboard</p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => setCurrentView('banking')} variant="outline">
              <CreditCard className="mr-2 h-4 w-4" />
              Banking Demo
            </Button>
            <Button onClick={() => setCurrentView('home')} variant="ghost">
              Sign Out
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-card-custom">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-primary" />
                Security Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Passkey Enabled</span>
                  <Badge className="bg-success/10 text-success border-success/20">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Two-Factor Auth</span>
                  <Badge className="bg-success/10 text-success border-success/20">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Enabled
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card-custom">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-secondary" />
                Conversion Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Passkey Avg</span>
                  <Badge variant="secondary">
                    {(averageConversionTime('passkey') / 1000).toFixed(1)}s
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Password Avg</span>
                  <Badge variant="outline">
                    {(averageConversionTime('password') / 1000).toFixed(1)}s
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card-custom">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-accent" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Registered: {currentUser?.createdAt.toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderBanking = () => (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Banking Demo</h1>
            <p className="text-muted-foreground">Step-up authentication for high-value transactions</p>
          </div>
          <Button onClick={() => setCurrentView('dashboard')} variant="outline">
            Back to Dashboard
          </Button>
        </div>

        <Card className="shadow-card-custom">
          <CardHeader>
            <CardTitle>Make a Transfer</CardTitle>
            <CardDescription>
              Transactions over €150 require step-up authentication (PSD3 compliance)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="amount">Amount (EUR)</Label>
              <Input
                id="amount"
                type="number"
                value={transactionAmount}
                onChange={(e) => setTransactionAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
            
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                {parseFloat(transactionAmount || '0') > 150 
                  ? "⚠️ High-value transaction - Step-up authentication required"
                  : "✅ Standard authentication sufficient"
                }
              </p>
            </div>

            <Button 
              onClick={handleTransaction}
              disabled={isLoading || !transactionAmount}
              className="w-full bg-gradient-secondary hover:shadow-success"
            >
              {isLoading ? <Clock className="mr-2 h-4 w-4 animate-spin" /> : <CreditCard className="mr-2 h-4 w-4" />}
              {isLoading ? 'Processing...' : 'Confirm Transfer'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {currentView === 'home' && renderHome()}
      {currentView === 'register' && renderRegister()}
      {currentView === 'login' && renderLogin()}
      {currentView === 'dashboard' && renderDashboard()}
      {currentView === 'banking' && renderBanking()}
    </div>
  );
};

export default PasskeyLab;