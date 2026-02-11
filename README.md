# Hangboard Timer - Web App

A mobile-first Progressive Web App (PWA) for timing hangboard training sessions. Works on any device with a web browser and can be installed to your home screen like a native app!

## 🎯 Features

### ✅ Pre-built Workout Protocols
- **Repeaters**: 7s hang, 3s rest, 6 reps × 3 sets
- **Max Hangs**: 10s hang, 5 sets
- **Intermediate Repeaters**: 10s hang, 5s rest, 5 reps × 3 sets
- **Endurance**: 15s hang, 15s rest, 8 reps × 2 sets

### ✅ Custom Workout Builder
- Create unlimited custom protocols
- Adjust all parameters (hang time, rest time, reps, sets)
- Edit and delete custom workouts
- See total duration before starting

### ✅ Full-Featured Timer
- Large, easy-to-read countdown display
- Color-coded phases:
  - 🔵 Blue = Get Ready (5 seconds)
  - 🔴 Red = HANG!
  - 🟢 Green = Rest
  - 🟣 Purple = Complete!
- Audio beeps on final 3 seconds
- Pause/Resume functionality
- Real-time set and rep tracking
- Total elapsed time display

### ✅ Progress Tracking
- Complete workout history
- Track completion status
- View workout duration
- Sort by date
- Delete old entries

### ✅ Mobile Optimized
- Works perfectly on phones and tablets
- Install to home screen (PWA)
- Offline capable (once loaded)
- Landscape and portrait support
- Touch-friendly controls

## 🚀 Getting Started

### Option 1: Use Locally (Easiest)

1. **Download the files** - Save all the files to a folder on your computer
2. **Open in browser** - Simply double-click `index.html` to open it in your web browser
3. **Start training!** - No server or installation needed

### Option 2: Host Online

#### Using GitHub Pages (Free)

