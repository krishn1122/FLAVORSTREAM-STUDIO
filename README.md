# FlavorStream Studio

An Amazon Prime-inspired admin panel for managing food video content with AI-powered analysis.

![FlavorStream Studio](https://source.unsplash.com/random/1200x600/?dashboard)

## Features

- **Amazon Prime-Inspired UI**: Dark theme, focus on large visuals, clear typography
- **Video Upload**: Upload food videos for analysis and publishing
- **Gemini AI Integration**: Automatic analysis of food videos to generate:
  - Detailed descriptions
  - Pre-set tags (e.g., spicy, creamy, vegan)
  - AI-suggested tags
- **Analytics Dashboard**: View performance metrics and recent uploads
- **Video Management**: 
  - Visibility settings (Public, Private, Scheduled)
  - Delete videos
  - Content preview

## Tech Stack

- **Frontend**: React, Material UI
- **State Management**: React Hooks
- **Routing**: React Router
- **Charts**: Recharts
- **AI Integration**: Gemini API (vision model)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Gemini API key (for AI features)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/flavorstream-studio.git
   cd flavorstream-studio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### Configuration

To enable AI features, add your Gemini API key in the Settings page of the admin panel.

## Build for Production

```bash
npm run build
```

This builds the app for production to the `build` folder, optimized for best performance. The build is minified and file names include hashes.

## Folder Structure

```
src/
  ├── assets/       # Static assets like images
  ├── components/   # Reusable UI components
  ├── hooks/        # Custom React hooks
  ├── pages/        # Application pages
  ├── services/     # API services including Gemini AI
  ├── styles/       # Global styles and theme
  └── utils/        # Utility functions
```

## License

MIT

## Acknowledgments

- Amazon Prime Video UI for design inspiration
- Google's Gemini AI for content analysis
