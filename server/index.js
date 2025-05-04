import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from "@google/genai";
import xml2js from 'xml2js';
import axios from 'axios';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Initialize Google Gemini AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// In-memory set of valid WebMD URLs from sitemap
let webmdSitemapUrls = new Set();

// Function to fetch and parse the WebMD sitemap
const loadWebmdSitemap = async () => {
  try {
    // Try multiple sitemap locations
    const sitemapLocations = [
      'https://www.webmd.com/sitemap.xml',
      'https://www.webmd.com/sitemap_index.xml',
      'https://www.webmd.com/sitemap/sitemap.xml'
    ];

    let sitemapLoaded = false;

    for (const sitemapUrl of sitemapLocations) {
      try {
        console.log(`Attempting to load sitemap from: ${sitemapUrl}`);
        const { data } = await axios.get(sitemapUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'application/xml, text/xml, */*',
            'Accept-Language': 'en-US,en;q=0.9'
          }
        });

        const parser = new xml2js.Parser({
          explicitArray: false,
          mergeAttrs: true,
          normalizeTags: true
        });

        const parsed = await parser.parseStringPromise(data);

        if (parsed.urlset && parsed.urlset.url) {
          const urls = Array.isArray(parsed.urlset.url) ? parsed.urlset.url : [parsed.urlset.url];
          urls.forEach(entry => {
            if (entry.loc && entry.loc.startsWith('https://www.webmd.com')) {
              webmdSitemapUrls.add(entry.loc.trim());
            }
          });
          sitemapLoaded = true;
          console.log(`Successfully loaded ${webmdSitemapUrls.size} URLs from sitemap`);
          break;
        }
      } catch (error) {
        console.log(`Failed to load sitemap from ${sitemapUrl}: ${error.message}`);
        continue;
      }
    }

    // If no sitemap was loaded, use fallback URLs
    if (!sitemapLoaded) {
      console.log('Using fallback set of known valid WebMD URLs');
      webmdSitemapUrls = new Set([
        'https://www.webmd.com',
        'https://www.webmd.com/conditions',
        'https://www.webmd.com/drugs',
        'https://www.webmd.com/well-being',
        'https://www.webmd.com/tools',
        'https://www.webmd.com/news',
        'https://www.webmd.com/mental-health',
        'https://www.webmd.com/diet',
        'https://www.webmd.com/fitness-exercise',
        'https://www.webmd.com/women',
        'https://www.webmd.com/men',
        'https://www.webmd.com/children',
        'https://www.webmd.com/symptom-checker',
        'https://www.webmd.com/a-to-z-guides',
        'https://www.webmd.com/drugs/index-drugs',
        'https://www.webmd.com/diet/features',
        'https://www.webmd.com/fitness-exercise/features',
        'https://www.webmd.com/mental-health/features',
        'https://www.webmd.com/children/features',
        'https://www.webmd.com/women/features',
        'https://www.webmd.com/men/features'
      ]);
    }

    // Add dynamic URL patterns for common content
    const commonPaths = [
      '/default.htm',
      '/default.aspx',
      '/index.htm',
      '/index.aspx'
    ];

    const baseUrls = Array.from(webmdSitemapUrls);
    baseUrls.forEach(baseUrl => {
      commonPaths.forEach(path => {
        if (!baseUrl.endsWith(path)) {
          webmdSitemapUrls.add(baseUrl + path);
        }
      });
    });

    console.log(`Total valid URLs: ${webmdSitemapUrls.size}`);
  } catch (error) {
    console.error('Error in loadWebmdSitemap:', error.message);
    // Ensure we have at least the basic URLs even if everything fails
    webmdSitemapUrls = new Set([
      'https://www.webmd.com',
      'https://www.webmd.com/conditions',
      'https://www.webmd.com/drugs',
      'https://www.webmd.com/well-being',
      'https://www.webmd.com/tools'
    ]);
  }
};