1. **Create a GitHub account** at github.com (if you don't have one)
2. **Create a new repository**:
   - Click the "+" icon → "New repository"
   - Name it `hangboard-timer`
   - Make it public
   - Click "Create repository"

3. **Upload the files**:
   - Click "uploading an existing file"
   - Drag all the files (index.html, styles.css, app.js, manifest.json)
   - Click "Commit changes"

4. **Enable GitHub Pages**:
   - Go to Settings → Pages
   - Under "Source", select "main" branch
   - Click "Save"
   - Your site will be live at: `https://yourusername.github.io/hangboard-timer`

#### Using Netlify (Free, Even Easier)

1. **Go to** [netlify.com](https://www.netlify.com/)
2. **Sign up** for a free account
3. **Drag and drop** your project folder into the upload area
4. Your app is live! You'll get a URL like `random-name-123.netlify.app`
5. You can customize the URL in settings

#### Using Your Own Server

Upload all files to your web server's public directory (usually `public_html` or `www`).

## 📱 Install as Mobile App

### On iPhone/iPad:
1. Open the app in Safari
2. Tap the Share button (square with arrow)
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add"
5. The app icon will appear on your home screen!

### On Android:
1. Open the app in Chrome
2. Tap the menu (three dots)
3. Tap "Add to Home Screen" or "Install App"
4. Tap "Add" or "Install"
5. The app icon will appear on your home screen!

## 🎮 How to Use

### Starting a Workout

1. **Select a workout** from the Timer tab
   - Choose from pre-built protocols or your custom workouts
   - Tap any workout card to open the timer

2. **Get Ready**
   - The timer shows a 5-second countdown
   - Position yourself at the hangboard
   - Listen for the beep!

3. **Follow the Timer**
   - Blue background = Get ready
   - Red background = HANG! 🧗‍♂️
   - Green background = Rest
   - The app beeps on the last 3 seconds of each interval

4. **Complete the Workout**
   - The timer automatically tracks sets and reps
   - Purple background when finished
   - Tap "Done" to save to history

### Creating Custom Workouts

1. Go to the **Custom** tab
2. Tap the **+** button
3. Fill in your workout details:
   - **Name**: Give it a descriptive name
   - **Hang Time**: How long to hang (1-60 seconds)
   - **Rest Time**: Rest between hangs (0-60 seconds)
   - **Reps per Set**: Number of hangs per set (1-20)
   - **Number of Sets**: How many sets (1-10)
   - **Rest Between Sets**: Recovery time (30-600 seconds)
4. See the total duration update automatically
5. Tap **Save**

### Editing Custom Workouts

1. Go to the **Custom** tab
2. Tap the pencil icon on any custom workout
3. Make your changes
4. Tap **Save**

### Viewing History

1. Go to the **History** tab
2. See all your completed workouts
3. Green badge = completed full workout
4. Orange badge = stopped early
5. Swipe or tap delete button to remove entries

## 🏋️ Training Tips

### For Beginners
- Start with the **Repeaters** protocol at bodyweight
- Focus on proper form over adding weight
- Rest 48-72 hours between hangboard sessions
- Warm up thoroughly before training

### Progression
1. Master bodyweight before adding weight
2. Add 2.5-5 lbs when you can complete all sets comfortably
3. Track your progress in the History tab
4. Adjust protocols as you get stronger

### Common Protocols Explained

**Repeaters** - Best for endurance
- Short hangs with brief rest
- Builds finger stamina
- Great for beginners

**Max Hangs** - Best for strength
- Longer hangs at maximum weight
- Full rest between attempts
- For intermediate/advanced climbers

**Endurance** - Best for stamina
- Moderate hang with equal rest
- Higher volume
- Trains quick recovery

## 🔧 Technical Details

### Browser Compatibility
- **Chrome/Edge**: Full support
- **Safari**: Full support (iOS 11.3+)
- **Firefox**: Full support
- **Opera**: Full support

### Offline Support
Once loaded, the app works offline! Your data is saved locally in your browser.

### Data Storage
- All custom workouts and history are stored in your browser's local storage
- Data persists between sessions
- Clearing browser data will delete your history (export/backup coming soon!)

### Screen Wake Lock
The timer keeps your screen on during workouts (on supported browsers).

## 🎨 Customization

Want to customize the app? Here's what you can modify:

### Colors (in `styles.css`)
```css
:root {
    --primary: #4F46E5;      /* Main brand color */
    --phase-prepare: #3B82F6; /* Blue - Get ready */
    --phase-hang: #EF4444;    /* Red - Hang */
    --phase-rest: #10B981;    /* Green - Rest */
    --phase-finished: #8B5CF6; /* Purple - Complete */
}
```

### Pre-built Workouts (in `app.js`)
Edit the `PREBUILT_WORKOUTS` array to add/modify protocols.

### Audio Beeps
Modify the `playBeep()` and `playFinishSound()` functions to change pitch or duration.

## 🐛 Troubleshooting

**No sound?**
- Check your device volume
- Make sure silent mode is off
- Some browsers require user interaction before playing sounds - tap anywhere on the page first

**App not installing to home screen?**
- Make sure you're using Safari (iOS) or Chrome (Android)
- The option may be in the share menu or browser menu

**Timer stops when screen locks?**
- Keep the app open and your screen on during workouts
- Some devices have aggressive battery optimization

**Data disappeared?**
- Don't clear browser data/cache
- Each browser stores data separately (Chrome data won't appear in Safari)

## 📁 File Structure

```
hangboard-timer/
├── index.html          # Main HTML structure
├── styles.css          # All styling and layout
├── app.js             # Application logic
├── manifest.json      # PWA configuration
└── README.md          # This file
```

## 🎯 Future Enhancements

Ideas for future versions:
- [ ] Export/import workout history
- [ ] Charts and progress graphs
- [ ] Weight/load tracking per session
- [ ] Rest day reminders
- [ ] Custom audio sounds
- [ ] Voice announcements
- [ ] Workout templates library
- [ ] Social sharing

## 📄 License

This is a personal project created for learning and climbing training. Feel free to use, modify, and share!

## 🤝 Contributing

Found a bug or have a feature idea? Feel free to:
1. Modify the code yourself
2. Share your improvements with other climbers
3. Create your own version!

---

**Happy Training! 🧗‍♂️💪**

Stay strong, climb safe, and remember to warm up!
