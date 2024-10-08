import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Grid, Card, CardContent, Container } from '@mui/material';
import api from '../Common/Api';
import { toast } from 'react-toastify';

const SignUp = ({Auth}) => {
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.signup(form)
      console.log(res)
      if(res.data.message === "Success"){
        toast.success("Signup Successful!")
        navigate('/signin');
      }
    } catch (err) {
      console.error(err);
      toast.error('Signup failed! Please try again.');
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
                Sign Up
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="FullName"
                  name="fullName"
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                />
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
                  Sign Up
                </Button>
              </form>
              <Typography align="center" style={{ marginTop: '1rem' }}>
                Already have an account? <a href="/signin">Sign In</a>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SignUp;
