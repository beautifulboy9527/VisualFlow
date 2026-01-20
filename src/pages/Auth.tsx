import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/layout/Logo';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Loader2, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { z } from 'zod';

const emailSchema = z.string().email();
const passwordSchema = z.string().min(6);

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user, signIn, signUp, loading: authLoading } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>({});

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    try {
      emailSchema.parse(formData.email);
    } catch {
      newErrors.email = language === 'zh' ? '请输入有效的邮箱地址' : 'Please enter a valid email';
    }
    
    try {
      passwordSchema.parse(formData.password);
    } catch {
      newErrors.password = language === 'zh' ? '密码至少需要 6 个字符' : 'Password must be at least 6 characters';
    }
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = language === 'zh' ? '两次输入的密码不一致' : 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          // Handle specific error messages
          if (error.message.includes('Invalid login credentials')) {
            toast({
              title: language === 'zh' ? '登录失败' : 'Login Failed',
              description: language === 'zh' ? '邮箱或密码错误' : 'Invalid email or password',
              variant: 'destructive',
            });
          } else {
            toast({
              title: language === 'zh' ? '登录失败' : 'Login Failed',
              description: error.message,
              variant: 'destructive',
            });
          }
        } else {
          toast({
            title: language === 'zh' ? '登录成功' : 'Welcome Back!',
            description: language === 'zh' ? '正在跳转...' : 'Redirecting...',
          });
          navigate('/');
        }
      } else {
        const { error } = await signUp(formData.email, formData.password);
        if (error) {
          // Handle specific error messages
          if (error.message.includes('User already registered')) {
            toast({
              title: language === 'zh' ? '注册失败' : 'Registration Failed',
              description: language === 'zh' ? '该邮箱已被注册' : 'This email is already registered',
              variant: 'destructive',
            });
          } else {
            toast({
              title: language === 'zh' ? '注册失败' : 'Registration Failed',
              description: error.message,
              variant: 'destructive',
            });
          }
        } else {
          toast({
            title: language === 'zh' ? '注册成功' : 'Account Created!',
            description: language === 'zh' ? '欢迎加入 VisualFlow' : 'Welcome to VisualFlow',
          });
          navigate('/');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-mesh flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-liquid" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-foreground/10 rounded-full blur-3xl animate-liquid" style={{ animationDelay: '-4s' }} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo size="lg" showText={true} />
        </div>

        {/* Auth Card */}
        <div className="bg-card/90 backdrop-blur-xl rounded-2xl border border-border/50 p-8 shadow-lg">
          {/* Toggle */}
          <div className="flex bg-secondary/50 p-1 rounded-lg mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all ${
                isLogin 
                  ? 'bg-card text-foreground shadow-sm' 
                  : 'text-foreground-muted hover:text-foreground'
              }`}
            >
              {language === 'zh' ? '登录' : 'Sign In'}
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all ${
                !isLogin 
                  ? 'bg-card text-foreground shadow-sm' 
                  : 'text-foreground-muted hover:text-foreground'
              }`}
            >
              {language === 'zh' ? '注册' : 'Sign Up'}
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                {language === 'zh' ? '邮箱' : 'Email'}
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
                <Input
                  id="email"
                  type="email"
                  placeholder={language === 'zh' ? '请输入邮箱' : 'Enter your email'}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                {language === 'zh' ? '密码' : 'Password'}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={language === 'zh' ? '请输入密码' : 'Enter your password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`pl-10 pr-10 ${errors.password ? 'border-destructive' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password (Sign Up only) */}
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  {language === 'zh' ? '确认密码' : 'Confirm Password'}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={language === 'zh' ? '请再次输入密码' : 'Confirm your password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className={`pl-10 ${errors.confirmPassword ? 'border-destructive' : ''}`}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="generate"
              size="lg"
              className="w-full mt-6"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {language === 'zh' ? '请稍候...' : 'Please wait...'}
                </>
              ) : (
                <>
                  {isLogin 
                    ? (language === 'zh' ? '登录' : 'Sign In')
                    : (language === 'zh' ? '注册' : 'Sign Up')
                  }
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-foreground-muted">
              {isLogin 
                ? (language === 'zh' ? '还没有账号？' : "Don't have an account?")
                : (language === 'zh' ? '已有账号？' : 'Already have an account?')
              }
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-1 text-primary hover:underline font-medium"
              >
                {isLogin 
                  ? (language === 'zh' ? '立即注册' : 'Sign up')
                  : (language === 'zh' ? '立即登录' : 'Sign in')
                }
              </button>
            </p>
          </div>
        </div>

        {/* Back to home */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-foreground-muted hover:text-foreground transition-colors"
          >
            ← {language === 'zh' ? '返回首页' : 'Back to Home'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
