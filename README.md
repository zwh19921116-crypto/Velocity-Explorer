# Velocity Explorer 🎓

An interactive web-based physics education tool designed to help students understand velocity and projectile motion through visualization and hands-on experimentation.

## Features

### 🎯 Interactive Controls
- **Velocity Slider & Input**: Adjust initial velocity (0-50 m/s)
- **Launch Angle**: Change angle of projection (0-90°)
- **Gravity Selection**: Choose between Earth, Moon, Mars, or custom gravity values
- **Initial Height**: Set starting height above ground (0-100 m)
- **Real-time Updates**: All calculations update instantly as you adjust parameters

### 📊 Visual Trajectory
- Animated projectile path with grid background
- Launch angle indicator
- Maximum height marker (green dot)
- Impact point marker (red dot)
- Velocity vector visualization
- Professional canvas-based rendering

### 📈 Comprehensive Results
The app calculates and displays:
- **Horizontal Velocity Component** (vx = v₀ × cos(θ))
- **Vertical Velocity Component** (vy = v₀ × sin(θ))
- **Maximum Height** (h_max = h₀ + vy²/2g)
- **Range/Distance** (R = (v₀² × sin(2θ))/g)
- **Time of Flight** (t = (vy + √(vy² + 2gh₀))/g)
- **Impact Velocity** (speed at which projectile hits ground)

### 🌍 Planetary Presets
Quickly switch between different gravitational environments:
- **Earth**: 9.8 m/s²
- **Moon**: 1.62 m/s²
- **Mars**: 3.7 m/s²

### 📚 Educational Content
Built-in concept cards explaining:
- What is Velocity?
- Projectile Motion fundamentals
- Horizontal Velocity Component
- Vertical Velocity Component
- Launch Angle Effects
- Gravity's Role

## Physics Concepts Covered

### Velocity Components
The initial velocity is decomposed into:
- **Horizontal (vx)**: Remains constant throughout flight (no air resistance)
- **Vertical (vy)**: Changes due to gravity acceleration

### Projectile Motion
Objects follow a parabolic path when launched at an angle. The path can be calculated using kinematic equations.

### Key Formulas
```
vx = v₀ × cos(θ)
vy = v₀ × sin(θ)
y(t) = h₀ + vy×t - (1/2)×g×t²
x(t) = vx × t
```

### Maximum Height
Occurs when vertical velocity becomes zero:
```
t_max = vy / g
h_max = h₀ + vy² / (2g)
```

### Time of Flight
Total time until projectile hits ground (y = 0):
```
0 = -½gt² + vy×t + h₀
t = (vy + √(vy² + 2gh₀)) / g
```

### Range
Horizontal distance traveled:
```
R = vx × t_flight
```

## How to Use

1. **Adjust Parameters**
   - Use sliders or type values directly in input fields
   - Values update in real-time

2. **Choose Environment**
   - Click preset buttons (Earth, Moon, Mars) to change gravity instantly
   - Or set custom gravity values

3. **Observe Trajectory**
   - Watch how the parabolic path changes with each parameter adjustment
   - Markers show maximum height and impact point

4. **Analyze Results**
   - Check calculated values in the results panel
   - Compare different scenarios

5. **Learn**
   - Read educational cards to understand physics concepts
   - Experiment with different angle values (45° usually gives maximum range on level ground)

## Student Experiments

### Experiment 1: Find Maximum Range
Adjust the angle while keeping velocity constant. Does 45° give the maximum range?

### Experiment 2: Compare Planets
Use the same launch parameters on Earth, Moon, and Mars. How does gravity affect the trajectory?

### Experiment 3: Optimal Angle
For different initial heights, is 45° still the optimal angle for maximum range?

### Experiment 4: Impact Velocity
Launch from different heights with same angle and velocity. How does height affect impact speed?

### Experiment 5: Maximum Height Analysis
For a fixed velocity, how does the launch angle affect maximum height reached?

## Technical Details

### Technologies Used
- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **Canvas API**: Smooth trajectory visualization
- **Vanilla JavaScript**: All physics calculations and interactivity

### Browser Compatibility
- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Files
- `index.html` - Main HTML structure
- `style.css` - Responsive styling
- `script.js` - Physics calculations and canvas rendering

## Installation & Running

### Method 1: Direct File Opening
1. Download or clone the repository
2. Open `index.html` in your web browser
3. Start exploring!

### Method 2: Local Server
For better performance, run with a local server:
```bash
# Using Python 3
python -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js (with http-server)
npx http-server
```
Then navigate to `http://localhost:8000` in your browser.

## Educational Applications

### High School Physics
- Ideal for AP Physics or standard physics curriculum
- Helps visualize abstract concepts
- Enables quick experimentation with different scenarios

### University Level
- Useful for introductory physics courses
- Can be extended for more complex scenarios (air resistance, multiple launches, etc.)
- Good starting point for physics simulations

### Self-Learning
- Interactive way to understand projectile motion
- Immediate visual feedback
- No complex setup required

## Future Enhancements

Potential features for future versions:
- [ ] Air resistance calculations
- [ ] Drag coefficient adjustments
- [ ] Multiple projectile comparison
- [ ] Trajectory recording and replay
- [ ] Export trajectory data (CSV)
- [ ] Dark mode toggle
- [ ] Collision detection with obstacles
- [ ] Real-world examples (sports scenarios, etc.)
- [ ] Sound effects
- [ ] Mobile touch optimization

## Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Improve educational content
- Optimize performance
- Enhance UI/UX

## License

This project is open source and available for educational use.

## Author

**Physics Education Team**
- GitHub: [@zwh19921116-crypto](https://github.com/zwh19921116-crypto)

## Acknowledgments

Built with physics principles from classical mechanics and inspired by educational tools that help students visualize complex concepts.

---

**Happy Learning!** 🚀

Use this tool to explore the fascinating world of velocity and projectile motion. Experiment, learn, and have fun with physics!
