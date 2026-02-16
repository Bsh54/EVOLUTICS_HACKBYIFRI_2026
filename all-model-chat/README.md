# Run and deploy your AI Studio app

This project is an advanced AI hub and opportunities platform.

## Features

- **Opportunities Explorer**: Search, filter, and view premium opportunities.
- **AI Assistant**: Specialized chat sessions to help with recruitment preparation.
- **Admin Dashboard**: Full CRUD (Create, Read, Update, Delete) management for opportunities.
- **Markdown Support**: Rich text rendering for detailed opportunity descriptions.

## Application Routes

- **Main Hub**: `/` - Public exploration and AI Assistant page.
- **Admin Portal**: `/admin-portal` - Dedicated management interface.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
