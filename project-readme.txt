# WindowEdu PSC Hub

A web application for PSC updates, inspiring thoughts, and access to WindowEdu's resources. The application is built as a Progressive Web App (PWA) for installation on mobile devices.

## Project Overview

- **Project Type:** Web App (PSC Updates & Community Hub)
- **Purpose:** Provide PSC updates, inspiring thoughts, and easy access to WindowEdu's resources
- **Hosting:** Currently set up for GitHub Pages, later planned for Hostinger
- **PWA Compatibility:** Installable on mobile devices

## Features

### Home Page (`index.html`)
- Displays PSC Important Updates & Inspiring Thought of the Day
- Links to WindowEdu's main services & social media
- Mobile-friendly, professional UI
- PWA Support: Users can install the web app on their mobile home screen

### PSC Updates Page (`psc-updates.html`)
- Displays detailed PSC notifications
- Blog-style updates
- Filter updates by category
- Search functionality

### Admin Dashboard (`admin.html`)
- Allows admins to update PSC notifications & inspiring thoughts
- Secure login
- CRUD operations for PSC updates and thoughts
- Activity tracking

## Important Links

- **Telegram Community:** https://t.me/windowedu
- **YouTube Channel:** https://www.youtube.com/c/Windowedu1
- **Instagram:** https://www.instagram.com/windowedu/
- **Download WindowEdu App:** https://app.windowedu.in/
- **MyPSC AI Mentor:** https://windowedu.in/MY-PSC-AI-Mentor

## Technical Details

### File Structure

```
/
├── index.html              # Home page
├── psc-updates.html        # PSC Updates page
├── admin.html              # Admin Dashboard
├── manifest.json           # PWA manifest
├── service-worker.js       # Service worker for PWA
├── css/
│   ├── styles.css          # Main stylesheet
│   └── admin.css           # Admin dashboard styles
├── js/
│   ├── app.js              # Common JavaScript
│   ├── home.js             # Home page JavaScript
│   ├── psc-updates.js      # PSC Updates page JavaScript
│   └── admin.js            # Admin Dashboard JavaScript
└── images/
    ├── logo.png            # WindowEdu logo
    ├── favicon.ico         # Favicon
    ├── icon-192x192.png    # PWA icon (192x192)
    └── icon-512x512.png    # PWA icon (512x512)
```

### Technologies Used

- HTML5, CSS3, JavaScript (Vanilla)
- Progressive Web App (PWA) features
- Responsive design for mobile compatibility
- Font Awesome for icons

### PWA Features

- Installable on mobile devices
- Offline access to previously visited pages
- App-like experience
- Fast loading times

## Setup and Deployment

### Local Development

1. Clone the repository
2. Open the project in your preferred code editor
3. Use a local development server to run the project (e.g., Live Server in VS Code)

### GitHub Pages Deployment

1. Push the code to a GitHub repository
2. Enable GitHub Pages in the repository settings
3. Set the source branch to deploy from (usually `main` or `master`)

### Hostinger Deployment (Future)

1. Sign in to Hostinger
2. Upload all files to the hosting server
3. Configure domain settings

## Admin Access

For development and testing purposes:
- Username: admin
- Password: password

**Note:** For production, change these credentials and implement proper authentication.

## Future Enhancements

- Backend integration for real data storage
- User accounts for personalized experience
- Push notifications for new updates
- Enhanced analytics for admin dashboard

## Credits

- WindowEdu Team
- Font Awesome for icons
