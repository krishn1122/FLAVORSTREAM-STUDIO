import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActionArea,
  Avatar,
  Button,
  useTheme
} from '@mui/material';
import { 
  TrendingUp as TrendingUpIcon,
  Visibility as VisibilityIcon,
  ThumbUp as ThumbUpIcon,
  Comment as CommentIcon,
  VideoLibrary as VideoIcon,
  Upload as UploadIcon
} from '@mui/icons-material';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useNavigate } from 'react-router-dom';

// Mock data for charts
const viewsData = [
  { name: 'Mon', views: 240 },
  { name: 'Tue', views: 300 },
  { name: 'Wed', views: 280 },
  { name: 'Thu', views: 420 },
  { name: 'Fri', views: 380 },
  { name: 'Sat', views: 520 },
  { name: 'Sun', views: 650 },
];

const categoryData = [
  { name: 'Breakfast', value: 35 },
  { name: 'Lunch', value: 25 },
  { name: 'Dinner', value: 30 },
  { name: 'Dessert', value: 10 },
];

const COLORS = ['#00A8E1', '#FF9900', '#0088FE', '#232F3E'];

// Mock data for recent videos
const recentVideos = [
  {
    id: 1,
    title: 'Easy 15-Minute Pasta Recipe',
    thumbnail: 'https://www.cubesnjuliennes.com/wp-content/uploads/2023/11/Vegetable-Pasta-Recipe-1.jpg',
    views: 1240,
    likes: 312,
    comments: 45,
    uploadDate: '2 hours ago',
    tags: ['pasta', 'quick', 'dinner']
  },
  {
    id: 2,
    title: 'Authentic Mexican Tacos',
    thumbnail: 'https://th.bing.com/th/id/OIP.pelK9k5ccm6GNDcM6fEozQHaE8?rs=1&pid=ImgDetMain',
    views: 896,
    likes: 245,
    comments: 23,
    uploadDate: '5 hours ago',
    tags: ['mexican', 'spicy', 'lunch']
  },
  {
    id: 3,
    title: 'Homemade Ice Cream - No Machine Needed',
    thumbnail: 'https://www.cubesnjuliennes.com/wp-content/uploads/2013/11/DSC_7251.jpg',
    views: 738,
    likes: 198,
    comments: 32,
    uploadDate: '1 day ago',
    tags: ['dessert', 'summer', 'sweet']
  },
  {
    id: 4,
    title: 'Quick Breakfast Smoothie Bowl',
    thumbnail: 'https://www.cubesnjuliennes.com/wp-content/uploads/2021/03/Avocado-Smoothie-2.jpg',
    views: 623,
    likes: 176,
    comments: 18,
    uploadDate: '1 day ago',
    tags: ['breakfast', 'healthy', 'quick']
  },
  {
    id: 5,
    title: 'Gourmet Burger Assembly Guide',
    thumbnail: 'https://th.bing.com/th/id/OIP.Oj9ppaRfiy0FICs7w-pTtQHaHa?rs=1&pid=ImgDetMain',
    views: 945,
    likes: 267,
    comments: 39,
    uploadDate: '3 days ago',
    tags: ['burger', 'gourmet', 'dinner']
  },
  {
    id: 6,
    title: 'Vegetarian Buddha Bowl',
    thumbnail: 'https://www.cubesnjuliennes.com/wp-content/uploads/2024/01/Methi-Matar-Malai-1.jpg',
    views: 712,
    likes: 203,
    comments: 27,
    uploadDate: '4 days ago',
    tags: ['vegetarian', 'healthy', 'lunch']
  },
  {
    id: 7,
    title: 'Classic Tiramisu Recipe',
    thumbnail: 'https://www.cubesnjuliennes.com/wp-content/uploads/2022/08/Kaddu-ki-Sabji-2.jpg',
    views: 829,
    likes: 187,
    comments: 31,
    uploadDate: '5 days ago',
    tags: ['dessert', 'italian', 'coffee']
  },
  {
    id: 8,
    title: 'Spicy Korean Bibimbap',
    thumbnail: 'https://www.cubesnjuliennes.com/wp-content/uploads/2019/01/Matar-Paneer-Ke-Kabab-recipe.jpg',
    views: 768,
    likes: 234,
    comments: 29,
    uploadDate: '6 days ago',
    tags: ['korean', 'spicy', 'rice']
  }
];

