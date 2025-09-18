import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  Tabs,
  Tab,
  Divider,
  TextField,
  InputAdornment,
  useTheme
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Schedule as ScheduleIcon,
  Public as PublicIcon,
  LockOutlined as PrivateIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Mock data for video content
const mockVideos = [
  {
    id: 1,
    title: 'Homemade Poha - Indian Breakfast Delight',
    thumbnail: 'https://www.cubesnjuliennes.com/wp-content/uploads/2019/10/Poha.jpg',
    views: 1240,
    likes: 312,
    comments: 45,
    uploadDate: '2025-04-15',
    visibility: 'public',
    tags: ['indian', 'breakfast', 'vegetarian', 'quick-recipe', 'spicy', 'healthy'],
    description: "A vibrant Indian breakfast dish made with flattened rice flakes, mustard seeds, and colorful vegetables, garnished with fresh coriander and crunchy sev."
  },
  {
    id: 2,
    title: 'Creamy Fettuccine Alfredo with Chicken',
    thumbnail: 'https://www.cubesnjuliennes.com/wp-content/uploads/2024/12/Middle-Eastern-Spatchcock-Chicken-3.jpg',
    views: 896,
    likes: 245,
    comments: 23,
    uploadDate: '2025-04-14',
    visibility: 'private',
    tags: ['italian', 'pasta', 'creamy', 'dinner', 'comfort-food', 'chicken'],
    description: "A luxurious pasta dish featuring delicate ribbons of fettuccine coated in a silky, rich sauce with tender pieces of chicken and earthy mushrooms."
  },
  {
    id: 3,
    title: 'Antioxidant-Rich Açaí Smoothie Bowl',
    thumbnail: 'https://www.cubesnjuliennes.com/wp-content/uploads/2022/02/Mixed-Berry-Smoothie-1.jpg',
    views: 738,
    likes: 198,
    comments: 32,
    uploadDate: '2025-04-13',
    visibility: 'scheduled',
    scheduledDate: '2025-04-20T10:00:00',
    tags: ['breakfast', 'healthy', 'vegan', 'smoothie', 'fruit', 'no-cook'],
    description: "A vibrant and nutritious breakfast bowl with a base of frozen açaí berries topped with fresh fruits, granola, and a drizzle of honey."
  },
  {
    id: 4,
    title: 'Quick Beef and Vegetable Stir-Fry',
    thumbnail: 'https://www.cubesnjuliennes.com/wp-content/uploads/2022/09/Instant-Pot-Beef-Stew-1.jpg',
    views: 623,
    likes: 176,
    comments: 18,
    uploadDate: '2025-04-12',
    visibility: 'public',
    tags: ['asian', 'stir-fry', 'dinner', 'beef', 'spicy', 'quick-recipe'],
    description: "A colorful and flavorful stir-fry with tender beef strips and crisp vegetables in a savory sauce, perfect for a quick weeknight dinner."
  },
  {
    id: 5,
    title: 'Aromatic Lamb Biryani',
    thumbnail: 'https://www.cubesnjuliennes.com/wp-content/uploads/2019/04/Instant-Pot-Lamb-Biryani-Recipe.jpg',
    views: 892,
    likes: 234,
    comments: 27,
    uploadDate: '2025-04-11',
    visibility: 'public',
    tags: ['indian', 'biryani', 'rice', 'dinner', 'lamb', 'aromatic'],
    description: "A fragrant layered rice dish with tender lamb, aromatic spices, and caramelized onions, garnished with fresh herbs and crispy fried onions."
  },
  {
    id: 6,
    title: 'Vegetarian Buddha Bowl',
    thumbnail: 'https://www.cubesnjuliennes.com/wp-content/uploads/2020/09/Perfect-Instant-Pot-Quinoa.jpg',
    views: 512,
    likes: 143,
    comments: 19,
    uploadDate: '2025-04-10',
    visibility: 'private',
    tags: ['vegan', 'healthy', 'lunch', 'bowl', 'vegetables', 'balanced'],
    description: "A nourishing bowl packed with colorful vegetables, whole grains, plant-based proteins, and a flavorful tahini dressing."
  },
  {
    id: 7,
    title: 'Decadent Chocolate Lava Cake',
    thumbnail: 'https://www.cubesnjuliennes.com/wp-content/uploads/2020/01/Best-Eggless-Chocolate-Cake.jpg',
    views: 724,
    likes: 187,
    comments: 29,
    uploadDate: '2025-04-09',
    visibility: 'scheduled',
    scheduledDate: '2025-04-25T14:00:00',
    tags: ['dessert', 'chocolate', 'baking', 'sweet', 'indulgent'],
    description: "A rich chocolate dessert with a molten, flowing center that creates an impressive finale to any special meal."
  },
  {
    id: 8,
    title: 'Fresh Spring Rolls with Peanut Sauce',
    thumbnail: 'https://www.cubesnjuliennes.com/wp-content/uploads/2016/06/Chicken-Spring-Roll-1-1.jpg',
    views: 438,
    likes: 112,
    comments: 15,
    uploadDate: '2025-04-08',
    visibility: 'public',
    tags: ['asian', 'healthy', 'appetizer', 'fresh', 'no-cook', 'vegan'],
    description: "Light and refreshing rice paper rolls filled with colorful vegetables, herbs, and rice noodles, served with a creamy peanut dipping sauce."
  }
];

