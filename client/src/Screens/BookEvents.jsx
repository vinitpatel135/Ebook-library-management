import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, Container, CircularProgress, CardMedia, DialogActions, Button } from '@mui/material';
import api from '../Common/Api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const BookEvent = ({ Auth }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchEvents = async () => {
        try {
            const res = await api.userBorrowBook(Auth?._id);
            console.log(res.data.data);
            setEvents(res.data.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!Auth && !Auth?._id) {
            navigate('/signup');
        }
        fetchEvents();
        // eslint-disable-next-line
    }, []);

    const returnBook = async (id) => {
        try {
            await api.returnBook(id); // Update this line to match your return book endpoint
            fetchEvents();
            setEvents(events.filter((event) => event._id !== id));
            toast.success("Book returned successfully!");
        } catch (error) {
            console.error(error);
            setLoading(false);
            toast.error("Failed to return book!");
        }
    };

    if (loading) {
        return (
            <Container>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
            <Typography variant="h4" gutterBottom align="center">
                Your Booked Events
            </Typography>

            {events?.length === 0 ? (
                <Typography variant="h6" align="center" color="textSecondary">
                    No events available.
                </Typography>
            ) : (
                <Grid container spacing={4}>
                    {events?.map((event) => (
                        <Grid item xs={12} sm={6} md={4} key={event._id}>
                            <Card
                                style={{
                                    borderRadius: '12px',
                                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                                }}
                            >
                                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                    <CardMedia
                                        component="img"
                                        height="100%"
                                        image={event.ebookId?.image || '/default-image.jpg'}  // Default image if not available
                                        alt={event.ebookId?.title}
                                        style={{
                                            width: '100%',
                                            height: '320px',
                                            objectFit: 'contain',  // Ensures no cropping, fits entire image
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                            position: 'relative'
                                        }}
                                    />
                                </div>
                                <CardContent style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <Typography variant="h5" component="h2" gutterBottom style={{ fontWeight: 'bold', marginBottom: '1rem' }}>
                                        {event.ebookId.title}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" style={{ flexGrow: 1 }}>
                                        {event?.ebookId?.description?.length > 100
                                            ? `${event.ebookId.description.substring(0, 100)}...`
                                            : event.ebookId.description}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" style={{ marginTop: '1rem' }}>
                                        Location: {event.ebookId.location}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" style={{ marginTop: '0.5rem' }}>
                                        Date: {new Date(event.ebookId.date).toLocaleDateString()}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" style={{ marginTop: '0.5rem' }}>
                                        Time: {event.ebookId.time}
                                    </Typography>
                                </CardContent>
                                <DialogActions>
                                    <Button onClick={() => returnBook(event._id)} color="primary">
                                        Return Book
                                    </Button>
                                </DialogActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default BookEvent;
