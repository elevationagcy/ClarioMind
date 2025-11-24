# 🎵 Audio-Reactive Meditation Player

## Overview

The meditation player now includes **real-time audio-reactive animations** using the Web Audio API. The visuals dynamically respond to the meditation audio, creating a more immersive and engaging experience.

---

## 🎨 What Reacts to Audio?

### 1. **Breathing Circle** 
- **Scale:** Pulses larger with louder audio
- **Effect:** Creates a "breathing" sensation that matches voice intensity
- **Range:** 0-30% scale increase based on volume

### 2. **Background Gradient**
- **Brightness:** Subtly brightens during speech
- **Saturation:** Colors become more vivid with audio
- **Effect:** Gentle pulsing that follows the narration
- **Range:** 0-15% brightness, 0-20% saturation

### 3. **Secondary Ring**
- **Scale:** Expands with audio levels
- **Opacity:** Becomes more visible with louder sounds
- **Effect:** Creates depth and dimension
- **Range:** 0-40% scale increase, dynamic opacity

### 4. **Floating Particles**
- **Size:** Grows with audio intensity
- **Brightness:** More visible during speech
- **Effect:** Active, responsive environment
- **Range:** 2-6px size, 0-100% opacity boost

---

## 🔊 How It Works

### Web Audio API Implementation

```typescript
// 1. Create AudioContext and Analyser
const audioContext = new AudioContext()
const analyser = audioContext.createAnalyser()
const source = audioContext.createMediaElementSource(audioElement)

// 2. Configure analyser
analyser.fftSize = 256  // Frequency resolution
source.connect(analyser)
analyser.connect(audioContext.destination)

// 3. Get real-time frequency data
const dataArray = new Uint8Array(analyser.frequencyBinCount)
analyser.getByteFrequencyData(dataArray)

// 4. Calculate audio level (0-1 range)
const average = dataArray.reduce((a, b) => a + b) / dataArray.length / 255

// 5. Emphasize low frequencies (calmer for meditation)
const lowFreq = dataArray.slice(0, 10).reduce((a, b) => a + b) / 10 / 255
const combined = (average * 0.3 + lowFreq * 0.7)
```

### Why Low Frequencies?

Meditation audio is mostly **voice and calm background music**, which have:
- **Low to mid frequencies** (100-1000 Hz)
- **Soothing, warm tones**
- **Less harsh high-frequency content**

By emphasizing low frequencies (70% weight), the visualizations respond more to the **narration voice** and less to random high-frequency noise.

---

## 🎯 Animation Tuning

### Current Settings:

```typescript
// Gradient brightness/saturation
filter: `brightness(${1 + audioLevel * 0.15}) saturate(${1 + audioLevel * 0.2})`

// Breathing circle scale
scale: 1 + audioLevel * 0.3  // 0-30% increase

// Secondary ring
scale: 1.3 + audioLevel * 0.4  // 0-40% increase
opacity: audioLevel * 0.3      // 0-30% opacity

// Particles
size: 2 + audioLevel * 4      // 2-6px
opacity: 0.5 + audioLevel * 0.5  // 50-100%
```

### Adjusting Sensitivity:

**Too subtle?** Increase multipliers:
```typescript
scale: 1 + audioLevel * 0.5  // More dramatic (50% increase)
brightness: 1 + audioLevel * 0.3  // Brighter pulses
```

**Too intense?** Decrease multipliers:
```typescript
scale: 1 + audioLevel * 0.15  // Gentler (15% increase)
brightness: 1 + audioLevel * 0.08  // Subtle pulses
```

---

## 🧘 Design Philosophy

### Subtle, Not Distracting

The animations are intentionally **gentle and calming** because:

1. **Meditation should be relaxing** - Not a rave! 🎉❌
2. **Focus on audio** - Visuals enhance, don't compete
3. **Prevent overstimulation** - Subtle movements are more meditative
4. **Match breathing pace** - Slow, natural rhythm

### Frequency Weighting

**70% low frequencies, 30% full spectrum** because:

- **Low frequencies** = Voice, ambient sounds, calm music
- **High frequencies** = Sibilance (S sounds), noise, artifacts
- **Result:** Smoother, more natural-feeling animations

---

## 🎬 Visual Effects Breakdown

### During Narration:
- Circles pulse **gently** with voice
- Background **subtly brightens**
- Particles **slightly grow**
- Overall: **Calm, focused energy**

### During Silence/Music:
- Circles continue **slow breathing cycle**
- Background **maintains base state**
- Particles **float gently**
- Overall: **Peaceful, meditative**

### During Transitions:
- Gradients **smoothly shift** colors (every 30s)
- Animations **blend seamlessly**
- No jarring changes

---

## 🛠️ Technical Details

### Performance Optimization:

1. **RequestAnimationFrame**
   - Runs at 60fps only when playing
   - Automatically pauses when audio stops
   - No unnecessary processing

2. **Smooth Springs**
   - Uses Framer Motion springs for fluid motion
   - Damping: 20, Stiffness: 100
   - Natural, organic feel

3. **Frequency Analysis**
   - FFT size: 256 (good balance of detail/performance)
   - Updates every frame (~16ms)
   - Minimal CPU usage

### Browser Compatibility:

