/**
 * Gemini AI Video Analysis Service
 * This service handles communication with Google's Gemini API for analyzing food videos
 */

// Import the Gemini API client
import { extractVideoFrames } from '../utils/videoUtils';

// Get the API key from environment variables
const DEFAULT_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

/**
 * Initialize the Gemini client with API key
 * @param {string} apiKey - The Gemini API key (optional, will use env variable if not provided)
 * @returns {Object} - The initialized Gemini client
 */
const initializeGeminiClient = (apiKey = DEFAULT_API_KEY) => {
  const key = apiKey || DEFAULT_API_KEY;
  
  if (!key) {
    throw new Error('Gemini API key is required. Please set it in the .env file or provide it in the settings.');
  }
  
  return {
    apiKey: key,
    isInitialized: true
  };
};

/**
 * Process a video file with Gemini Vision API
 * @param {File} videoFile - The video file to analyze
 * @param {string} apiKey - The Gemini API key (optional, will use env variable if not provided)
 * @returns {Promise<Object>} - The analysis results
 */
const analyzeVideoContent = async (videoFile, apiKey = DEFAULT_API_KEY) => {
  try {
    const key = apiKey || DEFAULT_API_KEY;
    
    // Check if API key is provided
    if (!key) {
      throw new Error('Gemini API key is required. Please set it in the .env file or provide it in the settings.');
    }

    // 1. Extract frames from the video
    const frames = await extractVideoFrames(videoFile, 3);
    
    // 2. Build prompt for Gemini Vision API
    const prompt = `**Role:** You are an expert food analyst and social media content creator specialized in describing food visually and suggesting relevant online engagement strategies.

**Context:** You are processing a video and audio uploaded by a user to a food analysis platform. The video and audio showcase a specific dish or food item, potentially including preparation steps or presentation or item used to prepare the dish.

**Input:** A food video along with audio file.

**Task:** Analyze the provided food video and audio thoroughly and generate the following two distinct outputs:

1.  **Detailed Description:**
    * Identify the primary dish(es) or food items featured in the video or mentioned in the audio.
    * Describe the key visible ingredients in the video or mentioned in the audio.
    * If shown, briefly describe any preparation or cooking techniques demonstrated in the video or mentioned in the audio.
    * Comment on the food's presentation, plating, texture (based on visual cues like crispiness, creaminess, etc.), and overall visual appeal.
    * Infer the potential cuisine type or style if possible (e.g., Italian, homestyle, street food, fine dining).
    * Write this description in an engaging, appetizing, and informative tone suitable for a social media caption or a platform description. Aim for 2-4 descriptive sentences.

2.  **Suggested Hashtags:**
    * Generate a list of 10-15 relevant hashtags optimized for social media platforms (like Instagram, TikTok, Pinterest, etc.).
    * Include a mix of:
        * Specific hashtags related to the identified dish and key ingredients (e.g., #ChocolateCake, #PastaCarbonara, #AvocadoToast).
        * Hashtags related to the cuisine or cooking style (e.g., #ItalianFood, #VeganRecipes, #HomeCooking, #StreetFood).
        * Broader, popular food-related hashtags (e.g., #Foodie, #Delicious, #FoodVideo, #RecipeShare, #InstaFood, #FoodPhotography).
        * Potentially one or two trending (but relevant) food hashtags if applicable [Model should use its knowledge up to its last update].
    * Ensure all hashtags start with '#'.

**Output Format:** Please structure your response exactly as follows:

**Detailed Description:**
[Insert the generated description here]

**Suggested Hashtags:**
[Insert the generated list of hashtags here, separated by spaces or on new lines, e.g., #tag1 #tag2 #tag3]

**Instructions for Model:**
* Focus solely on the visual content of the video and mentioned in the audio.
* Be objective in identifying elements but use narrated language for the description.
* Ensure the hashtags are directly relevant to the video's content.
* Do not add any conversational text before the "Detailed Description:" heading or after the "Suggested Hashtags:" list.`;
    
    // 3. Call Gemini Vision API with Gemini 2.5 Flash Preview model
    const result = await callGeminiVisionAPI(frames, prompt, key);
    
    return result;
  } catch (error) {
    console.error('Error analyzing video content:', error);
    return {
      success: false,
      error: error.message || 'Failed to analyze video content'
    };
  }
};

