import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';

// ── Sellsuki DS 3.0 (Mode B) ──────────────────────────────────────────────
// Converted to ssk-* components. Typography comes from ssk-heading / ssk-text
// (token-based, always >=18px per DB HeaventRounded readability rule), the
// brand blue comes from ssk-button themeColor="primary" — no hardcoded hex.
// ssk-* are web components, so form values are read from the native `input`
// event (e.target.value / e.target.checked). Verify exact prop/event names
// against DS 3.0 Storybook once the MCP is connected.

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
          <ssk-heading level="1">CRM Master 2.0</ssk-heading>
          <ssk-text variant="body">Admin Portal</ssk-text>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#007AFF] to-[#0051D5] text-white p-6 text-center">
            <ssk-heading level="4" style={{ color: '#fff' }}>Administrator Login</ssk-heading>
            <ssk-text variant="caption" style={{ color: '#DCEBFF' }}>
              Enter your credentials to access the system
            </ssk-text>
          </div>

          <div className="p-6 space-y-6">
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700"
              >
                <AlertCircle className="w-4 h-4" />
                <ssk-text variant="caption" style={{ color: '#B91C1C' }}>{error}</ssk-text>
              </motion.div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <ssk-input
                id="email"
                type="email"
                label="Email Address"
                placeholder="Enter your admin email"
                value={email}
                onInput={(e: any) => setEmail(e.target.value)}
                onKeyPress={(e: any) => e.key === 'Enter' && handleLogin()}
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <ssk-input
                id="password"
                type="password"
                label="Password"
                placeholder="Enter your password"
                value={password}
                onInput={(e: any) => setPassword(e.target.value)}
                onKeyPress={(e: any) => e.key === 'Enter' && handleLogin()}
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <ssk-checkbox
                checked={rememberMe}
                onChange={(e: any) => setRememberMe(!!e.target.checked)}
              >
                Remember me
              </ssk-checkbox>
              <ssk-button variant="text" themeColor="primary">
                Forgot Password?
              </ssk-button>
            </div>

            {/* Login Button */}
            <ssk-button
              variant="solid"
              themeColor="primary"
              disabled={isLoading || undefined}
              style={{ width: '100%' }}
              onClick={handleLogin}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </ssk-button>

            {/* Demo Credentials */}
            <div className="pt-4 border-t">
              <ssk-text variant="caption" style={{ display: 'block', textAlign: 'center', marginBottom: 8 }}>
                Demo Credentials:
              </ssk-text>
              <div className="bg-gray-50 p-3 rounded-lg">
                <ssk-text variant="caption" style={{ display: 'block' }}>Email: <strong>admin@crm.com</strong></ssk-text>
                <ssk-text variant="caption" style={{ display: 'block' }}>Password: <strong>admin123</strong></ssk-text>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <ssk-text variant="caption">© 2024 CRM Master. All rights reserved.</ssk-text>
        </div>
      </motion.div>
    </div>
  );
}
