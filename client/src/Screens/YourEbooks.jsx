import React, { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Grid,
    Button,
    Container,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from '@mui/material';
import api from '../Common/Api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const YourEbooks = ({ Auth }) => {
    const [ebooks, setEbooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [currentEbook, setCurrentEbook] = useState({
        title: '',
        description: '',
        publishDate: '',
        author: '',
        language: '',
        image: null
    });
    const [isEditMode, setIsEditMode] = useState(false);
    const [ebookIdToEdit, setEbookIdToEdit] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const navigate = useNavigate();

    const fetchYourEbooks = async () => {
        try {
            const res = await api.listUserEbooks(Auth?._id);
            setEbooks(res.data.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
            // toast.error("Failed to fetch ebooks!");
        }
    };

    useEffect(() => {
        if (!Auth && !Auth?._id) {
            navigate('/signup');
        }

        fetchYourEbooks();
        // eslint-disable-next-line
    }, []);

    const handleDelete = async (id) => {
        try {
            await api.deleteEbook(id);
            fetchYourEbooks();
            setEbooks(ebooks.filter((ebook) => ebook._id !== id));
            toast.success("Ebook deleted successfully!")
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete ebook!");
        }
    };

    const handleOpen = (ebook = {
        title: '',
        description: '',
        publishDate: '',
        author: '',
        language: '',
        image: null
    }, isEdit = false) => {
        const formattedDate = isEdit ? new Date(ebook.publishDate).toISOString().split('T')[0] : '';

        setCurrentEbook({
            title: ebook.title,
            description: ebook.description,
            publishDate: formattedDate,
            author: ebook.author,
            language: ebook.language,
            image: null
        });
        setIsEditMode(isEdit);
        setEbookIdToEdit(isEdit ? ebook._id : null);
        setImagePreview(isEdit ? ebook.image : null);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentEbook({
            title: '',
            description: '',
            publishDate: '',
            author: '',
            language: '',
            image: null
        });
        setIsEditMode(false);
        setImagePreview(null);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setCurrentEbook({ ...currentEbook, image: file });
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSave = async () => {
        try {
            if (!currentEbook.title || !currentEbook.description || !currentEbook.publishDate || !currentEbook.author || !currentEbook.language) {
                alert("Please fill in all fields.");
                return;
            }

            const formData = new FormData();
            formData.append('title', currentEbook.title);
            formData.append('description', currentEbook.description);
            formData.append('publishDate', currentEbook.publishDate);
            formData.append('author', currentEbook.author);
            formData.append('language', currentEbook.language);
            formData.append('createdBy', Auth?._id);

            if (currentEbook.image) {
                formData.append('file', currentEbook.image);
            }

            if (isEditMode) {
                await api.editEbook(ebookIdToEdit, formData);
                toast.success("Ebook updated successfully!");
            } else {
                await api.addEbook(formData);
                toast.success("Ebook added successfully!");
            }
            fetchYourEbooks();
            handleClose();
        } catch (err) {
            console.error(err);
            toast.error("Failed to save ebook!");
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
                Your Ebooks
            </Typography>
            <Button
                variant="contained"
                color="primary"
                style={{ marginBottom: '1.5rem' }}
                onClick={() => handleOpen()}
            >
                Add New Ebook
            </Button>
            <Grid container spacing={4}>
                {ebooks?.map((ebook) => (
                    <Grid item xs={12} sm={6} md={4} key={ebook?._id}>
                        <Card style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <CardContent style={{ flexGrow: 1 }}>
                                <Typography variant="h5" component="h2" gutterBottom>
                                    {ebook?.title}
                                </Typography>
                                {ebook.image && (
                                    <img src={ebook.image} alt={ebook.title} style={{ maxWidth: '100%', maxHeight: '150px', objectFit: 'cover' }} />
                                )}
                                <Typography variant="body2" color="textSecondary">
                                    {ebook?.description.length > 100 ? `${ebook?.description.substring(0, 100)}...` : ebook?.description}
                                </Typography>
                                <Typography variant="body2" style={{ marginTop: '1rem' }}>
                                    Publish Date: {new Date(ebook?.publishDate).toLocaleDateString()}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Author: {ebook?.author}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Language: {ebook?.language}
                                </Typography>
                            </CardContent>

                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem' }}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => handleOpen(ebook, true)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => handleDelete(ebook?._id)}
                                >
                                    Delete
                                </Button>
                            </div>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{isEditMode ? 'Edit Ebook' : 'Add New Ebook'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Title"
                        type="text"
                        fullWidth
                        value={currentEbook.title}
                        onChange={(e) => setCurrentEbook({ ...currentEbook, title: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        value={currentEbook.description}
                        onChange={(e) => setCurrentEbook({ ...currentEbook, description: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Publish Date"
                        type="date"
                        fullWidth
                        value={currentEbook.publishDate}
                        onChange={(e) => setCurrentEbook({ ...currentEbook, publishDate: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Author"
                        type="text"
                        fullWidth
                        value={currentEbook.author}
                        onChange={(e) => setCurrentEbook({ ...currentEbook, author: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Language"
                        type="text"
                        fullWidth
                        value={currentEbook.language}
                        onChange={(e) => setCurrentEbook({ ...currentEbook, language: e.target.value })}
                    />
                    <input type="file" onChange={handleImageChange} />
                    {imagePreview && <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', marginTop: '1rem' }} />}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default YourEbooks;
