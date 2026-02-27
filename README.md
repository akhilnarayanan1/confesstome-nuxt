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
FB_API_KEY=your_api_key
FB_AUTH_DOMAIN=your_auth_domain
FB_PROJECT_ID=your_project_id
FB_STORAGE_BUCKET=your_storage_bucket
FB_MESSAGING_SENDER_ID=your_sender_id
FB_APP_ID=your_app_id
FB_MEASUREMENT_ID=your_measurement_id
GOOGLE_APPLICATION_CREDENTIALS=service-account.json
BASE_URL=confessto.me
APP_NAME=ConfessTo.Me
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
confesstome-nuxt/
├── app/
│   ├── pages/           # Route-based pages
│   │   ├── index.vue    # Landing page
│   │   ├── @[user].vue  # User profile/confession page
│   │   ├── messages.vue # Chat list
│   │   ├── reply.vue    # Chat interface
│   │   ├── dashboard.vue # User dashboard
│   │   ├── auth-handler.vue # Authentication handler
│   │   ├── login.vue    # User login
│   │   ├── signup.vue   # User registration
│   │   └── forgot.vue   # Password reset
│   ├── components/      # Reusable Vue components
│   │   ├── Dashboard.vue
│   │   ├── CompleteProfile.vue
│   │   ├── Toast.vue
│   │   ├── Navbar.vue
│   │   ├── CircleLoad.vue
│   │   ├── InputLabel.vue
│   │   ├── LoadingChats.vue
│   │   └── LoadingDashboard.vue
│   ├── composables/     # Vue composables for state
│   │   ├── profile.ts   # User profile state
│   │   ├── toasts.ts    # Toast notifications
│   │   ├── fieldAlerts.ts # Form validation alerts
│   │   ├── alert.ts     # General alerts
│   │   ├── auth.ts      # Authentication state management
│   │   └── app.ts       # App configuration
│   ├── assets/
│   │   ├── css/
│   │   │   └── main.css # Global styles with Material Symbols
│   │   └── js/          # TypeScript utilities
│   │       ├── types.ts # TypeScript interfaces
│   │       ├── functions.ts # Utility functions
│   │       └── forms.ts # Form validation classes
│   ├── layouts/         # Page layouts
│   │   ├── default.vue  # Default layout
│   │   ├── app.vue      # Main app layout
│   │   └── auth.vue     # Authentication layout
│   ├── middleware/      # Route middleware
│   │   └── auth.ts      # Authentication guard middleware
│   └── app.vue          # Root component
├── public/              # Static assets
│   ├── favicon.ico
│   └── icons8-google.svg
├── dist/                # Build output (generated)
├── node_modules/        # Dependencies (generated)
├── nuxt.config.ts       # Nuxt configuration
├── package.json         # Project dependencies
├── package-lock.json    # Lock file
├── tailwind.config.js   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
├── firebase.json        # Firebase configuration
├── firestore.indexes.json # Firestore indexes
├── firestore.rules      # Firestore security rules
└── service-account.json # Firebase service account (gitignored)
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

## Production (Firebase App Hosting)

This project deploys via Firebase App Hosting with automatic Git-connected rollouts.

### Push secrets to Firebase Secret Manager

Run each command and paste the value when prompted:

```bash
firebase apphosting:secrets:set fb_api_key --project <your-project-id>
firebase apphosting:secrets:set fb_auth_domain --project <your-project-id>
firebase apphosting:secrets:set fb_project_id --project <your-project-id>
firebase apphosting:secrets:set fb_storage_bucket --project <your-project-id>
firebase apphosting:secrets:set fb_messaging_sender_id --project <your-project-id>
firebase apphosting:secrets:set fb_app_id --project <your-project-id>
firebase apphosting:secrets:set fb_measurement_id --project <your-project-id>
```

For the Firebase Admin SDK (required for SSR auth), store the service account key as a secret:

```bash
firebase apphosting:secrets:set --force --data-file service-account.json google_app_credentials --project <your-project-id>
firebase apphosting:secrets:grantaccess google_app_credentials --backend <your-backend-id> --project <your-project-id>
```

> Only needs to be done once (or when values change).
>
> The secret name must be lowercase — `google_app_credentials` maps to the `GOOGLE_APPLICATION_CREDENTIALS` environment variable via `apphosting.yaml`.

## 📄 License

© ConfessTo.Me All rights reserved. 2024