- ✅ **Chrome/Edge:** Full support
- ✅ **Firefox:** Full support
- ✅ **Safari:** Full support (requires user interaction to start AudioContext)
- ✅ **Mobile browsers:** Full support

**Note:** AudioContext requires user interaction (play button) to start - this is already handled!

---

## 🎨 Gradient Themes & Audio

Each gradient theme is designed to complement the audio:

1. **Purple Haze** - Spiritual, introspective (deep meditation)
2. **Pink Sunset** - Warm, nurturing (self-compassion)
3. **Ocean Blue** - Calm, flowing (breath awareness)
4. **Healing Green** - Balanced, grounded (stress release)
5. **Golden Sunset** - Hopeful, uplifting (positive visualization)
6. **Deep Ocean** - Profound, mysterious (deep relaxation)
7. **Soft Pastel** - Gentle, soothing (sleep meditation)
8. **Warm Embrace** - Comforting, safe (anxiety relief)

The audio-reactive brightness/saturation works **differently** with each gradient:

- **Darker gradients** (Purple, Deep Ocean) → More visible pulse
- **Lighter gradients** (Pastel) → Subtle, gentle pulse

---

## 🧪 Testing Audio-Reactivity

### Test with Different Audio:

1. **Quiet narration** → Gentle, minimal movement
2. **Loud narration** → More pronounced pulsing
3. **Background music** → Smooth, flowing motion
4. **Silence** → Base animation state
5. **Mixed content** → Dynamic, responsive

### Expected Behavior:

- ✅ Smooth transitions between audio levels
- ✅ No jarring jumps or stutters
- ✅ Remains calming even during louder sections
- ✅ Particles don't become distracting
- ✅ Gradients don't flicker

---

## 🎛️ Customization Options

### For Different Meditation Types:

**Active Meditation** (movement, energetic):
```typescript
scale: 1 + audioLevel * 0.6  // More dramatic
particles: 30  // More particles
speed: faster gradient transitions
```

**Deep Relaxation** (sleep, calm):
```typescript
scale: 1 + audioLevel * 0.15  // Very subtle
particles: 10  // Fewer particles
speed: slower gradient transitions
```

**Breathing Exercises** (rhythmic):
```typescript
// Sync to breathing rate (e.g., 4-7-8 breath)
scale: matches inhale/exhale timing
particles: pulse with breath cycles
```

---

## 🐛 Troubleshooting

### Animations not responding to audio:

**Check:**
1. Is audio actually playing?
2. Is AudioContext created? (Check console)
3. Is analyser connected properly?
4. Try refreshing the page

**Common fix:**
```typescript
// Resume AudioContext (some browsers auto-suspend)
if (audioContext.state === 'suspended') {
  await audioContext.resume()
}
```

### Animations too choppy:

**Reduce complexity:**
```typescript
analyser.fftSize = 128  // Lower resolution (faster)
particles: 10  // Fewer particles
```

### Audio sounds distorted:

**Check connection:**
```typescript
// Ensure proper audio routing
source.connect(analyser)
analyser.connect(audioContext.destination)  // Must connect to output!
```

---

## 📊 Audio Level Visualization

In **development mode**, you'll see a debug display:

```
Audio: 45%  // Current audio level (0-100%)
```

This helps you:
- Verify audio analysis is working
- Tune sensitivity parameters
- Debug issues

Remove by checking:
```typescript
{process.env.NODE_ENV === 'development' && (
  <div>Audio: {audioLevel}</div>
)}
```

---

## 🌟 Future Enhancements

Possible additions:

- [ ] **Beat detection** - Pulse on rhythmic elements
- [ ] **Voice detection** - Different animations for speech vs music
- [ ] **Frequency visualization** - Show different frequency bands
- [ ] **Custom sensitivity** - Let users adjust animation intensity
- [ ] **Preset themes** - Different visual styles per meditation type
- [ ] **3D visualizations** - WebGL-based audio reactivity
- [ ] **Biofeedback** - Integrate heart rate monitors (future)

---

## 🎓 Learning Resources

### Web Audio API:
- [MDN Web Audio API](https://developer.mozilla.org/en-US/Web_Audio_API)
- [Web Audio API Examples](https://webaudioapi.com/samples/)

### Audio Visualization:
- [Audio Visualization Tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API)
- [Creative Audio Visualizers](https://www.freecodecamp.org/news/audio-visualizer-web-audio-api-html5-canvas/)

### Framer Motion Springs:
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Spring Animations](https://www.framer.com/motion/transition/#spring)

---

## ✅ Quality Checklist

Before deploying:

- [ ] Audio analysis is smooth and responsive
- [ ] Animations don't distract from meditation
- [ ] Performance is good on mobile devices
- [ ] No audio distortion or quality loss
- [ ] Gradients transition smoothly
- [ ] Particles move naturally
- [ ] Works across all browsers
- [ ] AudioContext resumes properly on all devices

---

**Your meditation player now breathes with the audio!** 🎵✨

The visualizations create an **immersive, dynamic experience** while remaining **calm and meditative**. Users will feel more connected to the practice as the environment responds to the narration in real-time.

Perfect for creating that **Calm/Headspace premium feel**! 🧘‍♀️💫

