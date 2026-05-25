# 📊 Evaluation Rubric & Submission Guidelines

This document outlines how we'll evaluate your MusicRewards technical assessment and what we're looking for.

## 🎯 Overall Assessment Scoring

**Total Points: 100**

### 1. Architecture (40 points)
### 2. UI/UX Implementation (30 points)  
### 3. React Native Proficiency (20 points)
### 4. Code Quality (10 points)

---

## 🏗️ 1. Architecture (40 points)

### Zustand State Management (15 points)
- **Excellent (13-15 points):**
  - ✅ Proper domain separation (MusicStore, UserStore)
  - ✅ AsyncStorage persistence correctly implemented
  - ✅ Efficient selectors used throughout
  - ✅ Clean store structure with proper typing
  - ✅ Store actions handle edge cases

- **Good (10-12 points):**
  - ✅ Basic Zustand setup working
  - ✅ State persistence implemented
  - ✅ Most selectors used correctly
  - ⚠️ Minor architectural issues

- **Needs Work (0-9 points):**
  - ❌ Basic state management issues
  - ❌ Poor separation of concerns
  - ❌ Persistence not working

### Custom Hooks Architecture (15 points)
- **Excellent (13-15 points):**
  - ✅ Clean `useMusicPlayer` hook with TrackPlayer integration
  - ✅ Proper `usePointsCounter` implementation
  - ✅ Hooks orchestrate store actions cleanly
  - ✅ Error handling and loading states
  - ✅ Proper cleanup and memory management

- **Good (10-12 points):**
  - ✅ Most hooks implemented correctly
  - ✅ Basic TrackPlayer integration working
  - ⚠️ Minor issues with error handling

- **Needs Work (0-9 points):**
  - ❌ Hooks not properly separating concerns
  - ❌ Audio integration broken
  - ❌ Memory leaks present

### Component Architecture (10 points)
- **Excellent (9-10 points):**
  - ✅ Clean component composition
  - ✅ Proper prop interfaces
  - ✅ Reusable components
  - ✅ Good separation of UI and business logic

- **Good (7-8 points):**
  - ✅ Most components well-structured
  - ⚠️ Minor composition issues

- **Needs Work (0-6 points):**
  - ❌ Poor component structure
  - ❌ Logic mixed with UI components

---

## 🎨 2. UI/UX Implementation (30 points)

### Glass Design System (12 points)
- **Excellent (11-12 points):**
  - ✅ Proper BlurView implementation
  - ✅ Gradient borders and effects
  - ✅ Consistent design tokens
  - ✅ Belong color scheme used
  - ✅ Responsive and polished look

- **Good (8-10 points):**
  - ✅ Basic glass effects working
  - ✅ Most design consistent
  - ⚠️ Minor visual issues

- **Needs Work (0-7 points):**
  - ❌ No glass effects or broken implementation
  - ❌ Inconsistent design

### Navigation & Modals (8 points)
- **Excellent (7-8 points):**
  - ✅ Smooth modal presentations
  - ✅ Proper Expo Router setup
  - ✅ Intuitive navigation flow
  - ✅ Correct tab/modal structure

- **Good (5-6 points):**
  - ✅ Navigation mostly working
  - ⚠️ Minor UX issues

- **Needs Work (0-4 points):**
  - ❌ Navigation broken or confusing

### Audio Player UI (10 points)
- **Excellent (9-10 points):**
  - ✅ Professional player interface
  - ✅ Progress bar with seek functionality
  - ✅ Play/pause controls responsive
  - ✅ Points counter visually appealing
  - ✅ Loading states handled

- **Good (7-8 points):**
  - ✅ Basic player working
  - ✅ Most controls functional
  - ⚠️ Minor UI issues

- **Needs Work (0-6 points):**
  - ❌ Player interface poor or broken
  - ❌ Controls not working

---

## 📱 3. React Native Proficiency (20 points)

### Audio Implementation (10 points)
- **Excellent (9-10 points):**
  - ✅ react-native-track-player properly integrated
  - ✅ Background playback consideration
  - ✅ Audio interruption handling
  - ✅ Proper TrackPlayer lifecycle management
  - ✅ Remote URL loading working

- **Good (7-8 points):**
  - ✅ Basic audio playback working
  - ✅ TrackPlayer mostly integrated
  - ⚠️ Minor audio issues

- **Needs Work (0-6 points):**
  - ❌ Audio not working
  - ❌ Poor TrackPlayer usage

### Platform Considerations (5 points)
- **Excellent (5 points):**
  - ✅ Works on both iOS and Android
  - ✅ Proper platform-specific handling
  - ✅ Performance optimizations