/**
 * Calls the Gemini Vision API with the provided frames and prompt
 * @param {Array} frames - Array of image data URIs extracted from the video
 * @param {string} prompt - The prompt to send to Gemini API
 * @param {string} apiKey - The Gemini API key
 * @returns {Promise} - Promise that resolves with the Gemini API response
 */
const callGeminiVisionAPI = async (frames, prompt, apiKey) => {
  try {
    if (!apiKey) {
      throw new Error('Gemini API key is required');
    }

    console.log('Calling Gemini 2.5 Flash Preview API with provided key...');

    // In development mode, we'll simulate the API response
    // In production, this would make a real API call to the Gemini 2.5 Flash Preview model
    const isProduction = true; // Force API call to always happen regardless of environment
    
    if (isProduction) {
      // PRODUCTION MODE: ACTUAL API CALL
      // This is where the actual API call would happen in production
      // Uses the Gemini 2.5 Flash Preview model endpoint for vision tasks
      const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-04-17:generateContent';
      
      // Prepare the request body with the frames and prompt
      const requestBody = {
        contents: [
          {
            parts: [
              { text: prompt },
              // Add each frame as an image part
              ...frames.map(frame => ({
                inline_data: {
                  mime_type: 'image/jpeg',
                  data: frame.replace(/^data:image\/jpeg;base64,/, '')
                }
              }))
            ]
          }
        ],
        generationConfig: {
          temperature: 0.4,
          topP: 0.95,
          maxOutputTokens: 2048
        }
      };
      
      // Make the API call
      const response = await fetch(`${endpoint}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        throw new Error(`Gemini API responded with status: ${response.status}`);
      }
      
      const responseData = await response.json();
      
      // Parse the API response
      const textContent = responseData.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!textContent) {
        throw new Error('Invalid response format from Gemini API');
      }
      
      // Parse the text response according to the expected format
      // Extract the "Detailed Description" and "Suggested Hashtags" sections
      const detailedDescriptionMatch = textContent.match(/\*\*Detailed Description:\*\*([\s\S]*?)(?=\*\*Suggested Hashtags:|$)/i);
      const suggestedHashtagsMatch = textContent.match(/\*\*Suggested Hashtags:\*\*([\s\S]*?)(?=$)/i);
      
      const description = detailedDescriptionMatch ? detailedDescriptionMatch[1].trim() : 'No description available';
      const hashtagsText = suggestedHashtagsMatch ? suggestedHashtagsMatch[1].trim() : '';
      
      // Extract hashtags (words starting with #)
      const hashtagsArray = hashtagsText.match(/#\w+/g) || [];
      
      // Generate a fancy title based on the description
      const generateFancyTitle = (desc) => {
        // Extract food types with a more comprehensive list
        const foodMatches = desc.match(/\b(pasta|spaghetti|fettuccine|lasagna|pizza|margherita|pepperoni|taco|quesadilla|burrito|enchilada|burger|hamburger|cheeseburger|salad|caesar|sandwich|panini|cake|cheesecake|chocolate|pastry|cookie|dessert|curry|tikka|masala|biryani|soup|chowder|bisque|stew|stir-fry|rice|pilaf|risotto|noodle|ramen|chili|paella|sushi|sashimi|tempura|teriyaki|seafood|fish|salmon|tuna|shrimp|chicken|beef|steak|pork|lamb|tofu|vegan|vegetarian|smoothie|bowl|breakfast|brunch|dinner|appetizer)\b/gi);
        
        // Get all unique food matches (case insensitive)
        const uniqueFoods = new Set();
        if (foodMatches) {
          foodMatches.forEach(food => uniqueFoods.add(food.toLowerCase()));
        }
        
        // Convert back to array and get the first item, or use 'Dish' if none found
        const foods = Array.from(uniqueFoods);
        const mainFood = foods.length > 0 ? foods[0] : 'Dish';
        
        // First, check for specific cuisines for more targeted titles
        if (desc.toLowerCase().includes('mexican') || 
            uniqueFoods.has('taco') || 
            uniqueFoods.has('burrito') || 
            uniqueFoods.has('quesadilla') ||
            uniqueFoods.has('enchilada') ||
            desc.toLowerCase().includes('chili')) {
          const mexicanTitles = [
            'Vibrant Mexican Fiesta: Authentic Flavors Unleashed',
            'Sizzling Mexican Delight: Street Food Excellence',
            `${mainFood.charAt(0).toUpperCase() + mainFood.slice(1)} Magnifico: Mexican Culinary Tradition`,
            'South of the Border Sensation: Handcrafted Mexican Magic'
          ];
          return mexicanTitles[Math.floor(Math.random() * mexicanTitles.length)];
        }
        
        if (desc.toLowerCase().includes('italian') || 
            uniqueFoods.has('pasta') || 
            uniqueFoods.has('pizza') || 
            uniqueFoods.has('lasagna') ||
            uniqueFoods.has('fettuccine') ||
            uniqueFoods.has('spaghetti')) {
          const italianTitles = [
            'Italian Indulgence: Rustic Flavors Reimagined',
            `Artisanal ${mainFood.charAt(0).toUpperCase() + mainFood.slice(1)}: La Dolce Vita on a Plate`,
            'Taste of Tuscany: Italian Culinary Poetry',
            `${mainFood.charAt(0).toUpperCase() + mainFood.slice(1)} Perfetto: Classic Italian Elegance`
          ];
          return italianTitles[Math.floor(Math.random() * italianTitles.length)];
        }
        
        if (desc.toLowerCase().includes('indian') || 
            uniqueFoods.has('curry') || 
            uniqueFoods.has('tikka') || 
            uniqueFoods.has('masala') ||
            uniqueFoods.has('biryani')) {
          const indianTitles = [
            'Spice Symphony: Indian Culinary Masterpiece',
            `Royal ${mainFood.charAt(0).toUpperCase() + mainFood.slice(1)}: Treasured Indian Recipe`,
            'Aromatic Indian Journey: A Feast for the Senses',
            'Maharaja\'s Delight: Authentic Indian Tradition'
          ];
          return indianTitles[Math.floor(Math.random() * indianTitles.length)];
        }
        
        if (desc.toLowerCase().includes('asian') || 
            desc.toLowerCase().includes('chinese') || 
            desc.toLowerCase().includes('japanese') || 
            uniqueFoods.has('stir-fry') ||
            uniqueFoods.has('ramen') ||
            uniqueFoods.has('sushi') ||
            uniqueFoods.has('tempura') ||
            uniqueFoods.has('teriyaki')) {
          const asianTitles = [
            'East Asian Elegance: Culinary Precision',
            `${mainFood.charAt(0).toUpperCase() + mainFood.slice(1)} Harmony: Asian Flavor Symphony`,
            'Umami Treasures: Artfully Crafted Asian Delight',
            'Dragon\'s Feast: Exquisite Asian Creation'
          ];
          return asianTitles[Math.floor(Math.random() * asianTitles.length)];
        }
        
        // For vegetarian/vegan foods
        if (desc.toLowerCase().includes('vegetarian') || 
            desc.toLowerCase().includes('vegan') ||
            uniqueFoods.has('vegan') ||
            uniqueFoods.has('vegetarian') ||
            uniqueFoods.has('tofu')) {
          const plantTitles = [
            'Garden Elegance: Plant-Based Perfection',
            'Green Gastronomy: Earth\'s Bounty Transformed',
            `Vibrant ${mainFood.charAt(0).toUpperCase() + mainFood.slice(1)}: Vegetarian Masterpiece`,
            'Nature\'s Canvas: Artisanal Plant Creation'
          ];
          return plantTitles[Math.floor(Math.random() * plantTitles.length)];
        }
        
        // For breakfast foods
        if (desc.toLowerCase().includes('breakfast') || 
            desc.toLowerCase().includes('brunch') ||
            uniqueFoods.has('breakfast') ||
            uniqueFoods.has('brunch') ||
            uniqueFoods.has('smoothie')) {
          const breakfastTitles = [
            'Sunrise Delight: Morning Culinary Symphony',
            `Golden Hour ${mainFood.charAt(0).toUpperCase() + mainFood.slice(1)}: Breakfast Excellence`,
            'Morning Masterpiece: Artisanal Breakfast Creation',
            'Dawn\'s Inspiration: Gourmet Breakfast Experience'
          ];
          return breakfastTitles[Math.floor(Math.random() * breakfastTitles.length)];
        }
        
        // For desserts and sweet treats
        if (desc.toLowerCase().includes('dessert') || 
            desc.toLowerCase().includes('sweet') ||
            uniqueFoods.has('cake') ||
            uniqueFoods.has('pastry') ||
            uniqueFoods.has('cookie') ||
            uniqueFoods.has('cheesecake') ||
            uniqueFoods.has('chocolate') ||
            uniqueFoods.has('dessert')) {
          const sweetTitles = [
            'Sweet Symphony: Decadent Confection',
            `Divine ${mainFood.charAt(0).toUpperCase() + mainFood.slice(1)}: Pastry Perfection`,
            'Velvet Indulgence: Dessert Artistry',
            'Heavenly Sweetness: Confectionery Masterpiece'
          ];
          return sweetTitles[Math.floor(Math.random() * sweetTitles.length)];
        }
        
        // For seafood
        if (desc.toLowerCase().includes('seafood') || 
            desc.toLowerCase().includes('fish') ||
            uniqueFoods.has('seafood') ||
            uniqueFoods.has('fish') ||
            uniqueFoods.has('salmon') ||
            uniqueFoods.has('tuna') ||
            uniqueFoods.has('shrimp')) {
          const seafoodTitles = [
            'Ocean\'s Bounty: Seafood Excellence',
            `${mainFood.charAt(0).toUpperCase() + mainFood.slice(1)} from the Deep: Maritime Delicacy`,
            'Coastal Elegance: Fresh Catch Perfection',
            'Neptune\'s Treasure: Gourmet Seafood Creation'
          ];
          return seafoodTitles[Math.floor(Math.random() * seafoodTitles.length)];
        }
        
        // Generic fancy titles using the main food as the centerpiece
        const titleFormats = [
          `Exquisite ${mainFood.charAt(0).toUpperCase() + mainFood.slice(1)}: A Culinary Masterpiece`,
          `${mainFood.charAt(0).toUpperCase() + mainFood.slice(1)} Perfection: Artisan Creation`,
          `Divine ${mainFood.charAt(0).toUpperCase() + mainFood.slice(1)}: Chef's Signature`,
          `The Ultimate Gourmet ${mainFood.charAt(0).toUpperCase() + mainFood.slice(1)}`,
          `Luxurious ${mainFood.charAt(0).toUpperCase() + mainFood.slice(1)}: Flavor Symphony`,
          `${mainFood.charAt(0).toUpperCase() + mainFood.slice(1)} Elegance: A Taste Revolution`
        ];
        
        // Get a random fancy title
        return titleFormats[Math.floor(Math.random() * titleFormats.length)];
      };
      
      return {
        success: true,
        title: generateFancyTitle(description),
        description: description,
        presetTags: hashtagsArray.slice(0, 5), // First 5 hashtags as preset tags
        suggestedTags: hashtagsArray.slice(5),  // Rest as suggested tags
        // In real implementation, we'd need to generate thumbnails separately
        thumbnail: getFoodThumbnail(Math.floor(Math.random() * 5))
      };
    } else {
      // DEVELOPMENT MODE: SIMULATED RESPONSE
      // Simulate API processing delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Get a random description and its matching thumbnail
      const descriptionIndex = Math.floor(Math.random() * richDescriptions.length);
      
      // Return simulated response with rich descriptions similar to the example
      return {
        success: true,
        title: getFancyTitles(descriptionIndex),
        description: richDescriptions[descriptionIndex],
        presetTags: generateCulinaryTags(descriptionIndex),
        suggestedTags: generateSuggestedTags(descriptionIndex),
        thumbnail: getFoodThumbnail(descriptionIndex) // Add matching thumbnail
      };
    }
  } catch (error) {
    console.error('Error calling Gemini Vision API:', error);
    throw new Error('Failed to analyze video with Gemini Vision API');
  }
};

