import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../auth/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Button, Card, CardContent, TextField, Typography, Alert } from '@mui/material';
import { useState, useEffect } from 'react';
import loginBg from "../assets/login-bg.jpg";

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long')
});
type FormData = z.infer<typeof schema>;

export default function Login() {
  const { user, login } = useAuth();
  const nav = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (user) nav("/");
  }, [user, nav]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: FormData) => {
    try {
      setFormError(null); // reset any old error
      await login(data.email, data.password);
      nav('/');
    } catch (err: any) {
      if (err?.response?.status === 401) {
        setFormError('Invalid email or password.');
      } else {
        setFormError('Something went wrong. Please try again later.');
      }
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{
            minHeight: "100dvh",
            display: "grid",
            placeItems: "center",
            backgroundImage: `url(${loginBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
        }}
    >
      <Card sx={{ width: 400, p: 3 }}>
        <CardContent sx={{ display: 'grid', gap: 2 }}>
          <Typography variant="h5" textAlign="center">
            Sign In
          </Typography>

          {formError && <Alert severity="error">{formError}</Alert>}

          <TextField
            label="Email"
            type="email"
            fullWidth
            autoComplete="email"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            autoComplete="current-password"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <Button type="submit" variant="contained" fullWidth disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Login'}
          </Button>

          <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
            Don’t have an account? <Link to="/register">Register</Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
