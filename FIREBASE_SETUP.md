# Firebase Setup Instructions

## 1. Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Create a new project
3. Enable Realtime Database:
   - Go to "Build" > "Realtime Database"
   - Click "Create Database"
   - Select a location (e.g., europe-west1)
   - Choose "Start in test mode" for development

## 2. Add Web App

1. Go to Project Settings (gear icon)
2. Click "Add app" > "Web"
3. Register the app
4. Copy the configuration values

## 3. Create Environment Variables

Create a `.env.local` file in the project root with these values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project_id-default-rtdb.firebaseio.com
```

## 4. Restart Development Server

After creating the `.env.local` file, restart the development server:

```bash
npm run dev
```

## 5. Test Real-time Synchronization

1. Open the app in two different browser windows
2. Create a session as presenter in one window
3. Join the same session as participant in another window
4. Make brand quadrant assignments as participant
5. Watch the presenter dashboard update in real-time
