import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Grid, Card, CardContent, Container } from '@mui/material';
import api from '../Common/Api';
import constents from '../Common/constents';
import { toast } from 'react-toastify';

const SignIn = ({Auth, setAuth}) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.singin(form)
      if(res?.data?.token){
        localStorage.setItem('token', res.data.token);
        setAuth(constents.getUserDetails())
        toast.success("Login Successful!")
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      toast.error('Login failed! Please try again.');
    }
  };

  useEffect(() => {
    if(Auth && Auth?._id){
      navigate("/")
    }
    // eslint-disable-next-line
  }, [])

  return (
    <Container maxWidth="sm">
      <Grid container justifyContent="center" style={{ minHeight: '100vh' }}>
        <Grid item xs={12} md={8}>
          <Card style={{ marginTop: '2rem', padding: '2rem' }}>
            <CardContent>
              <Typography variant="h4" gutterBottom align="center">
                Sign In
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                />
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                />
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  type="submit"
                  style={{ marginTop: '1rem' }}
                >
                  Sign In
                </Button>
              </form>
              <Typography align="center" style={{ marginTop: '1rem' }}>
                Don't have an account? <a href="/signup">Sign Up</a>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SignIn;
