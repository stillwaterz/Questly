import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import authService from '../services/authService';

const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ email: '', password: '', name: '' });
  const { toast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = await authService.login(loginForm.email, loginForm.password);
      onLogin(user);
      toast({
        title: "Welcome back!",
        description: `Successfully logged in as ${user.name}`,
      });
      onClose();
      setLoginForm({ email: '', password: '' });
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error.response?.data?.detail || "Invalid email or password",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = await authService.register(registerForm.email, registerForm.password, registerForm.name);
      onLogin(user);
      toast({
        title: "Welcome to Questly!",
        description: `Account created successfully for ${user.name}`,
      });
      onClose();
      setRegisterForm({ email: '', password: '', name: '' });
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error.response?.data?.detail || "Failed to create account",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginChange = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value
    });
  };

  const handleRegisterChange = (e) => {
    setRegisterForm({
      ...registerForm,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-sky-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">Q</span>
            </div>
            <div>
              <div className="text-lg font-semibold text-slate-800">Join Questly</div>
              <div className="text-sm text-slate-600">Start your career discovery journey</div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="login" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="register">Sign Up</TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="login-email" className="text-sm font-medium text-slate-700">
                  Email Address
                </Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="login-email"
                    name="email"
                    type="email"
                    value={loginForm.email}
                    onChange={handleLoginChange}
                    placeholder="your.email@example.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="login-password" className="text-sm font-medium text-slate-700">
                  Password
                </Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="login-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={loginForm.password}
                    onChange={handleLoginChange}
                    placeholder="Enter your password"
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
          </TabsContent>

          {/* Register Tab */}
          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <Label htmlFor="register-name" className="text-sm font-medium text-slate-700">
                  Full Name
                </Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="register-name"
                    name="name"
                    type="text"
                    value={registerForm.name}
                    onChange={handleRegisterChange}
                    placeholder="Your full name"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="register-email" className="text-sm font-medium text-slate-700">
                  Email Address
                </Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="register-email"
                    name="email"
                    type="email"
                    value={registerForm.email}
                    onChange={handleRegisterChange}
                    placeholder="your.email@example.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="register-password" className="text-sm font-medium text-slate-700">
                  Password
                </Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="register-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={registerForm.password}
                    onChange={handleRegisterChange}
                    placeholder="Choose a password (min 6 characters)"
                    className="pl-10 pr-10"
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Password must be at least 6 characters long
                </p>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
          <p className="text-sm text-emerald-700">
            <strong>Why sign up?</strong><br />
            Save your career discoveries, get personalized recommendations, and connect with mentors across South Africa.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;