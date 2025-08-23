# ConfessTo.Me - Anonymous Confession & Chat Platform

An anonymous confession and chat platform built with Nuxt 3 and Firebase, where users can send and receive anonymous messages and engage in private conversations.

## ✨ Features

- **🎭 Anonymous Confessions**: Send confessions to any user without creating an account
- **💬 One-sided Anonymous Chat**: Registered users can have private conversations based on confessions  
- **🔗 Personal Links**: Each user gets a unique link (confessto.me/@username) for receiving messages
- **🎨 Fake Identity System**: Consistent anonymous identities using generated names and colors
- **📱 Real-time Updates**: Live chat interface with instant message delivery
- **📊 Dashboard**: View message statistics and manage conversations

## 🛠 Tech Stack

- **Frontend**: Nuxt 4, Vue 3, TailwindCSS, DaisyUI
- **Backend**: Firebase Firestore, Firebase Auth
- **SSR**: VueFire with server-side rendering support
- **Icons**: Material Symbols
- **Utilities**: Lodash, Faker.js

## 🚀 Setup

1. Install dependencies:
```bash
npm install
```

2. Set up Firebase environment variables in `.env`:
```env
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id
GOOGLE_APPLICATION_CREDENTIALS=service-account.json
```

3. Configure Firebase Service Account (for server-side operations):
   - Download service account key from Firebase Console
   - Place the JSON file in your project root as `service-account.json`
   - Ensure it's added to `.gitignore` for security

4. Start development server:
```bash
npm run dev
```

5. Visit http://localhost:3000

## 📁 Project Structure

```
app/
├── pages/           # Route-based pages
│   ├── index.vue    # Landing page
│   ├── @[user].vue  # User profile/confession page
│   ├── messages.vue # Chat list
│   ├── reply.vue    # Chat interface
│   └── auth/        # Authentication pages
├── components/      # Reusable Vue components
├── composables/     # Vue composables for state
├── assets/
│   ├── css/        # Global styles
│   └── js/         # TypeScript utilities
└── layouts/        # Page layouts
```

## 🔥 Firebase Collections

- **users**: User profiles with username and display name
- **messages**: Initial confession messages between users  
- **replies**: Chat replies linked to confession threads

## 📦 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run generate` - Generate static site
- `npm run preview` - Preview production build
- `npm run deploy-hosting` - Deploy to Firebase Hosting

## 📄 License

© ConfessTo.Me All rights reserved. 2024