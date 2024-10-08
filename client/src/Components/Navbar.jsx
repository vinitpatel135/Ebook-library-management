import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';

const Navbar = ({ Auth, setAuth }) => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const isMobile = useMediaQuery('(max-width:600px)');

    const logout = () => {
        setAuth(null);
        localStorage.removeItem('token');
        navigate("/signup");
    };

    const isActive = (path) => location.pathname === path;

    // Toggle drawer for mobile menu
    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const renderMenu = () => (
        <List>
            <ListItem button component={Link} to="/" onClick={toggleDrawer(false)} sx={{ color: 'white' }}>
                <ListItemText primary="Home" sx={{ color: 'white', textDecoration: 'none' }} />
            </ListItem>
            <ListItem button component={Link} to="/book-event" onClick={toggleDrawer(false)} sx={{ color: 'white' }}>
                <ListItemText primary="Book Events" sx={{ color: 'white', textDecoration: 'none' }} />
            </ListItem>
            <ListItem button component={Link} to="/your-event" onClick={toggleDrawer(false)} sx={{ color: 'white' }}>
                <ListItemText primary="Your Events" sx={{ color: 'white', textDecoration: 'none' }} />
            </ListItem>
            {Auth && Auth._id ? (
                <ListItem button onClick={() => { logout(); toggleDrawer(false); }} sx={{ color: 'white' }}>
                    <ListItemText primary="Sign Out" sx={{ color: 'white', textDecoration: 'none' }} />
                </ListItem>
            ) : (
                <>
                    <ListItem button component={Link} to="/signin" onClick={toggleDrawer(false)} sx={{ color: 'white' }}>
                        <ListItemText primary="Sign In" sx={{ color: 'white', textDecoration: 'none' }} />
                    </ListItem>
                    <ListItem button component={Link} to="/signup" onClick={toggleDrawer(false)} sx={{ color: 'white' }}>
                        <ListItemText primary="Sign Up" sx={{ color: 'white', textDecoration: 'none' }} />
                    </ListItem>
                </>
            )}
        </List>
    );
    

    return (
        <AppBar position="static" color="primary">
            <Container maxWidth="lg">
                <Toolbar>
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        My Blog App
                    </Typography>

                    {isMobile ? (
                        <>
                            <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
                                <MenuIcon />
                            </IconButton>
                            <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
                                {renderMenu()}
                            </Drawer>
                        </>
                    ) : (
                        <>
                            <Button
                                color="inherit"
                                component={Link}
                                to="/"
                                style={{
                                    borderBottom: isActive('/') ? '2px solid #fff' : 'none',
                                }}
                            >
                                Home
                            </Button>
                            <Button
                                color="inherit"
                                component={Link}
                                to="/book-event"
                                style={{
                                    borderBottom: isActive('/book-event') ? '2px solid #fff' : 'none',
                                }}
                            >
                                Book Events
                            </Button>
                            <Button
                                color="inherit"
                                component={Link}
                                to="/your-event"
                                style={{
                                    borderBottom: isActive('/your-event') ? '2px solid #fff' : 'none',
                                }}
                            >
                                Your Events
                            </Button>
                            {Auth && Auth._id ? (
                                <Button
                                    color="inherit"
                                    onClick={logout}
                                    style={{
                                        borderBottom: isActive('/logout') ? '2px solid #fff' : 'none',
                                    }}
                                >
                                    Sign Out
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        color="inherit"
                                        component={Link}
                                        to="/signin"
                                        style={{
                                            borderBottom: isActive('/signin') ? '2px solid #fff' : 'none',
                                        }}
                                    >
                                        Sign In
                                    </Button>
                                    <Button
                                        color="inherit"
                                        component={Link}
                                        to="/signup"
                                        style={{
                                            borderBottom: isActive('/signup') ? '2px solid #fff' : 'none',
                                        }}
                                    >
                                        Sign Up
                                    </Button>
                                </>
                            )}
                        </>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;
