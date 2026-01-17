# Automated Least Squares Solution Finder Calculator

A web-based calculator that computes the **least squares solution** of overdetermined systems of linear equations using concepts from **Linear Algebra and Matrix Theory**.

## 🎯 Overview

This application applies the **Normal Equation**:

```
AᵀA x̂ = Aᵀb
```

to determine the best-fit linear model for a given set of data points. All matrix operations—including transpose, matrix multiplication, and matrix inversion—are implemented using JavaScript.

## ✨ Features

- ⚡ **Real-time automatic calculation** as you input data
- 📊 **Interactive 3D visualization** using Three.js
- 📝 **Step-by-step matrix computations** with detailed explanations
- 🔢 **Dual display formats**: Decimal and Fraction modes
- 🎯 **Prediction capability** for new X values
- 📈 **Quality metrics**: R² coefficient and sum of squared errors
- 🎨 **Warm, cozy UI design** with optimized color scheme

## 🛠️ Technologies Used

- **HTML5** - Structure and markup
- **CSS3** - Styling with custom warm color theme
- **JavaScript (ES6+)** - Core calculations and interactivity
- **Three.js (r128)** - 3D data visualization and rendering
- **Git** - Version control

## 📐 Mathematical Concepts Applied

- Systems of linear equations
- Matrix transpose
- Matrix multiplication
- Matrix inversion (2×2)
- Least squares approximation
- Normal Equation method
- Coefficient of determination (R²)
- Sum of squared errors (SSE)

## 🚀 Live Demo

The project is deployed and accessible online:
   
    👉 https://least-squares-calculator.vercel.app/

## 📦 Project Structure

```
Least-Squares-Solution-Finder-Calculator/
├── index.html             # Main HTML file
├── G.png                  # Project logo
├── READ.md                # Details of the project
├── logic/                 
│   ├── calculation.js     # Matrix operations and computations
│   ├── main.js            # Core application logic
│   ├── utils.js           # Utility and formatting functions
│   └── visualization.js   # Three.js 3D rendering
└── styles/
    ├── base.css           # Base styles and global settings
    ├── components.css     # Component-specific styles
    ├── expandable.css     # Accordion and expandable sections
    ├── layout.css         # Layout and grid system
    └── math.css           # Mathematical notation display
```

## 💡 Usage Guide

1. **Add Data Points**: Click "Add Data Point" and enter X and Y values
2. **View Results**: The best-fit line equation appears automatically
3. **Explore Solution**: Expand "Step-by-Step Solution" to see detailed matrix calculations
4. **Make Predictions**: Use the prediction tool to estimate Y values for new X inputs
5. **Visualize**: Interact with the 3D graph by rotating (click and drag) and zooming (scroll)
6. **Format Toggle**: Switch between decimal and fraction display modes

## 👥 Development Team

**Group 8 Members:**
- Bague, Mark Lester N.
- Bulala, Kenneth Andrei G.
- Cruz, Joriz Ben K.
- Gatmen, Alliah M.
- Lucero, Dariel Luis D.
- Zacarias, Diana Loreanne M.

## 🎓 Academic Information

- **Course:** Linear Algebra and Matrix Theory
- **Program:** Bachelor of Science in Computer Science, Year 2 - Section 4
- **Batch Year:** 2025-2026
- **University:** Polytechnic University of the Philippines - Sta. Mesa
- **Department:** College of Computer and Information Sciences
- **Instructor:** Prof. Sta. Maria, John Patrick B.
- **Submitted:** January 17, 2026

**Note:** This calculator is designed for educational purposes and demonstrates practical applications of linear algebra concepts in real-world data fitting scenarios.
