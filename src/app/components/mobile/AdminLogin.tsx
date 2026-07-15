import { useState } from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (email === 'admin@crm.com' && password === 'admin123') {
        toast.success('Login successful! Welcome back.');
        onLoginSuccess();
      } else {
        setError('Invalid email or password');
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-[#007AFF] to-[#0051D5] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white text-3xl">C</span>
          </div>
          <h1 className="text-gray-900 mb-2">CRM Master 2.0</h1>
          <p className="text-gray-600">Admin Portal</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-[#007AFF] to-[#0051D5] text-white rounded-t-xl">
            <h2 className="text-white text-center">Administrator Login</h2>
            <p className="text-blue-100 text-sm text-center mt-1">
              Enter your credentials to access the system
            </p>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700"
              >
                <AlertCircle className="w-4 h-4" />
                <p className="text-sm">{error}</p>
              </motion.div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="h-12"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="h-12"
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox 
                  checked={rememberMe} 
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label className="text-sm text-gray-600 cursor-pointer">
                  Remember me
                </Label>
              </div>
              <button className="text-sm text-[#007AFF] hover:underline">
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <Button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full h-12 bg-[#007AFF] hover:bg-[#0051D5] text-white"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Logging in...</span>
                </div>
              ) : (
                'Login'
              )}
            </Button>

            {/* Demo Credentials */}
            <div className="pt-4 border-t">
              <p className="text-xs text-gray-500 text-center mb-2">Demo Credentials:</p>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600">Email: <strong>admin@crm.com</strong></p>
                <p className="text-xs text-gray-600">Password: <strong>admin123</strong></p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          © 2024 CRM Master. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