const StatCard = ({ icon, title, value, color, subtitle }) => {
  const theme = useTheme();
  
  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        display: 'flex',
        alignItems: 'center',
        backgroundColor: theme.palette.background.paper,
        borderRadius: 2,
      }}
    >
      <Avatar
        sx={{
          bgcolor: `${color}.main`,
          width: 56,
          height: 56,
          mr: 2,
        }}
      >
        {icon}
      </Avatar>
      <Box>
        <Typography variant="h5" component="div" fontWeight="bold">
          {value}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color={subtitle.startsWith('+') ? 'success.main' : 'error.main'}>
            {subtitle}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

const Dashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  return (
    <Box sx={{ pt: 2, pb: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Dashboard
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<UploadIcon />}
          onClick={() => navigate('/upload')}
        >
          Upload New Video
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            icon={<VideoIcon />} 
            title="Total Videos" 
            value="48" 
            color="primary"
            subtitle="+4 this week" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            icon={<VisibilityIcon />} 
            title="Total Views" 
            value="12.5K" 
            color="info"
            subtitle="+23% vs last week" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            icon={<ThumbUpIcon />} 
            title="Total Likes" 
            value="3.2K" 
            color="success"
            subtitle="+18% vs last week" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            icon={<CommentIcon />} 
            title="Comments" 
            value="864" 
            color="warning"
            subtitle="+7% vs last week" 
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              height: '100%',
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <TrendingUpIcon sx={{ mr: 1 }} />
              Video Views (Last 7 Days)
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={viewsData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: theme.palette.text.secondary }} 
                    axisLine={{ stroke: theme.palette.divider }}
                  />
                  <YAxis 
                    tick={{ fill: theme.palette.text.secondary }} 
                    axisLine={{ stroke: theme.palette.divider }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: theme.palette.background.paper,
                      color: theme.palette.text.primary,
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  />
                  <Bar dataKey="views" fill={theme.palette.primary.main} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              width: '450px',
              height: '387px',
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Content Categories
            </Typography>
            <Box sx={{ height: '330px', display: 'flex', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: theme.palette.background.paper,
                      color: theme.palette.text.primary,
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                    formatter={(value) => [`${value} videos`, 'Count']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Videos */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Recently Uploaded Videos
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Your latest food video content with performance metrics
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {recentVideos.map((video) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={video.id}>
            <Card 
              className="content-card" 
              sx={{ 
                backgroundColor: theme.palette.background.paper,
                height: 320, // Fixed height for uniform cards
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
              }}
              elevation={2}
            >
              <CardActionArea sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="180"
                  image={video.thumbnail}
                  alt={video.title}
                  sx={{ 
                    objectFit: 'cover',
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    width: '100%',
                  }}
                />
                <CardContent sx={{ 
                  flexGrow: 1, 
                  display: 'flex', 
                  flexDirection: 'column',
                  p: 2,
                  height: 140, // Fixed content height
                  overflow: 'hidden'
                }}>
                  <Typography 
                    variant="subtitle1" 
                    component="div" 
                    sx={{ 
                      fontWeight: 600,
                      mb: 1,
                      height: 48, // Fixed title height (2 lines max)
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      lineHeight: 1.2,
                    }}
                  >
                    {video.title}
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
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mt: 'auto',
                    pt: 1
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <VisibilityIcon fontSize="small" sx={{ color: theme.palette.text.secondary }} />
                      <Typography variant="caption" color="text.secondary">
                        {video.views}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ThumbUpIcon fontSize="small" sx={{ color: theme.palette.text.secondary }} />
                      <Typography variant="caption" color="text.secondary">
                        {video.likes}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography variant="caption" color="text.secondary" sx={{ 
                    mt: 0.5,
                    textAlign: 'center',
                    opacity: 0.8
                  }}>
                    {video.uploadDate}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
