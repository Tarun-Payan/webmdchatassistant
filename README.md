# Healthcare Chat Assistant

A modern, AI-powered chatbot widget for healthcare websites, built with React, TailwindCSS, and Google Gemini API.

## Features

- Floating chat button with smooth animations
- Real-time chat interface
- Responsive design
- Healthcare-focused AI responses
- Easy integration into any website
- Secure API communication

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   GOOGLE_API_KEY=your_google_api_key_here
   PORT=3000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. In a separate terminal, start the backend server:
   ```bash
   npm run start
   ```

## Deployment

The application can be easily deployed to Vercel:

1. Push your code to a GitHub repository
2. Import the repository to Vercel
3. Add your environment variables in the Vercel dashboard
4. Deploy!

## Integration

To integrate the chat widget into your website:

1. Build the project:
   ```bash
   npm run build
   ```

2. Include the built JavaScript and CSS files in your website
3. Add the following HTML where you want the chat widget to appear:
   ```html
   <div id="root"></div>
   <script src="/path/to/your/built/script.js"></script>
   ```

## Security Notes

- Always keep your API keys secure
- Use HTTPS in production
- Implement rate limiting on the backend
- Consider adding user authentication if needed

## License

MIT 