// Call this at server startup
loadWebmdSitemap();

// Function to check if a WebMD URL is in the sitemap
const isUrlInWebmdSitemap = (url) => {
  // Remove trailing slashes and normalize the URL
  const normalizedUrl = url.replace(/\/$/, '').toLowerCase();
  
  // Check exact match
  if (webmdSitemapUrls.has(normalizedUrl)) {
    return true;
  }

  // Check if URL starts with any known valid base URL
  for (const validUrl of webmdSitemapUrls) {
    if (normalizedUrl.startsWith(validUrl.toLowerCase())) {
      return true;
    }
  }

  return false;
};

app.use(cors());
app.use(express.json());

// WebMD content structure analyzer
const webmdContentStructure = {
  mainSections: {
    conditions: {
      baseUrl: 'https://www.webmd.com/conditions',
      validPaths: [
        'add-adhd',
        'allergies',
        'arthritis',
        'atrial-fibrillation',
        'breast-cancer',
        'cancer',
        'crohns-disease',
        'depression',
        'diabetes',
        'dvt',
        'eczema',
        'eye-health',
        'heart-disease',
        'hiv-aids',
        'lung-disease',
        'lupus',
        'mental-health',
        'multiple-sclerosis',
        'migraine',
        'pain-management',
        'psoriasis',
        'psoriatic-arthritis',
        'rheumatoid-arthritis',
        'sexual-conditions',
        'skin-problems',
        'sleep-disorders',
        'ulcerative-colitis'
      ]
    },
    drugs: {
      baseUrl: 'https://www.webmd.com/drugs',
      validPaths: [
        'index-drugs',
        'pill-identifier',
        'interaction-checker'
      ]
    },
    wellBeing: {
      baseUrl: 'https://www.webmd.com/well-being',
      validPaths: [
        'aging-well',
        'baby',
        'birth-control',
        'childrens-health',
        'diet-weight-management',
        'fitness-exercise',
        'food-recipes',
        'health-balance',
        'healthy-beauty',
        'mens-health',
        'parenting',
        'pet-health',
        'pregnancy',
        'sex-relationships',
        'teen-health',
        'womens-health'
      ]
    },
    tools: {
      baseUrl: 'https://www.webmd.com/tools',
      validPaths: [
        'symptom-checker',
        'find-a-doctor',
        'bmi-calculator',
        'ovulation-calculator',
        'cold-flu-map',
        'pill-identifier',
        'drugs-interaction-checker',
        'cat-health-tool',
        'dog-health-tool',
        'due-date-calculator',
        'fitness-calorie-counter',
        'kids-bmi',
        'visual-pregnancy-timeline'
      ]
    }
  },
  contentTypes: {
    articles: {
      baseUrl: 'https://www.webmd.com',
      validPaths: ['/default.htm', '/default.aspx']
    },
    slideshows: {
      baseUrl: 'https://www.webmd.com',
      validPaths: ['/ss/slideshow-']
    },
    news: {
      baseUrl: 'https://www.webmd.com/news',
      validPaths: ['/default.htm']
    }
  }
};

// Function to validate WebMD URL against known structure
const validateWebMDStructure = (url) => {
  // Remove any @ symbol and clean the URL
  let cleanUrl = url.replace(/^@/, '').trim();
  
  // Check if URL matches any of the known valid structures
  for (const [section, data] of Object.entries(webmdContentStructure.mainSections)) {
    if (cleanUrl.startsWith(data.baseUrl)) {
      const path = cleanUrl.replace(data.baseUrl, '').split('/')[1];
      return data.validPaths.includes(path);
    }
  }
  
  // Check content types
  for (const [type, data] of Object.entries(webmdContentStructure.contentTypes)) {
    if (cleanUrl.startsWith(data.baseUrl)) {
      return data.validPaths.some(path => cleanUrl.includes(path));
    }
  }
  
  return false;
};