// Helper functions to generate rich food descriptions similar to the example
const richDescriptions = [
  "Embark on a culinary journey beginning with a shimmering pool of golden oil, brought to life by the energetic splutter of mustard seeds and the fragrant sizzle of fresh curry leaves. To this aromatic base, nutty peanuts are introduced and toasted to perfection, followed by the subtle heat of finely chopped green chilies.\n\nA sweet foundation is built with translucent onions, sautéed gently before mingling with juicy, diced tomatoes. The mixture is then bathed in the vibrant, earthy glow of turmeric powder, creating a rich canvas of flavor.\n\nDelicate, rehydrated flattened rice flakes (Poha) are lovingly folded into this savory medley, absorbing the beautiful colors and aromas. A touch of sugar adds a counterpoint sweetness, perfectly balanced by a bright, zesty squeeze of fresh lemon juice.\n\nFinished with a flourish of verdant, chopped coriander leaves and crowned with a generous sprinkle of crispy sev, this dish is a quintessential Indian breakfast staple. It presents a harmonious symphony of textures – soft, tender Poha, crunchy peanuts, and crisp sev – and a tantalizing balance of savory, tangy, subtly sweet, and mildly spicy notes. A truly comforting yet vibrant savory delight.",
  
  "A symphony of flavors unfolds as delicate ribbons of fresh pasta dance with a velvety cream sauce that clings to each strand with perfect embrace. The journey begins with butter and olive oil melding into liquid gold, welcoming translucent slivers of garlic that release their aromatic essence into the air.\n\nTender pieces of succulent chicken, seared to golden perfection, offer savory depths that complement the sauce's richness. Fresh crimini mushrooms, earthy and meaty, absorb the surrounding flavors while contributing their own woodland notes to this harmonious composition.\n\nThe sauce itself is a masterpiece of balance—heavy cream forming the luscious foundation, enriched by the nutty complexity of freshly grated Parmesan that melts into silky threads throughout. Delicate notes of fresh thyme and cracked black pepper weave through the creamy canvas, while a whisper of lemon zest brightens each mouthful with citrus vivacity.\n\nGarnished with verdant snippets of Italian parsley and additional shavings of aged Parmesan, this fettuccine Alfredo transcends the ordinary. Each twirl of the fork reveals layers of flavor—creamy, savory, herbaceous, and bright—a comforting yet sophisticated dish that embodies the elegant simplicity of Italian cuisine at its finest.",
  
  "A vibrant celebration of color and texture greets the eye as this artful smoothie bowl presents itself like an abstract painting rendered in nature's palette. The foundation—a luscious, velvet-smooth blend of frozen açaí berries and ripe bananas—creates a rich purple canvas of extraordinary depth and subtle sweetness.\n\nThe smoothie's consistency strikes the perfect balance: thick enough to support its artistic toppings, yet still creamy enough to yield easily to a spoon's gentle pressure. Its flavor profile is a masterful interplay of berry tartness and tropical sweetness, with undertones of complexity from added almond butter and a whisper of vanilla.\n\nCrowning this purple majesty is a thoughtfully composed array of toppings, arranged with both aesthetic beauty and textural contrast in mind. Slices of banana fan out like ivory crescents alongside plump blueberries that glisten like amethysts. Ruby-red strawberry wedges provide sweet-tart counterpoints, while granola clusters introduce essential crunchiness.\n\nA sprinkle of chia seeds adds subtle poppy texture throughout, and delicate coconut flakes bring their tropical whisper. A gentle drizzle of amber honey creates glistening paths across the surface, catching light and adding flowery sweetness. This is breakfast transformed into art—nutritionally dense yet visually stunning, offering both sensory delight and sustaining energy.",
  
  "A vibrant, crackling wok sets the stage for this masterful display of culinary choreography, where tender strips of marinated beef dance among a rainbow of fresh vegetables. The journey begins with fragrant sesame oil shimmering in the hot wok, releasing its nutty aroma into the kitchen air.\n\nPaper-thin slices of ginger and minced garlic form the aromatic foundation, their pungent essence infusing the oil before being joined by strips of beef, their edges caramelizing to a beautiful mahogany as they sizzle against the hot metal. The meat surrenders its savory juices, creating the base notes of a complex flavor symphony.\n\nIn quick succession enters a medley of vegetables—crisp bell peppers in stoplight colors, snow peas offering their jade crunch, water chestnuts providing their distinctive texture, and carrots adding their sweet earthiness. Each vegetable is cooked to that perfect moment when colors intensify yet crispness remains, creating a textural counterpoint to the tender beef.\n\nThe crowning glory comes as a glossy sauce—a harmonious blend of soy, oyster sauce, a whisper of honey, and rice wine—cascades over the ingredients, enveloping each piece in its umami embrace. A final sprinkle of toasted sesame seeds and vibrant slivers of spring onion completes this masterpiece of balance and technique—a stir-fry that honors traditional Asian cooking methods while delivering profound satisfaction through its perfect harmony of flavors, textures, and colors.",
  
  "A symphony of aroma announces this exquisite biryani long before it graces the table. Lifting the lid reveals a masterpiece of culinary architecture—fragrant basmati rice grains, each one elongated and separate, form delicate layers interspersed with tender morsels of spice-infused lamb and caramelized onions.\n\nThe rice itself tells a story of careful preparation, having been partially cooked in water infused with whole spices—cardamom pods, cinnamon sticks, cloves, and bay leaves—before being layered with the meat. Each grain has absorbed these flavors while maintaining its structural integrity, neither too firm nor too soft, but achieving that elusive perfect texture.\n\nThe lamb, marinated overnight in a complex mixture of yogurt, ginger-garlic paste, and a blend of ground spices, has been slow-cooked to succulence. Its rich juices have mingled with the ghee-softened onions, creating pockets of intense flavor throughout the dish. Scattered between the layers are jewel-like dried fruits—plump golden raisins and apricots—that offer sweet counterpoints to the savory depth.\n\nCrowning this aromatic creation is a garnish of crisp fried onions, their caramelized sweetness providing textural contrast, alongside fresh mint leaves and cilantro that lend their verdant brightness. A drizzle of saffron-infused milk has painted golden streaks across the top layer of rice, evidence of the precious spice's presence and the care taken in this dish's preparation. This is biryani as art form—a testament to the sophisticated layering of flavors, textures, and techniques that defines the pinnacle of South Asian cuisine."
];

