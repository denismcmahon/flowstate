import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../auth/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Button, Card, CardContent, TextField, Typography, Alert } from '@mui/material';
import loginBg from "../assets/login-bg.jpg";

const schema = z.object({
  name: z.string().optional(),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long')
});
type FormData = z.infer<typeof schema>;

export default function Register() {
  const { register: registerUser } = useAuth();
  const nav = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: FormData) => {
    try {
      setFormError(null);
      await registerUser(data);
      nav('/');
    } catch (err: any) {
      if (err?.response?.status === 409) {
        setFormError('An account with this email already exists.');
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
            Create Account
          </Typography>

          {formError && <Alert severity="error">{formError}</Alert>}

          <TextField label="Name" fullWidth autoComplete="name" {...register('name')} />

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
            autoComplete="new-password"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <Button type="submit" variant="contained" fullWidth disabled={isSubmitting}>
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </Button>

          <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
            Already have an account? <Link to="/login">Login</Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
