import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Snackbar,
  useTheme
} from '@mui/material';
import {
  Save as SaveIcon,
  AccountCircle as AccountIcon,
  Notifications as NotificationsIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';

const Settings = () => {
  const theme = useTheme();
  const [displayName, setDisplayName] = useState('Admin User');
  const [email, setEmail] = useState('admin@flavorstream.studio');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [defaultVisibility, setDefaultVisibility] = useState('public');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleSaveSettings = () => {
    // In a real application, this would save to a backend
    setSnackbar({
      open: true,
      message: 'Settings saved successfully!',
      severity: 'success'
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ mt: 2, pb: 6 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Settings
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Configure your FlavorStream Studio preferences
      </Typography>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        {/* Account Settings */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              backgroundColor: theme.palette.background.paper,
              height: '100%'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <AccountIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
              <Typography variant="h6" fontWeight="600">
                Account Settings
              </Typography>
            </Box>
            
            <TextField
              label="Display Name"
              fullWidth
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              margin="normal"
            />
            
            <TextField
              label="Email Address"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              type="email"
            />
            
            <Button 
              variant="contained" 
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSaveSettings}
              sx={{ mt: 2 }}
            >
              Update Account
            </Button>
          </Paper>
        </Grid>
        
        {/* Notification Settings */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              backgroundColor: theme.palette.background.paper
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <NotificationsIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
              <Typography variant="h6" fontWeight="600">
                Notification Settings
              </Typography>
            </Box>
            
            <FormControlLabel
              control={
                <Switch 
                  checked={emailNotifications} 
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  color="primary"
                />
              }
              label="Email Notifications"
            />
            
            <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
              Receive email notifications for uploads, AI analysis, and user interactions
            </Typography>
            
            <FormControlLabel
              control={
                <Switch 
                  checked={pushNotifications} 
                  onChange={(e) => setPushNotifications(e.target.checked)}
                  color="primary"
                />
              }
              label="Push Notifications"
            />
            
            <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
              Receive browser push notifications for important updates
            </Typography>
            
            <Divider sx={{ my: 3 }} />
            
            <Button 
              variant="contained" 
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSaveSettings}
            >
              Save Notification Settings
            </Button>
          </Paper>
        </Grid>
        
        {/* Default Settings */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              backgroundColor: theme.palette.background.paper
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <VisibilityIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
              <Typography variant="h6" fontWeight="600">
                Content Default Settings
              </Typography>
            </Box>
            
            <TextField
              select
              label="Default Video Visibility"
              fullWidth
              value={defaultVisibility}
              onChange={(e) => setDefaultVisibility(e.target.value)}
              margin="normal"
              SelectProps={{
                native: true,
              }}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="scheduled">Scheduled</option>
            </TextField>
            
            <Alert severity="info" sx={{ mt: 2, mb: 3 }}>
              Default settings will be applied to all new uploaded videos
            </Alert>
            
            <Button 
              variant="contained" 
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSaveSettings}
            >
              Save Default Settings
            </Button>
          </Paper>
        </Grid>
      </Grid>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Settings;
