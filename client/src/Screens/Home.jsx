import React, { useEffect, useState } from 'react';
import {
    Card, CardContent, Typography, Grid, Container, CircularProgress,
    Dialog, DialogTitle, DialogContent, DialogActions, Button, CardMedia
} from '@mui/material';
import api from '../Common/Api';
import { toast } from 'react-toastify';

const Home = ({ Auth }) => {
    const [ebooks, setEbooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedEbook, setSelectedEbook] = useState(null);

    // Fetch e-books from the backend
    const fetchEbooks = async () => {
        try {
            const res = await api.listAllEbooks();
            setEbooks(res.data.data);  // Assuming the response structure is { data: { data: [] } }
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
            toast.error("Failed to fetch e-books!");
        }
    };

    useEffect(() => {
        fetchEbooks();
        // eslint-disable-next-line
    }, []);

    // Handle clicking on an e-book card
    const handleCardClick = (ebook) => {
        setSelectedEbook(ebook);
        setOpenDialog(true);
    };

    if (loading) {
        return (
            <Container>
                <CircularProgress />
            </Container>
        );
    }

    const handleBorrowNow = async (ebook) => {
        if (ebook) {
            try {
                const data = {
                    ebookId: ebook._id,
                    userId: Auth._id
                };
                const res = await api.borrowEbook(data);  // Assuming there's an API for borrowing ebooks
                if (res.data.message === "Success") {
                    setOpenDialog(false);
                    toast.success(`Successfully borrowed ${ebook.title}!`);
                }
            } catch (err) {
                toast.error("Failed to borrow the e-book!");
            }
        }
    };

    return (
        <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
            <Typography variant="h4" gutterBottom align="center">
                Available E-Books
            </Typography>

            {ebooks?.length === 0 ? (
                <Typography variant="h6" align="center" color="textSecondary">
                    No E-Books available.
                </Typography>
            ) : (
                <Grid container spacing={4}>
                    {ebooks?.map((ebook) => (
                        <Grid item xs={12} sm={6} md={4} key={ebook._id}>
                            <Card
                                style={{
                                    height: '400px',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                                }}
                                onClick={() => handleCardClick(ebook)}
                            >
                                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                    <CardMedia
                                        component="img"
                                        height="100%"
                                        image={ebook?.image || '/default-image.jpg'}  // Default image if not available
                                        alt={ebook?.title}
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
                                <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px' }}>
                                    <Typography variant="h6" component="p" style={{ fontWeight: 'bold' }}>
                                        {ebook?.title}
                                    </Typography>
                                    <Typography variant="body2" style={{ fontStyle: 'italic' }}>
                                        by {ebook?.author}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Dialog for detailed e-book view */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>{selectedEbook?.title}</DialogTitle>
                <DialogContent>
                    {selectedEbook?.image && (
                        <CardMedia
                            component="img"
                            height="500"
                            image={selectedEbook.image}
                            alt={selectedEbook.title}
                            style={{ marginBottom: '1rem', width: '100%', objectFit: 'contain' }}
                        />
                    )}
                    <Typography variant="body1" gutterBottom>
                        {selectedEbook?.description}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" style={{ marginTop: '0.5rem' }}>
                        Publish Date: {new Date(selectedEbook?.publishDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" style={{ marginTop: '0.5rem' }}>
                        Language: {selectedEbook?.language}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" style={{ marginTop: '1rem' }}>
                        Author: {selectedEbook?.author}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleBorrowNow(selectedEbook)}
                    >
                        Borrow Now
                    </Button>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Home;