/**
 * Get a thumbnail image that matches the food description
 * @param {number} index - Index of the description
 * @returns {string} - URL of the matching thumbnail image
 */
const getFoodThumbnail = (index) => {
  // Specific images that match each description
  const thumbnails = [
    // Poha (Indian breakfast dish)
    "https://cdn.tasteatlas.com/images/dishes/b76cff726c094e81b6405fcf0f1c0fed.jpg",
    // Fettuccine Alfredo (Pasta dish)
    "https://www.modernhoney.com/wp-content/uploads/2019/01/Fettuccine-Alfredo-1.jpg",
    // Smoothie Bowl
    "https://www.acouplecooks.com/wp-content/uploads/2020/12/Smoothie-Bowl-017.jpg",
    // Beef Stir Fry
    "https://natashaskitchen.com/wp-content/uploads/2020/08/Beef-Stir-Fry-5.jpg",
    // Biryani
    "https://www.indianhealthyrecipes.com/wp-content/uploads/2022/02/hyderabadi-biryani.jpg"
  ];

  return thumbnails[index] || thumbnails[0];
};

const generateCulinaryTags = (index) => {
  const tagSets = [
    ["indian", "breakfast", "vegetarian", "quick-recipe", "spicy", "healthy"],
    ["italian", "pasta", "creamy", "dinner", "comfort-food", "chicken"],
    ["breakfast", "healthy", "vegan", "smoothie", "fruit", "no-cook"],
    ["asian", "stir-fry", "dinner", "beef", "spicy", "quick-recipe"],
    ["indian", "biryani", "rice", "dinner", "lamb", "aromatic"]
  ];
  
  // Return a specific set of tags that matches the description
  return index !== undefined ? tagSets[index] : tagSets[Math.floor(Math.random() * tagSets.length)];
};