// Function to validate WebMD URLs
const validateWebMDUrl = (url) => {
  const webmdDomains = [
    'www.webmd.com',
    'www.webmd.boots.com',
    'www.webmd.com.cn',
    'www.webmd.com.hk',
    'www.webmd.com.tw'
  ];
  return webmdDomains.some(domain => url.includes(domain));
};

// Update checkUrlAccessibility to use sitemap
const checkUrlAccessibility = async (url) => {
  try {
    // First check sitemap
    if (!isUrlInWebmdSitemap(url)) {
      return false;
    }
    // Optionally, still do a HEAD request for double-checking
    const response = await fetch(url, { 
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    if (response.ok && response.status !== 404) {
      const contentType = response.headers.get('content-type');
      return contentType && contentType.includes('text/html');
    }
    return false;
  } catch (error) {
    return false;
  }
};

// Function to format WebMD URL
const formatWebMDUrl = async (baseUrl) => {
  // Remove any parentheses and their contents
  let cleanUrl = baseUrl.replace(/\([^)]*\)/g, '');
  
  // Remove any query parameters or fragments
  cleanUrl = cleanUrl.split('?')[0].split('#')[0];
  
  // Remove any trailing special characters including parentheses, periods, commas, etc.
  cleanUrl = cleanUrl.replace(/[.,;:!?)\s]+$/, '');
  
  // Remove any spaces
  cleanUrl = cleanUrl.trim();
  
  // Remove any @ symbol at the beginning
  cleanUrl = cleanUrl.replace(/^@/, '');
  
  // Validate against known structure
  if (!validateWebMDStructure(cleanUrl)) {
    return null;
  }

  // Check if the URL is accessible
  const isAccessible = await checkUrlAccessibility(cleanUrl);
  if (!isAccessible) {
    // Try alternative URL format
    const alternativeUrl = cleanUrl.replace('/default.htm', '');
    const isAlternativeAccessible = await checkUrlAccessibility(alternativeUrl);
    if (!isAlternativeAccessible) {
      // Try removing slideshow segments
      const noSlideshowUrl = cleanUrl.replace(/\/ss\/slideshow-[^/]+/, '');
      const isNoSlideshowAccessible = await checkUrlAccessibility(noSlideshowUrl);
      return isNoSlideshowAccessible ? noSlideshowUrl : null;
    }
    return alternativeUrl;
  }
  
  return cleanUrl;
};

// Function to extract and clean URLs from text
const extractAndCleanUrls = async (text) => {
  // Match URLs in markdown format [text](url) or plain URLs
  const urlRegex = /\[([^\]]+)\]\(([^)]+)\)|(https?:\/\/[^\s]+)/g;
  let match;
  const urls = [];
  
  while ((match = urlRegex.exec(text)) !== null) {
    const url = match[2] || match[3]; // Get URL from either format
    if (url && validateWebMDUrl(url)) {
      const cleanedUrl = await formatWebMDUrl(url);
      if (cleanedUrl) {
      urls.push(cleanedUrl);
      }
    }
  }
  
  return urls;
};

// Function to get descriptive link text based on topic
const getLinkText = (topic) => {
  const linkTexts = {
    symptoms: 'Understanding Symptoms and Conditions',
    conditions: 'Comprehensive Health Conditions Guide',
    medications: 'Understanding Medications and Treatments',
    drugs: 'Understanding Medications and Treatments',
    diet: 'Nutrition and Diet Information',
    nutrition: 'Nutrition and Diet Information',
    exercise: 'Fitness and Exercise Resources',
    fitness: 'Fitness and Exercise Resources',
    'mental health': 'Mental Health and Wellness Guide',
    depression: 'Understanding Depression',
    anxiety: 'Understanding Anxiety',
    children: 'Children\'s Health Information',
    kids: 'Children\'s Health Information',
    pediatric: 'Pediatric Health Resources',
    women: 'Women\'s Health Information',
    pregnancy: 'Pregnancy and Parenting Guide',
    menopause: 'Understanding Menopause',
    men: 'Men\'s Health Information',
    prostate: 'Understanding Prostate Health',
    testosterone: 'Understanding Testosterone and Men\'s Health'
  };

  for (const [key, text] of Object.entries(linkTexts)) {
    if (topic.toLowerCase().includes(key)) {
      return text;
    }
  }
  return 'Learn More About This Topic';
};

