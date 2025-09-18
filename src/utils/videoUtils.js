/**
 * Utility functions for video handling and processing
 */

/**
 * Generate a thumbnail from a video file
 * @param {File} videoFile - The video file
 * @returns {Promise<string>} - A data URL of the thumbnail
 */
const generateVideoThumbnail = (videoFile) => {
  return new Promise((resolve, reject) => {
    // Create a video element to load the video file
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    
    // Create object URL for the video file
    const videoUrl = URL.createObjectURL(videoFile);
    video.src = videoUrl;
    
    // Wait for video to be loadedmetadata
    video.onloadedmetadata = () => {
      // Seek to a point in the video (e.g., 1/3 of the video)
      video.currentTime = Math.min(video.duration / 3, 5); // Go to 1/3 of the video or 5 seconds, whichever is less
      
      // When the video seeked, capture the frame
      video.onseeked = () => {
        try {
          // Create a canvas element to capture the frame
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          
          // Draw the video frame to the canvas
          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // Convert the canvas to a data URL (thumbnail)
          const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.8);
          
          // Clean up resources
          URL.revokeObjectURL(videoUrl);
          
          // Resolve with the thumbnail URL
          resolve(thumbnailUrl);
        } catch (error) {
          reject(error);
        }
      };
      
      video.onerror = () => {
        URL.revokeObjectURL(videoUrl);
        reject(new Error('Error generating video thumbnail'));
      };
    };
    
    video.onerror = () => {
      URL.revokeObjectURL(videoUrl);
      reject(new Error('Error loading video'));
    };
    
    // Start playing the video to enable seeking
    video.play().catch(() => {
      // Ignore play errors, the video is muted and just used for thumbnail generation
    });
  });
};

/**
 * Format the file size into a human-readable string
 * @param {number} bytes - Size in bytes
 * @returns {string} - Formatted string (e.g., "4.2 MB")
 */
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Validate if a file is a valid video format
 * @param {File} file - The file to validate
 * @returns {boolean} - Whether the file is a valid video
 */
const isValidVideo = (file) => {
  const validTypes = [
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/quicktime',
    'video/x-msvideo',
    'video/x-flv',
    'video/x-matroska'
  ];
  
  return validTypes.includes(file.type);
};

/**
 * Extract frames from a video file at specified intervals
 * @param {File} videoFile - The video file
 * @param {number} frameCount - Number of frames to extract
 * @returns {Promise<Array<string>>} - Array of data URLs for each frame
 */
const extractVideoFrames = async (videoFile, frameCount = 5) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    
    const videoUrl = URL.createObjectURL(videoFile);
    video.src = videoUrl;
    
    video.onloadedmetadata = () => {
      const duration = video.duration;
      const frameGap = duration / (frameCount + 1);
      let currentFrame = 0;
      const frames = [];
      
      const captureFrame = () => {
        if (currentFrame >= frameCount) {
          URL.revokeObjectURL(videoUrl);
          resolve(frames);
          return;
        }
        
        // Calculate time for this frame
        const time = frameGap * (currentFrame + 1);
        video.currentTime = time;
      };
      
      video.onseeked = () => {
        try {
          // Create a canvas element to capture the frame
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          
          // Draw the video frame to the canvas
          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // Convert the canvas to a data URL
          const frameUrl = canvas.toDataURL('image/jpeg', 0.7);
          frames.push(frameUrl);
          
          // Move to next frame
          currentFrame++;
          captureFrame();
        } catch (error) {
          URL.revokeObjectURL(videoUrl);
          reject(error);
        }
      };
      
      video.onerror = () => {
        URL.revokeObjectURL(videoUrl);
        reject(new Error('Error processing video'));
      };
      
      // Start capturing frames
      captureFrame();
    };
    
    video.onerror = () => {
      URL.revokeObjectURL(videoUrl);
      reject(new Error('Error loading video'));
    };
  });
};

export {
  generateVideoThumbnail,
  formatFileSize,
  isValidVideo,
  extractVideoFrames
};
