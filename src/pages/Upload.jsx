import React, { useState, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Grid, 
  LinearProgress, 
  Chip,
  CircularProgress,
  Snackbar,
  Alert,
  useTheme,
  Card,
  CardContent,
  TextField
} from '@mui/material';
import { 
  CloudUpload as CloudUploadIcon,
  VideoLibrary as VideoIcon, 
  Tag as TagIcon,
  Psychology as AIIcon
} from '@mui/icons-material';

// Import the Gemini AI service
import { analyzeVideoContent } from '../services/geminiService';

const Upload = () => {
  const theme = useTheme();
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [analysisResult, setAnalysisResult] = useState(null);
  const [selectedPresetTags, setSelectedPresetTags] = useState([]);
  const [selectedAITags, setSelectedAITags] = useState([]);
  const [suggestedTitle, setSuggestedTitle] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  
  // Predefined tags to select from
  const presetTags = [
    "spicy", "creamy", "vegan", "quick-recipe", "dessert", 
    "breakfast", "lunch", "dinner", "snack", "appetizer",
    "gluten-free", "low-carb", "keto", "vegetarian", "seafood",
    "meat", "chicken", "beef", "pasta", "soup", "salad", "pizza",
    "baking", "grilling", "stir-fry", "slow-cooker", "italian",
    "mexican", "asian", "indian", "american", "french"
  ];

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith('video/')) {
      setSnackbar({
        open: true,
        message: 'Please upload a video file',
        severity: 'error'
      });
      return;
    }

    setFile(selectedFile);
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    };
    fileReader.readAsDataURL(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setSnackbar({
        open: true,
        message: 'Please select a file to upload',
        severity: 'error'
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        const newProgress = prevProgress + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 500);

    // Simulate upload completion
    setTimeout(() => {
      clearInterval(interval);
      setIsUploading(false);
      setUploadProgress(100);
      setSnackbar({
        open: true,
        message: 'Video uploaded successfully!',
        severity: 'success'
      });
      
      // Begin AI analysis
      handleAnalysis();
    }, 5000);
  };

  const handleAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      // Call Gemini AI service to analyze the video
      // The service will use the API key from the .env file
      const result = await analyzeVideoContent(file);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to analyze video content');
      }
      
      setAnalysisResult(result);
      
      // If the AI returned a title, set it as suggested title
      if (result.title) {
        setSuggestedTitle(result.title);
        setVideoTitle(result.title); // Set as default title (user can edit)
      }
      
      // If the AI returned a thumbnail, update the preview with it
      if (result.thumbnail) {
        setPreviewUrl(result.thumbnail);
      }
      
      // Auto-select the preset tags based on AI analysis of video content
      if (result.suggestedTags && result.suggestedTags.length > 0) {
        // Convert tags to lowercase for comparison
        const suggestedTagsLower = result.suggestedTags.map(tag => tag.toLowerCase().replace(/^#/, ''));
        
        // Find matching preset tags based on AI suggestions
        const matchingPresetTags = presetTags.filter(presetTag => {
          const presetTagLower = presetTag.toLowerCase();
          
          // Direct match
          if (suggestedTagsLower.includes(presetTagLower)) {
            return true;
          }
          
          // Check for partial matches or related terms
          return suggestedTagsLower.some(suggestedTag => {
            // Check if the suggested tag contains the preset tag or vice versa
            if (suggestedTag.includes(presetTagLower) || presetTagLower.includes(suggestedTag)) {
              return true;
            }
            
            // Check for related terms (e.g., "italian" and "pasta")
            const relatedTerms = {
              "italian": ["pasta", "pizza", "risotto"], 
              "asian": ["stir-fry", "wok", "soy"], 
              "indian": ["curry", "spicy", "biryani"],
              "mexican": ["taco", "burrito", "spicy"],
              "breakfast": ["morning", "brunch", "eggs"],
              "dessert": ["sweet", "cake", "chocolate", "sugar"],
              "vegan": ["plant-based", "vegetarian", "dairy-free"],
              "spicy": ["hot", "chili", "pepper"],
              "grilling": ["bbq", "barbecue"],
              "baking": ["oven", "cake", "pastry", "bread"]
            };
            
            // Check if the preset tag has related terms
            const relatedToPreset = relatedTerms[presetTagLower];
            if (relatedToPreset && relatedToPreset.some(term => suggestedTag.includes(term))) {
              return true;
            }
            
            // Check if the suggested tag has related terms
            for (const [key, values] of Object.entries(relatedTerms)) {
              if (values.includes(presetTagLower) && suggestedTag.includes(key)) {
                return true;
              }
            }
            
            return false;
          });
        });
        
        // Set the matching preset tags (limit to 6 tags to avoid overwhelming the UI)
        setSelectedPresetTags(matchingPresetTags.slice(0, 6));
        
        // Set AI suggested tags that don't match preset tags
        const nonMatchingAITags = result.suggestedTags.filter(tag => {
          const tagWithoutHash = tag.replace(/^#/, '');
          return !matchingPresetTags.some(presetTag => 
            presetTag.toLowerCase() === tagWithoutHash.toLowerCase()
          );
        });
        
        setSelectedAITags(nonMatchingAITags.slice(0, 8)); // Limit to 8 AI tags
      }
      
      setSnackbar({
        open: true,
        message: 'AI analysis completed successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('AI Analysis error:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to analyze video content',
        severity: 'error'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePresetTagToggle = (tag) => {
    if (selectedPresetTags.includes(tag)) {
      setSelectedPresetTags(selectedPresetTags.filter(t => t !== tag));
    } else {
      setSelectedPresetTags([...selectedPresetTags, tag]);
    }
  };

  const handleAITagToggle = (tag) => {
    if (selectedAITags.includes(tag)) {
      setSelectedAITags(selectedAITags.filter(t => t !== tag));
    } else {
      setSelectedAITags([...selectedAITags, tag]);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handlePublish = () => {
    // In a real application, this would save the video data, description, and tags to a backend
    setSnackbar({
      open: true,
      message: 'Food video published successfully!',
      severity: 'success'
    });
  };

  return (
    <Box sx={{ mt: 2, pb: 6 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Upload Food Video
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Upload your food videos for AI-powered analysis and tagging
      </Typography>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              backgroundColor: theme.palette.background.paper,
              border: `1px dashed ${theme.palette.grey[500]}`,
              height: '100%'
            }}
          >
            {!file ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  py: 8,
                  cursor: 'pointer',
                }}
                onClick={() => fileInputRef.current.click()}
              >
                <CloudUploadIcon sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }} />
                <Typography variant="h6">Drag & drop your video here</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  or click to browse your files
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3 }}
                  startIcon={<VideoIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current.click();
                  }}
                >
                  Select Video
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="video/*"
                  style={{ display: 'none' }}
                />
              </Box>
            ) : (
              <Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom>Video Preview</Typography>
                  <Box
                    sx={{
                      width: '100%',
                      borderRadius: 1,
                      overflow: 'hidden',
                      backgroundColor: '#000',
                    }}
                  >
                    <video
                      controls
                      width="100%"
                      src={previewUrl}
                      style={{ display: 'block', maxHeight: '300px' }}
                    />
                  </Box>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                  </Typography>
                </Box>
                
                {isUploading && (
                  <Box sx={{ width: '100%', mb: 2 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={uploadProgress} 
                      sx={{ 
                        height: 4, 
                        borderRadius: 2, 
                        backgroundColor: theme.palette.grey[800],
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: theme.palette.primary.main
                        }
                      }}
                    />
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ mt: 1, textAlign: 'center' }}
                    >
                      {uploadProgress}% Uploaded
                    </Typography>
                  </Box>
                )}
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      setFile(null);
                      setPreviewUrl(null);
                      setUploadProgress(0);
                      setAnalysisResult(null);
                    }}
                  >
                    Clear
                  </Button>
                  
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={isUploading || isAnalyzing}
                    onClick={handleUpload}
                    startIcon={isUploading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
                  >
                    {isUploading ? 'Uploading...' : 'Upload Video'}
                  </Button>
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              backgroundColor: theme.palette.background.paper,
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <AIIcon sx={{ mr: 1 }} /> 
              Gemini AI Analysis
            </Typography>
            
            {isAnalyzing ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8 }}>
                <CircularProgress color="primary" sx={{ mb: 2 }} />
                <Typography variant="body1">Analyzing video content...</Typography>
                <Typography variant="body2" color="text.secondary">
                  Gemini AI is processing your video to extract food details and tags
                </Typography>
              </Box>
            ) : analysisResult ? (
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Card variant="outlined" sx={{ mb: 3, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      AI-Suggested Title
                    </Typography>
                    <TextField
                      fullWidth
                      value={videoTitle}
                      onChange={(e) => setVideoTitle(e.target.value)}
                      variant="outlined"
                      size="small"
                      InputProps={{
                        sx: { fontWeight: 'bold', fontSize: '1.1rem' }
                      }}
                      sx={{ mb: 3 }}
                    />
                    
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      AI-Generated Description
                    </Typography>
                    <Typography variant="body1">
                      {analysisResult.description}
                    </Typography>
                  </CardContent>
                </Card>
                
                <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <TagIcon sx={{ mr: 1, fontSize: 18 }} /> 
                  Selected Tags
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Pre-set Tags
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {presetTags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        onClick={() => handlePresetTagToggle(tag)}
                        color={selectedPresetTags.includes(tag) ? 'primary' : 'default'}
                        variant={selectedPresetTags.includes(tag) ? 'filled' : 'outlined'}
                        sx={{ 
                          borderRadius: '4px', 
                          textTransform: 'capitalize',
                        }}
                      />
                    ))}
                  </Box>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    AI Suggested Tags
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {analysisResult.suggestedTags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        onClick={() => handleAITagToggle(tag)}
                        color={selectedAITags.includes(tag) ? 'secondary' : 'default'}
                        variant={selectedAITags.includes(tag) ? 'filled' : 'outlined'}
                        sx={{ 
                          borderRadius: '4px', 
                          textTransform: 'capitalize',
                        }}
                      />
                    ))}
                  </Box>
                </Box>
                
                <Box sx={{ mt: 'auto', pt: 3 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    onClick={handlePublish}
                    sx={{ mt: 2 }}
                    disabled={!videoTitle.trim()} // Disable if title is empty
                  >
                    Publish Food Video
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8 }}>
                <AIIcon sx={{ fontSize: 60, color: theme.palette.grey[500], mb: 2 }} />
                <Typography variant="body1">Upload a video to see AI analysis</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 1 }}>
                  Gemini AI will analyze your food video and extract details, descriptions, and suggest relevant tags
                </Typography>
              </Box>
            )}
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

export default Upload;
