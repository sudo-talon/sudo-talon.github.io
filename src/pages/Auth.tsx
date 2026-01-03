import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Loader2, Home } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { z } from 'zod';
import profileImage from '@/assets/profile.jpeg';

const authSchema = z.object({
  email: z.string()
    .trim()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be less than 128 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
});

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notRobot, setNotRobot] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [attemptCount, setAttemptCount] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<Date | null>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setTimeout(async () => {
          const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .single();
          
          if (roleData?.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/');
          }
        }, 0);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const validateForm = () => {
    try {
      authSchema.parse({ email, password });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: { email?: string; password?: string } = {};
        error.errors.forEach((err) => {
          if (err.path[0] === 'email') fieldErrors.email = err.message;
          if (err.path[0] === 'password') fieldErrors.password = err.message;
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check lockout
    if (lockoutUntil && new Date() < lockoutUntil) {
      const remainingSeconds = Math.ceil((lockoutUntil.getTime() - Date.now()) / 1000);
      toast({ 
        title: 'Too many attempts', 
        description: `Please wait ${remainingSeconds} seconds before trying again`, 
        variant: 'destructive' 
      });
      return;
    }
    
    if (!validateForm()) return;
    if (!notRobot) {
      toast({ title: 'Verification required', description: 'Please confirm you are not a robot', variant: 'destructive' });
      return;
    }
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ 
          email: email.trim().toLowerCase(), 
          password 
        });
        if (error) {
          // Track failed attempts
          const newCount = attemptCount + 1;
          setAttemptCount(newCount);
          if (newCount >= 5) {
            setLockoutUntil(new Date(Date.now() + 30000)); // 30 second lockout
            setAttemptCount(0);
          }
          throw error;
        }
        setAttemptCount(0);
        toast({ title: 'Welcome back!', description: 'You have successfully logged in.' });
      } else {
        const { error } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: { emailRedirectTo: `${window.location.origin}/` },
        });
        if (error) throw error;
        toast({ title: 'Account created!', description: 'You can now log in with your credentials.' });
        setIsLogin(true);
      }
    } catch (error: unknown) {
      let safeMessage = 'Authentication failed. Please try again.';
      if (error instanceof Error) {
        const msg = error.message || '';
        safeMessage = msg.includes('Invalid login credentials')
          ? 'Invalid email or password'
          : msg.includes('User already registered')
          ? 'An account with this email already exists'
          : 'Authentication failed. Please try again.';
      }
      toast({ title: 'Error', description: safeMessage, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailSchema = z.string().trim().email('Invalid email address');
    const validation = emailSchema.safeParse(resetEmail);
    if (!validation.success) {
      toast({ title: 'Invalid email', description: 'Please enter a valid email address', variant: 'destructive' });
      return;
    }
    setResetLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/auth`,
      });
      if (error) throw error;
      toast({ title: 'Check your email', description: 'Password reset link has been sent to your email' });
      setShowForgotPassword(false);
      setResetEmail('');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to send reset email';
      toast({ title: 'Error', description: message, variant: 'destructive' });
    } finally {
      setResetLoading(false);
    }
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
        {!videoFailed && (
          <video autoPlay loop muted playsInline preload="metadata" onError={() => setVideoFailed(true)} className="absolute inset-0 w-full h-full object-cover z-0">
            <source src="https://previews.customer.envatousercontent.com/h264-video-previews/e3dbe5fd-1bf1-4f5c-a0f9-acf49dbb2305/14602614.mp4" type="video/mp4" />
          </video>
        )}
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10" />
        <div className="relative z-20 w-full max-w-md mx-4">
          <div className="bg-card/90 backdrop-blur-md border border-border rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <img src={profileImage} alt="Ikerionwu Ifeanyi" className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-2 border-primary" />
              <h1 className="text-2xl font-bold text-foreground">Reset Password</h1>
              <p className="text-muted-foreground mt-2">Enter your email to receive a reset link</p>
            </div>
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="resetEmail">Email</Label>
                <Input id="resetEmail" type="email" placeholder="Enter your email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} />
              </div>
              <Button type="submit" className="w-full" disabled={resetLoading}>
                {resetLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Reset Link
              </Button>
            </form>
            <div className="mt-6 text-center">
              <button type="button" onClick={() => setShowForgotPassword(false)} className="text-sm text-primary hover:underline">
                Back to login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {!videoFailed && (
        <video autoPlay loop muted playsInline preload="metadata" onError={() => setVideoFailed(true)} className="absolute inset-0 w-full h-full object-cover z-0">
          <source src="https://previews.customer.envatousercontent.com/h264-video-previews/e3dbe5fd-1bf1-4f5c-a0f9-acf49dbb2305/14602614.mp4" type="video/mp4" />
        </video>
      )}

      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10" />

      <div className="relative z-20 w-full max-w-md mx-4">
        <div className="bg-card/90 backdrop-blur-md border border-border rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <img src={profileImage} alt="Engr Ikerionwu Ifeanyi" className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-2 border-primary" />
            <h1 className="text-2xl font-bold text-foreground">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
            <p className="text-muted-foreground mt-2">{isLogin ? 'Enter your credentials to access your account' : 'Sign up to get started'}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className={errors.email ? 'border-destructive' : ''} />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} className={errors.password ? 'border-destructive pr-10' : 'pr-10'} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                <Checkbox 
                  id="notRobot" 
                  checked={notRobot} 
                  onCheckedChange={(checked) => setNotRobot(checked === true)}
                />
                <Label htmlFor="notRobot" className="text-sm cursor-pointer">I am not a robot</Label>
              </div>
              {isLogin && (
                <button type="button" onClick={() => setShowForgotPassword(true)} className="text-sm text-primary hover:underline">
                  Forgot password?
                </button>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <button type="button" onClick={() => { setIsLogin(!isLogin); setErrors({}); setNotRobot(false); }} className="text-sm text-primary hover:underline">
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
            <div>
              <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Home size={16} />
                Return Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;