const generateSuggestedTags = (index) => {
  const suggestedTagSets = [
    ["poha", "indian-breakfast", "maharashtrian", "street-food", "quick-breakfast"],
    ["alfredo", "creamy-pasta", "italian-classic", "restaurant-style", "date-night"],
    ["acai-bowl", "instagram-worthy", "antioxidant-rich", "superfood", "energy-boost"],
    ["wok-cooking", "asian-cuisine", "weeknight-dinner", "colorful", "protein-rich"],
    ["hyderabadi", "festive", "special-occasion", "fragrant", "spiced-rice"]
  ];
  
  // Return a specific set of tags that matches the description
  return index !== undefined ? suggestedTagSets[index] : suggestedTagSets[Math.floor(Math.random() * suggestedTagSets.length)];
};

/**
 * Get fancy title suggestions that match the food descriptions
 * @param {number} index - Index of the description
 * @returns {string} - A fancy title for the food video
 */
const getFancyTitles = (index) => {
  // Specific fancy titles that match each description
  const titles = [
    // Poha
    "Golden Awakening: The Art of Perfect Poha",
    // Fettuccine Alfredo
    "Silken Symphony: Fettuccine Alfredo Reimagined",
    // Smoothie Bowl
    "Nature's Canvas: Açaí Smoothie Bowl Elegance",
    // Beef Stir Fry
    "Sizzling Harmony: Wok-Fired Beef & Garden Gems",
    // Biryani
    "Aromatic Alchemy: Layered Lamb Biryani Masterpiece"
  ];

  return titles[index] || titles[0];
};

export { initializeGeminiClient, analyzeVideoContent };
