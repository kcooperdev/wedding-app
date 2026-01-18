# Wedding App

A modern wedding app with guest check-ins, photo sharing, livestreaming, and more.

## Features

- **Guest Onboarding**: Wedding code authentication
- **Photo Gallery**: Upload and view wedding photos with lightbox
- **Live Streaming**: Admin-controlled guest livestreaming via Mux
- **Check-In System**: Ceremony and dinner check-ins
- **Guestbook**: Guest messages and well-wishes
- **Information Section**: Schedule, directions (Google Maps & Waze), menu links, and wedding details
- **Admin Dashboard**: Manage guests, photos, broadcasts, and livestream settings

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project (for production)
- Mux account (optional, for livestreaming)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd wedding-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Fill in your environment variables in `.env.local`:
   - Firebase configuration (required)
   - Mux credentials (optional, for livestreaming)

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

### Required
- `NEXT_PUBLIC_FIREBASE_API_KEY` - Firebase API key
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` - Firebase auth domain
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` - Firebase project ID
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` - Firebase storage bucket
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` - Firebase messaging sender ID
- `NEXT_PUBLIC_FIREBASE_APP_ID` - Firebase app ID

### Optional (for livestreaming)
- `MUX_TOKEN_ID` - Mux API token ID
- `MUX_TOKEN_SECRET` - Mux API token secret

## Deployment on Vercel

### Quick Deploy

1. Push your code to GitHub/GitLab/Bitbucket

2. Import your repository to Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository

3. Configure Environment Variables:
   - In Vercel project settings, go to "Environment Variables"
   - Add all variables from `.env.example`
   - Make sure to add both:
     - **Production** environment variables
     - **Preview** environment variables (optional, for preview deployments)

4. Deploy:
   - Vercel will automatically detect Next.js and deploy
   - The build will run automatically on push to main branch

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# For production
vercel --prod
```

### Environment Variables in Vercel

Add these in Vercel Dashboard → Settings → Environment Variables:

**Firebase (Required):**
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

**Mux (Optional - for livestreaming):**
- `MUX_TOKEN_ID`
- `MUX_TOKEN_SECRET`

## Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)

2. Enable Firestore Database:
   - Go to Firestore Database
   - Create database in production mode (or test mode for development)
   - Update `firestore.rules` as needed

3. Enable Storage:
   - Go to Storage
   - Get started
   - Configure rules as needed

4. Get your Firebase config:
   - Go to Project Settings → General
   - Scroll to "Your apps" → Web app
   - Copy the config values to your `.env.local`

## Mux Setup (Optional)

1. Create a Mux account at [mux.com](https://mux.com)

2. Get your API credentials:
   - Go to Settings → API Access Tokens
   - Create a new token
   - Copy Token ID and Secret to environment variables

3. The app will work without Mux credentials (mock mode), but livestreaming won't function.

## Project Structure

```
wedding-app/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── admin/             # Admin pages
│   └── page.js            # Home page
├── components/            # React components
│   ├── admin/            # Admin components
│   ├── guest/            # Guest components
│   └── ui/               # UI components
├── lib/                   # Utilities and services
│   ├── firebase.js       # Firebase configuration
│   ├── mux.js            # Mux integration
│   ├── services.js       # Firestore services
│   └── wedding-service.js # Wedding-specific services
└── public/               # Static assets
```

## Features in Detail

### Guest Features
- Enter wedding code to join
- Check in for ceremony and dinner
- Upload and view photos
- View wedding information (schedule, directions, menu)
- Sign guestbook
- Go live (when enabled by admin)
- Watch livestreams

### Admin Features
- View guest check-ins
- Manage photos (delete)
- Send broadcast messages
- Toggle live mode on/off
- Monitor active streams
- Force end streams

## Troubleshooting

### Build Errors
- Ensure all environment variables are set
- Check Node.js version (18+ required)
- Run `npm install` to ensure dependencies are installed

### Firebase Connection Issues
- Verify environment variables are correct
- Check Firestore rules allow read/write
- Ensure Storage is enabled

### Livestreaming Not Working
- Verify Mux credentials are set
- Check Mux dashboard for API usage
- App works in mock mode without Mux (no actual streaming)

## Support

For issues or questions, please check the console logs for detailed error messages.

## License

Private project - All rights reserved
# wedding-app
# wedding-app