// Function to format response with valid links
const formatResponseWithLinks = async (response) => {
  // Extract and clean any existing URLs
  const existingUrls = await extractAndCleanUrls(response);
  
  // Split response into paragraphs
  const paragraphs = response.split('\n\n');
  
  // Process each paragraph to add relevant WebMD links
  const processedParagraphs = await Promise.all(paragraphs.map(async paragraph => {
    // Skip if paragraph already contains a valid WebMD URL
    if (existingUrls.some(url => paragraph.includes(url))) {
      return paragraph;
    }
    
    // Add links for common health topics
    const topics = {
      'symptoms': 'https://www.webmd.com/symptom-checker',
      'conditions': 'https://www.webmd.com/conditions',
      'medications': 'https://www.webmd.com/drugs',
      'drugs': 'https://www.webmd.com/drugs',
      'diet': 'https://www.webmd.com/diet',
      'nutrition': 'https://www.webmd.com/diet',
      'exercise': 'https://www.webmd.com/fitness-exercise',
      'fitness': 'https://www.webmd.com/fitness-exercise',
      'mental health': 'https://www.webmd.com/mental-health',
      'depression': 'https://www.webmd.com/mental-health',
      'anxiety': 'https://www.webmd.com/mental-health',
      'children': 'https://www.webmd.com/children',
      'kids': 'https://www.webmd.com/children',
      'pediatric': 'https://www.webmd.com/children',
      'women': 'https://www.webmd.com/women',
      'pregnancy': 'https://www.webmd.com/women',
      'menopause': 'https://www.webmd.com/women',
      'men': 'https://www.webmd.com/men',
      'prostate': 'https://www.webmd.com/men',
      'testosterone': 'https://www.webmd.com/men'
    };

    let hasValidLink = false;
    let updatedParagraph = paragraph;

    for (const [key, url] of Object.entries(topics)) {
      if (paragraph.toLowerCase().includes(key)) {
        const formattedUrl = await formatWebMDUrl(url);
        if (formattedUrl && isUrlInWebmdSitemap(formattedUrl)) {
          const linkText = getLinkText(key);
          updatedParagraph = `${paragraph}\n\n${linkText}: ${formattedUrl}`;
          hasValidLink = true;
          break;
        }
      }
    }
    
    return hasValidLink ? updatedParagraph : paragraph;
  }));

  // Join paragraphs and remove any empty lines
  const formattedResponse = processedParagraphs
    .join('\n\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  // If no valid links were found in the entire response, remove any source references
  if (!formattedResponse.includes('https://www.webmd.com')) {
    return formattedResponse.replace(/\[Source\]/g, '').trim();
  }

  return formattedResponse;
};

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    // Create a prompt with WebMD context
    const prompt = `You are WebMD's AI Assistant. Please provide concise, accurate responses to health-related questions.

Current question: ${message}

Guidelines:
1. Keep responses under 3-4 sentences
2. Focus on key information only
3. Use bullet points for lists
4. Only include WebMD links if you are certain they exist and are accessible
5. If you're not sure about a link's availability, don't include it
6. Always add: "Note: Consult a healthcare professional for medical advice"
7. Use simple, clear language
8. Avoid medical jargon unless necessary
9. If discussing medications, mention both brand and generic names`;

    // Generate response using Gemini AI
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    // Format response with valid WebMD links
    const formattedResponse = await formatResponseWithLinks(response.text);

    res.json({ response: formattedResponse });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: "I'm having trouble connecting to WebMD's database right now. Please try again later." 
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 