- **Good (3-4 points):**
  - ✅ Works on at least one platform
  - ⚠️ Minor platform issues

- **Needs Work (0-2 points):**
  - ❌ Platform-specific bugs
  - ❌ Poor performance

### Persistence & AsyncStorage (5 points)
- **Excellent (5 points):**
  - ✅ State properly persisted
  - ✅ App recovers after restart
  - ✅ Efficient storage usage

- **Good (3-4 points):**
  - ✅ Basic persistence working
  - ⚠️ Minor storage issues

- **Needs Work (0-2 points):**
  - ❌ Persistence broken
  - ❌ Data loss issues

---

## 🧹 4. Code Quality (10 points)

### TypeScript Usage (4 points)
- **Excellent (4 points):**
  - ✅ Proper interfaces throughout
  - ✅ No `any` types (except where noted)
  - ✅ Good type safety

- **Good (2-3 points):**
  - ✅ Most typing correct
  - ⚠️ Some `any` usage

- **Needs Work (0-1 points):**
  - ❌ Poor typing or excessive `any`

### Error Handling (3 points)
- **Excellent (3 points):**
  - ✅ Proper error boundaries
  - ✅ Network error handling
  - ✅ Audio failure recovery

- **Good (2 points):**
  - ✅ Basic error handling
  - ⚠️ Some edge cases missed

- **Needs Work (0-1 points):**
  - ❌ Poor error handling
  - ❌ App crashes easily

### Code Organization (3 points)
- **Excellent (3 points):**
  - ✅ Clean file structure
  - ✅ Good naming conventions
  - ✅ Proper imports and exports

- **Good (2 points):**
  - ✅ Mostly well-organized
  - ⚠️ Minor structure issues

- **Needs Work (0-1 points):**
  - ❌ Poor organization
  - ❌ Messy code structure

---

## 📤 Submission Requirements

### Required Deliverables:
1. **GitHub Repository** (public or private with access)
2. **README.md** with:
   - Setup instructions
   - How to run the app
   - Brief architecture explanation
   - Any known issues or limitations
3. **Demo Video** (3-4 minutes) showing:
   - App installation and startup
   - Navigation through all screens
   - Audio playback with points earning
   - State persistence (close/reopen app)
   - Any bonus features

### Repository Structure:
```
MusicRewards/
├── README.md                 # Setup and run instructions
├── ARCHITECTURE.md           # Optional: Design decisions explanation
├── src/                      # Your source code
├── package.json              # Dependencies
└── demo-video.mov            # Demo video (or link)
```

### Git Best Practices:
- ✅ Clean commit messages
- ✅ Logical commit progression
- ✅ No sensitive information committed
- ✅ .gitignore properly configured

---

## 🎥 Demo Video Guidelines

**What to show (3-4 minutes total):**

1. **Setup Demo (30 seconds):**
   - Show app launching successfully
   - Brief overview of screens

2. **Core Features (2 minutes):**
   - Navigate through challenge list
   - Play a track and show points counting
   - Demonstrate progress tracking
   - Show player controls working

3. **Technical Features (1 minute):**
   - Close and reopen app (persistence)
   - Switch between tracks
   - Show profile with earned points

4. **Bonus Features (30 seconds):**
   - Any extra features you implemented

**Recording Tips:**
- Record on device if possible (better than simulator)
- Ensure audio is working in recording
- Use landscape mode for better visibility
- Add brief narration explaining what you're showing

---

## ❓ Common Questions

**Q: What if I can't complete all features in 5 hours?**
A: Focus on quality over quantity. A well-implemented subset is better than a broken complete app.

**Q: Can I use additional libraries?**
A: Stick to the specified dependencies unless you have a good reason and document it.

**Q: What about testing?**
A: Not required for this assessment, but feel free to add tests if time permits.

**Q: iOS vs Android - which should I prioritize?**
A: Both if possible, but iOS simulator is usually easier to set up and record.

---

## 🏆 What Makes a Great Submission

**Technical Excellence:**
- Clean, well-architected code
- Proper error handling
- Smooth user experience
- Working audio playback

**Communication:**
- Clear documentation
- Good commit messages
- Thoughtful architectural decisions
- Professional presentation

**Attention to Detail:**
- Pixel-perfect UI implementation
- Edge case handling
- Performance considerations
- Accessibility awareness

**Bonus Points:**
- Creative problem-solving
- Additional features that enhance UX
- Performance optimizations
- Code comments explaining complex logic

---

Ready to submit? Email your repository link and demo video to **careers@getbelong.app** with the subject: "React Native Assessment - [Your Name]"