const Videos = () => {
  const theme = useTheme();
  const [videos, setVideos] = useState(mockVideos);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [visibilityDialogOpen, setVisibilityDialogOpen] = useState(false);
  const [newVisibility, setNewVisibility] = useState('');
  const [scheduledDate, setScheduledDate] = useState(new Date());
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const handleMenuOpen = (event, video) => {
    setAnchorEl(event.currentTarget);
    setCurrentVideo(video);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    setVideos(videos.filter(video => video.id !== currentVideo.id));
    setDeleteDialogOpen(false);
  };

  const handleVisibilityClick = () => {
    handleMenuClose();
    setNewVisibility(currentVideo.visibility);
    setVisibilityDialogOpen(true);
    if (currentVideo.scheduledDate) {
      setScheduledDate(new Date(currentVideo.scheduledDate));
    }
  };

  const handleVisibilityChange = (event) => {
    setNewVisibility(event.target.value);
  };

  const handleVisibilityConfirm = () => {
    setVideos(videos.map(video => {
      if (video.id === currentVideo.id) {
        const updatedVideo = { ...video, visibility: newVisibility };
        if (newVisibility === 'scheduled') {
          updatedVideo.scheduledDate = scheduledDate.toISOString();
        }
        return updatedVideo;
      }
      return video;
    }));
    setVisibilityDialogOpen(false);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getVisibilityIcon = (visibility) => {
    switch (visibility) {
      case 'public':
        return <PublicIcon fontSize="small" sx={{ color: theme.palette.success.main }} />;
      case 'private':
        return <PrivateIcon fontSize="small" sx={{ color: theme.palette.error.main }} />;
      case 'scheduled':
        return <ScheduleIcon fontSize="small" sx={{ color: theme.palette.info.main }} />;
      default:
        return <VisibilityIcon fontSize="small" />;
    }
  };

  const getFilteredVideos = () => {
    let filtered = [...videos];
    
    // Filter by tab
    if (tabValue === 1) {
      filtered = filtered.filter(video => video.visibility === 'public');
    } else if (tabValue === 2) {
      filtered = filtered.filter(video => video.visibility === 'private');
    } else if (tabValue === 3) {
      filtered = filtered.filter(video => video.visibility === 'scheduled');
    }
    
    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(video => 
        video.title.toLowerCase().includes(search) || 
        video.description.toLowerCase().includes(search) ||
        video.tags.some(tag => tag.toLowerCase().includes(search))
      );
    }
    
    return filtered;
  };

  return (
    <Box sx={{ mt: 2, pb: 6 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Video Library
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="video filter tabs"
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: theme.palette.primary.main,
              },
            }}
          >
            <Tab 
              label="All Videos" 
              sx={{ 
                fontWeight: tabValue === 0 ? 600 : 400,
                color: tabValue === 0 ? theme.palette.primary.main : theme.palette.text.secondary,
              }} 
            />
            <Tab 
              label="Public" 
              icon={<PublicIcon fontSize="small" />} 
              iconPosition="start"
              sx={{ 
                fontWeight: tabValue === 1 ? 600 : 400,
                color: tabValue === 1 ? theme.palette.primary.main : theme.palette.text.secondary,
              }}
            />
            <Tab 
              label="Private" 
              icon={<PrivateIcon fontSize="small" />} 
              iconPosition="start"
              sx={{ 
                fontWeight: tabValue === 2 ? 600 : 400,
                color: tabValue === 2 ? theme.palette.primary.main : theme.palette.text.secondary,
              }}
            />
            <Tab 
              label="Scheduled" 
              icon={<ScheduleIcon fontSize="small" />} 
              iconPosition="start"
              sx={{ 
                fontWeight: tabValue === 3 ? 600 : 400,
                color: tabValue === 3 ? theme.palette.primary.main : theme.palette.text.secondary,
              }}
            />
          </Tabs>
          
          <TextField
            placeholder="Search videos..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              sx: {
                borderRadius: 2,
                backgroundColor: theme.palette.background.paper,
              }
            }}
            sx={{ width: 250 }}
          />
        </Box>
        
        <Divider />
      </Box>

      <Grid container spacing={3}>
        {getFilteredVideos().map((video) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={video.id}>
            <Card 
              className="content-card" 
              sx={{ 
                backgroundColor: theme.palette.background.paper,
                height: 380, // Fixed height for uniform cards (slightly taller than Dashboard)
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                borderRadius: 2,
              }}
              elevation={2}
            >
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="180"
                  image={video.thumbnail}
                  alt={video.title}
                  sx={{ 
                    objectFit: 'cover',
                    borderTopLeftRadius: theme.shape.borderRadius,
                    borderTopRightRadius: theme.shape.borderRadius,
                    width: '100%',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'rgba(0, 0, 0, 0.7)',
                    borderRadius: '4px',
                    px: 1,
                    py: 0.5
                  }}
                >
                  <Typography variant="caption" sx={{ color: 'white', fontSize: '0.7rem' }}>
                    {video.views} views
                  </Typography>
                </Box>
                <Chip
                  icon={getVisibilityIcon(video.visibility)}
                  label={video.visibility.charAt(0).toUpperCase() + video.visibility.slice(1)}
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    fontSize: '0.7rem',
                    height: 24,
                    '& .MuiChip-icon': {
                      color: 'inherit',
                      fontSize: '0.8rem',
                    },
                    '& .MuiChip-label': {
                      fontSize: '0.7rem',
                      px: 1,
                    }
                  }}
                />
              </Box>
              <CardContent sx={{ 
                flexGrow: 1, 
                display: 'flex', 
                flexDirection: 'column',
                p: 2,
                height: 200, // Fixed content height
                overflow: 'hidden'
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography 
                    variant="subtitle1" 
                    component="div" 
                    sx={{ 
                      fontWeight: 600,
                      height: 48, // Fixed title height (2 lines max)
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      lineHeight: 1.2,
                      mr: 1,
                      flex: 1,
                    }}
                  >
                    {video.title}
                  </Typography>
                  <IconButton 
                    aria-label="settings" 
                    size="small" 
                    onClick={(e) => handleMenuOpen(e, video)}
                    sx={{ 
                      color: theme.palette.text.secondary,
                      p: 0.5,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      }
                    }}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </Box>
                
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    mb: 1,
                    height: 40, // Fixed description height
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    lineHeight: 1.3,
                    fontSize: '0.8rem',
                  }}
                >
                  {video.description.length > 80 
                    ? `${video.description.substring(0, 80)}...` 
                    : video.description}
                </Typography>
                
                <Box sx={{ 
                  display: 'flex', 
                  gap: 0.5, 
                  flexWrap: 'wrap', 
                  mb: 1,
                  height: 32, // Fixed tags height
                  overflow: 'hidden'
                }}>
                  {video.tags.slice(0, 3).map((tag) => (
                    <Typography 
                      key={tag} 
                      variant="caption" 
                      sx={{ 
                        backgroundColor: 'rgba(0, 168, 225, 0.15)', 
                        color: theme.palette.primary.main,
                        borderRadius: '4px',
                        px: 0.8,
                        py: 0.3,
                        textTransform: 'capitalize',
                        fontSize: '0.7rem',
                        lineHeight: 1,
                      }}
                    >
                      {tag}
                    </Typography>
                  ))}
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  mt: 'auto',
                  pt: 1
                }}>
                  <Typography variant="caption" color="text.secondary" sx={{ 
                    textAlign: 'center',
                    opacity: 0.8,
                    fontSize: '0.7rem'
                  }}>
                    Uploaded on {new Date(video.uploadDate).toLocaleDateString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {getFilteredVideos().length === 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', mt: 4, px: 3 }}>
            <Typography variant="h6" color="text.secondary">No videos found</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
              {searchTerm 
                ? "Try adjusting your search term or filters"
                : "Upload your first video to get started"}
            </Typography>
          </Box>
        )}
      </Grid>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            width: 200,
          }
        }}
      >
        <MenuItem onClick={handleVisibilityClick}>
          <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
          Change Visibility
        </MenuItem>
        <MenuItem onClick={handleDeleteClick}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete Video
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: theme.palette.background.paper,
          }
        }}
      >
        <DialogTitle>Delete Video</DialogTitle>
        <DialogContent>
          <DialogContentText color="text.secondary">
            Are you sure you want to delete "{currentVideo?.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialogOpen(false)} 
            color="primary"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Change Visibility Dialog */}
      <Dialog
        open={visibilityDialogOpen}
        onClose={() => setVisibilityDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: theme.palette.background.paper,
          }
        }}
      >
        <DialogTitle>Change Video Visibility</DialogTitle>
        <DialogContent>
          <DialogContentText color="text.secondary" sx={{ mb: 2 }}>
            Update the visibility settings for "{currentVideo?.title}"
          </DialogContentText>
          
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="visibility-select-label">Visibility</InputLabel>
            <Select
              labelId="visibility-select-label"
              value={newVisibility}
              label="Visibility"
              onChange={handleVisibilityChange}
            >
              <MenuItem value="public">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PublicIcon fontSize="small" sx={{ mr: 1, color: theme.palette.success.main }} />
                  Public (visible to everyone)
                </Box>
              </MenuItem>
              <MenuItem value="private">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PrivateIcon fontSize="small" sx={{ mr: 1, color: theme.palette.error.main }} />
                  Private (only visible to you)
                </Box>
              </MenuItem>
              <MenuItem value="scheduled">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ScheduleIcon fontSize="small" sx={{ mr: 1, color: theme.palette.info.main }} />
                  Scheduled (release at specific time)
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
          
          {newVisibility === 'scheduled' && (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Schedule publish date"
                value={scheduledDate}
                onChange={(newDate) => setScheduledDate(newDate)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVisibilityDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleVisibilityConfirm} 
            color="primary" 
            variant="contained"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Videos;
