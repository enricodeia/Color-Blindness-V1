// DOM Elements
const imageUpload = document.getElementById('image-upload');
const imageUrl = document.getElementById('image-url');
const urlSubmit = document.getElementById('url-submit');
const urlAlert = document.querySelector('.url-alert');
const simulationButtons = document.querySelectorAll('.simulation-btn');
const sideBySideBtn = document.getElementById('side-by-side-btn');
const gridBtn = document.getElementById('grid-btn');
const imageContainer = document.getElementById('image-container');
const gridContainer = document.getElementById('grid-container');
const noImageMessage = document.getElementById('no-image-message');
const loadingIndicator = document.getElementById('loading-indicator');
const simulationTitle = document.getElementById('simulation-title');
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');
const showAnalysisToggle = document.getElementById('show-analysis');
const highlightIssuesToggle = document.getElementById('highlight-issues');
const simulationScore = document.getElementById('simulation-score');
const simulationScoreBar = document.getElementById('simulation-score-bar');
const highlightCanvas = document.getElementById('highlight-canvas');
const analysisText = document.getElementById('analysis-text');
const analysisPanel = document.querySelectorAll('.analysis-panel');
const resultsSection = document.getElementById('results-section');
const downloadReportBtn = document.getElementById('download-report');
const recommendationsList = document.getElementById('recommendations-list');

// Canvases
const originalCanvas = document.getElementById('original-canvas');
const simulationCanvas = document.getElementById('simulation-canvas');
const gridOriginalCanvas = document.getElementById('grid-original-canvas');
const gridProtanopiaCanvas = document.getElementById('grid-protanopia-canvas');
const gridDeuteranopiaCanvas = document.getElementById('grid-deuteranopia-canvas');
const gridTritanopiaCanvas = document.getElementById('grid-tritanopia-canvas');
const gridAchromatopsiaCanvas = document.getElementById('grid-achromatopsia-canvas');
const gridProtanopiaHighlight = document.getElementById('grid-protanopia-highlight');
const gridDeuteranopiaHighlight = document.getElementById('grid-deuteranopia-highlight');
const gridTritanopiaHighlight = document.getElementById('grid-tritanopia-highlight');
const gridAchromatopsiaHighlight = document.getElementById('grid-achromatopsia-highlight');
const resultsChart = document.getElementById('results-chart');

// Canvas contexts
const originalCtx = originalCanvas.getContext('2d');
const simulationCtx = simulationCanvas.getContext('2d');
const gridOriginalCtx = gridOriginalCanvas.getContext('2d');
const gridProtanopiaCtx = gridProtanopiaCanvas.getContext('2d');
const gridDeuteranopiaCtx = gridDeuteranopiaCanvas.getContext('2d');
const gridTritanopiaCtx = gridTritanopiaCanvas.getContext('2d');
const gridAchromatopsiaCtx = gridAchromatopsiaCanvas.getContext('2d');
const highlightCtx = highlightCanvas.getContext('2d');
const gridProtanopiaHighlightCtx = gridProtanopiaHighlight.getContext('2d');
const gridDeuteranopiaHighlightCtx = gridDeuteranopiaHighlight.getContext('2d');
const gridTritanopiaHighlightCtx = gridTritanopiaHighlight.getContext('2d');
const gridAchromatopsiaHighlightCtx = gridAchromatopsiaHighlight.getContext('2d');

// Current state
let currentImage = null;
let currentSimulationType = 'original';
let isGridView = false;
let accessibilityScores = {
  original: 100,
  protanopia: 0,
  deuteranopia: 0,
  tritanopia: 0,
  achromatopsia: 0
};
let problemAreas = {
  protanopia: [],
  deuteranopia: [],
  tritanopia: [],
  achromatopsia: []
};

// Color blindness matrices
const colorBlindnessMatrices = {
  protanopia: [
    0.567, 0.433, 0.000,
    0.558, 0.442, 0.000,
    0.000, 0.242, 0.758
  ],
  deuteranopia: [
    0.625, 0.375, 0.000,
    0.700, 0.300, 0.000,
    0.000, 0.300, 0.700
  ],
  tritanopia: [
    0.950, 0.050, 0.000,
    0.000, 0.433, 0.567,
    0.000, 0.475, 0.525
  ],
  achromatopsia: [
    0.299, 0.587, 0.114,
    0.299, 0.587, 0.114,
    0.299, 0.587, 0.114
  ]
};

// Event Listeners
imageUpload.addEventListener('change', handleImageUpload);
urlSubmit.addEventListener('click', handleImageUrl);
imageUrl.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleImageUrl();
});

// Analysis toggles
showAnalysisToggle.addEventListener('change', toggleAnalysisDisplay);
highlightIssuesToggle.addEventListener('change', toggleProblemHighlights);
downloadReportBtn.addEventListener('click', generateReport);

simulationButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Update active button
    simulationButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    // Update simulation type
    currentSimulationType = button.dataset.type;
    simulationTitle.textContent = button.textContent;
    
    // Update display
    if (currentImage) {
      if (isGridView) {
        // Grid view is already showing all simulations
      } else {
        applySimulation(currentSimulationType);
      }
    }
  });
});

sideBySideBtn.addEventListener('click', () => {
  if (isGridView) {
    sideBySideBtn.classList.add('active');
    gridBtn.classList.remove('active');
    isGridView = false;
    
    if (currentImage) {
      gridContainer.classList.add('hidden');
      imageContainer.classList.remove('hidden');
      applySimulation(currentSimulationType);
    }
  }
});

gridBtn.addEventListener('click', () => {
  if (!isGridView) {
    gridBtn.classList.add('active');
    sideBySideBtn.classList.remove('active');
    isGridView = true;
    
    if (currentImage) {
      imageContainer.classList.add('hidden');
      gridContainer.classList.remove('hidden');
      generateAllSimulations();
    }
  }
});

/**
 * Handles image upload from file input
 */
function handleImageUpload(event) {
  const file = event.target.files[0];
  if (file && file.type.match('image.*')) {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      loadImage(e.target.result);
    };
    
    reader.readAsDataURL(file);
  }
}

/**
 * Handles image loading from URL
 * Improved with better error handling and validation
 */
function handleImageUrl() {
  const url = imageUrl.value.trim();
  
  if (!url) {
    showUrlError('Please enter an image URL');
    return;
  }
  
  // Basic URL validation
  if (!isValidUrl(url)) {
    showUrlError('Please enter a valid URL');
    return;
  }
  
  // Hide any previous error
  hideUrlError();
  
  // Check if URL points to an image
  checkImageUrl(url)
    .then(isValid => {
      if (isValid) {
        loadImage(url);
      } else {
        showUrlError('URL does not point to a valid image');
      }
    })
    .catch(error => {
      showUrlError('Error loading image. Please check URL or CORS policy');
      showToast('Error loading image. The server might not allow cross-origin requests.', 'error');
      console.error('Image loading error:', error);
    });
}

/**
 * Validates if a string is a properly formatted URL
 */
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

/**
 * Checks if a URL points to a valid image by trying to load it
 */
function checkImageUrl(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    
    // Add a random parameter to bypass cache
    img.src = url + (url.includes('?') ? '&' : '?') + 'nocache=' + Date.now();
  });
}

/**
 * Shows URL error message
 */
function showUrlError(message) {
  urlAlert.textContent = message;
  urlAlert.classList.add('visible');
  imageUrl.classList.add('shake');
  
  // Remove shake animation after it completes
  setTimeout(() => {
    imageUrl.classList.remove('shake');
  }, 600);
}

/**
 * Hides URL error message
 */
function hideUrlError() {
  urlAlert.classList.remove('visible');
}

/**
 * Loads an image from the given source (file or URL)
 * Improved with error handling and proxy support for CORS issues
 */
function loadImage(src) {
  showLoading();
  
  // Create a new image
  const img = new Image();
  img.crossOrigin = 'anonymous'; // Try to load with CORS
  
  img.onload = () => {
    currentImage = img;
    
    // Set canvas dimensions based on image
    setCanvasDimensions(img);
    
    // Display the image
    if (isGridView) {
      generateAllSimulations();
      gridContainer.classList.remove('hidden');
      imageContainer.classList.add('hidden');
    } else {
      drawImageOnCanvas(originalCtx, img);
      applySimulation(currentSimulationType);
      imageContainer.classList.remove('hidden');
      gridContainer.classList.add('hidden');
    }
    
    noImageMessage.classList.add('hidden');
    hideLoading();
    
    // Show success message
    showToast('Image loaded successfully!', 'success');
    
    // Clear URL input if it was loaded from a URL
    if (src.startsWith('http')) {
      imageUrl.value = '';
    }
  };
  
  img.onerror = () => {
    hideLoading();
    
    // If direct loading fails, try using a CORS proxy
    if (src.startsWith('http') && !src.startsWith('https://cors-anywhere')) {
      showToast('Trying to load image through CORS proxy...', 'info');
      
      // Try with a CORS proxy - Note: In a production app, you should use your own proxy
      const corsProxyUrl = 'https://cors-anywhere.herokuapp.com/';
      loadImage(corsProxyUrl + src);
    } else {
      showToast('Failed to load image. Please try a different image.', 'error');
    }
  };
  
  // Add a cache-busting parameter for URLs
  if (src.startsWith('http')) {
    src = src + (src.includes('?') ? '&' : '?') + 'nocache=' + Date.now();
  }
  
  // Set image source
  img.src = src;
}

/**
 * Sets dimensions for all canvases based on the image
 */
function setCanvasDimensions(img) {
  const canvases = [
    originalCanvas, simulationCanvas, highlightCanvas,
    gridOriginalCanvas, gridProtanopiaCanvas, 
    gridDeuteranopiaCanvas, gridTritanopiaCanvas, 
    gridAchromatopsiaCanvas,
    gridProtanopiaHighlight, gridDeuteranopiaHighlight,
    gridTritanopiaHighlight, gridAchromatopsiaHighlight
  ];
  
  canvases.forEach(canvas => {
    canvas.width = img.width;
    canvas.height = img.height;
  });
}

/**
 * Draws the original image on a canvas
 */
function drawImageOnCanvas(ctx, img) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height);
}

/**
 * Applies the selected color blindness simulation
 */
function applySimulation(type) {
  // Draw original image
  drawImageOnCanvas(originalCtx, currentImage);
  
  // If original is selected, just copy the image
  if (type === 'original') {
    drawImageOnCanvas(simulationCtx, currentImage);
    return;
  }
  
  // Get image data from original canvas
  const imageData = originalCtx.getImageData(
    0, 0, originalCanvas.width, originalCanvas.height
  );
  
  // Apply color transformation
  const transformedData = transformColors(imageData, colorBlindnessMatrices[type]);
  
  // Draw transformed image
  simulationCtx.putImageData(transformedData, 0, 0);
  
  // Calculate accessibility score
  if (type !== 'original') {
    calculateAccessibilityScore(type, imageData, transformedData);
    
    // Update score display if analysis is shown
    if (showAnalysisToggle.checked) {
      updateScoreDisplay(type);
    }
    
    // Generate problem highlights if enabled
    if (highlightIssuesToggle.checked) {
      generateProblemHighlights(type, imageData, transformedData);
    }
  }
}

/**
 * Generates all simulations for grid view
 */
function generateAllSimulations() {
  // Draw original image on both original canvases
  drawImageOnCanvas(gridOriginalCtx, currentImage);
  drawImageOnCanvas(originalCtx, currentImage);
  
  // Get image data once
  const imageData = gridOriginalCtx.getImageData(
    0, 0, gridOriginalCanvas.width, gridOriginalCanvas.height
  );
  
  // Apply each transformation
  const protanopiaData = transformColors(imageData, colorBlindnessMatrices.protanopia);
  const deuteranopiaData = transformColors(imageData, colorBlindnessMatrices.deuteranopia);
  const tritanopiaData = transformColors(imageData, colorBlindnessMatrices.tritanopia);
  const achromatopsiaData = transformColors(imageData, colorBlindnessMatrices.achromatopsia);
  
  // Draw each transformed image
  gridProtanopiaCtx.putImageData(protanopiaData, 0, 0);
  gridDeuteranopiaCtx.putImageData(deuteranopiaData, 0, 0);
  gridTritanopiaCtx.putImageData(tritanopiaData, 0, 0);
  gridAchromatopsiaCtx.putImageData(achromatopsiaData, 0, 0);
  
  // Calculate accessibility scores for all types
  calculateAccessibilityScore('protanopia', imageData, protanopiaData);
  calculateAccessibilityScore('deuteranopia', imageData, deuteranopiaData);
  calculateAccessibilityScore('tritanopia', imageData, tritanopiaData);
  calculateAccessibilityScore('achromatopsia', imageData, achromatopsiaData);
  
  // Update all score displays if analysis is shown
  if (showAnalysisToggle.checked) {
    updateAllScores();
  }
  
  // Generate highlights if enabled
  if (highlightIssuesToggle.checked) {
    generateProblemHighlights('protanopia', imageData, protanopiaData, gridProtanopiaHighlightCtx);
    generateProblemHighlights('deuteranopia', imageData, deuteranopiaData, gridDeuteranopiaHighlightCtx);
    generateProblemHighlights('tritanopia', imageData, tritanopiaData, gridTritanopiaHighlightCtx);
    generateProblemHighlights('achromatopsia', imageData, achromatopsiaData, gridAchromatopsiaHighlightCtx);
  }
  
  // Show results section
  resultsSection.classList.remove('hidden');
  
  // Generate recommendations
  generateRecommendations();
  
  // Also update the simulation canvas
  if (currentSimulationType === 'original') {
    drawImageOnCanvas(simulationCtx, currentImage);
  } else {
    const simulationData = transformColors(imageData, colorBlindnessMatrices[currentSimulationType]);
    simulationCtx.putImageData(simulationData, 0, 0);
  }
}

/**
 * Transforms the colors of an image using the provided matrix
 * This is the core algorithm for simulating color blindness
 */
function transformColors(imageData, matrix) {
  const data = imageData.data;
  const result = new ImageData(
    new Uint8ClampedArray(data), 
    imageData.width, 
    imageData.height
  );
  const resultData = result.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Apply color transformation matrix
    resultData[i] = r * matrix[0] + g * matrix[1] + b * matrix[2]; // Red
    resultData[i + 1] = r * matrix[3] + g * matrix[4] + b * matrix[5]; // Green
    resultData[i + 2] = r * matrix[6] + g * matrix[7] + b * matrix[8]; // Blue
    // Alpha channel remains unchanged
  }
  
  return result;
}

/**
 * Shows loading indicator
 */
function showLoading() {
  loadingIndicator.classList.remove('hidden');
}

/**
 * Hides loading indicator
 */
function hideLoading() {
  loadingIndicator.classList.add('hidden');
}

// Add drag and drop support for the upload area
const uploadLabel = document.querySelector('.upload-label');

uploadLabel.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadLabel.classList.add('upload-hover');
});

uploadLabel.addEventListener('dragleave', () => {
  uploadLabel.classList.remove('upload-hover');
});

uploadLabel.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadLabel.classList.remove('upload-hover');
  
  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
    imageUpload.files = e.dataTransfer.files;
    handleImageUpload({ target: { files: e.dataTransfer.files } });
  }
});

// Add pasted image URLs with improved functionality
imageUrl.addEventListener('paste', (e) => {
  // Let the paste happen, then process the value
  setTimeout(() => {
    if (imageUrl.value.trim()) {
      handleImageUrl();
    }
  }, 100);
});

// Theme toggle functionality
themeToggleBtn.addEventListener('click', toggleTheme);

/**
 * Toggles between light and dark themes
 */
function toggleTheme() {
  document.body.classList.toggle('light-theme');
  updateThemeIcons();
}

/**
 * Updates visibility of theme icons based on current theme
 */
function updateThemeIcons() {
  const lightIcon = document.getElementById('light-icon');
  const darkIcon = document.getElementById('dark-icon');
  
  if (document.body.classList.contains('light-theme')) {
    lightIcon.style.display = 'none';
    darkIcon.style.display = 'block';
  } else {
    lightIcon.style.display = 'block';
    darkIcon.style.display = 'none';
  }
}

/**
 * Shows a toast notification
 */
function showToast(message, type = 'info') {
  // Set message and type
  toastMessage.textContent = message;
  toast.className = 'toast';
  toast.classList.add(type);
  
  // Show the toast
  toast.classList.add('show');
  
  // Auto hide after 4 seconds
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

/**
 * Calculates an accessibility score by comparing original and simulated images
 * The score is based on how much color differentiation is lost
 */
function calculateAccessibilityScore(type, originalData, simulatedData) {
  const originalPixels = originalData.data;
  const simulatedPixels = simulatedData.data;
  
  // Store problematic areas
  const problemAreas = [];
  
  // Track color differentiation statistics
  let totalPixels = originalPixels.length / 4;
  let problemPixels = 0;
  let colorLossSum = 0;
  
  // Sample step - check every 4th pixel for performance
  const sampleStep = 4;
  
  // Compare original and simulated pixels
  for (let i = 0; i < originalPixels.length; i += 4 * sampleStep) {
    // Original color
    const r1 = originalPixels[i];
    const g1 = originalPixels[i + 1];
    const b1 = originalPixels[i + 2];
    
    // Simulated color
    const r2 = simulatedPixels[i];
    const g2 = simulatedPixels[i + 1];
    const b2 = simulatedPixels[i + 2];
    
    // Calculate color difference using Delta E formula (simplified version)
    const colorDiff = Math.sqrt(
      Math.pow(r1 - r2, 2) + 
      Math.pow(g1 - g2, 2) + 
      Math.pow(b1 - b2, 2)
    );
    
    // Calculate color "uniqueness" within the original image
    // by comparing to surrounding pixels
    let isUniqueColor = false;
    const pixelIndex = i / 4;
    const x = pixelIndex % originalData.width;
    const y = Math.floor(pixelIndex / originalData.width);
    
    // If color difference is significant and it's a unique color
    if (colorDiff > 30) {
      colorLossSum += colorDiff;
      problemPixels++;
      
      // Add to problem areas if significant color loss
      if (colorDiff > 60) {
        problemAreas.push({
          x: x,
          y: y,
          severity: Math.min(colorDiff / 255, 1)
        });
      }
    }
  }
  
  // Calculate score from 0-100, where 100 is perfect
  // Invert so less color loss = higher score
  const avgColorLoss = problemPixels > 0 ? colorLossSum / problemPixels : 0;
  const percentProblemPixels = (problemPixels / (totalPixels / sampleStep)) * 100;
  
  // Score formula gives more weight to percentage of problem pixels
  const rawScore = 100 - (percentProblemPixels * 0.7 + (avgColorLoss / 255) * 30);
  accessibilityScores[type] = Math.max(0, Math.min(100, Math.round(rawScore)));
  
  // Store problem areas
  window.problemAreas[type] = problemAreas;
  
  return accessibilityScores[type];
}

/**
 * Updates the score display for the current simulation
 */
function updateScoreDisplay(type) {
  if (type === 'original') return;
  
  // Update score value
  simulationScore.textContent = accessibilityScores[type];
  
  // Update score color based on value
  if (accessibilityScores[type] >= 80) {
    simulationScore.style.backgroundColor = 'rgba(76, 175, 80, 0.2)';
    simulationScore.style.color = '#4CAF50';
  } else if (accessibilityScores[type] >= 60) {
    simulationScore.style.backgroundColor = 'rgba(255, 170, 0, 0.2)';
    simulationScore.style.color = '#FFAA00';
  } else {
    simulationScore.style.backgroundColor = 'rgba(244, 67, 54, 0.2)';
    simulationScore.style.color = '#F44336';
  }
  
  // Update score bar
  simulationScoreBar.style.width = `${accessibilityScores[type]}%`;
  
  // Update analysis text
  let analysisMessage = '';
  if (accessibilityScores[type] >= 80) {
    analysisMessage = `This image has good accessibility for people with ${type}. Most content should be distinguishable.`;
  } else if (accessibilityScores[type] >= 60) {
    analysisMessage = `This image may present moderate challenges for people with ${type}. Consider adjusting colors for better contrast.`;
  } else {
    analysisMessage = `This image is likely difficult to interpret for people with ${type}. Consider significant color adjustments or adding text labels.`;
  }
  
  analysisText.textContent = analysisMessage;
}

/**
 * Updates all score displays in grid view
 */
function updateAllScores() {
  // Update score displays in grid view
  document.getElementById('protanopia-score').textContent = accessibilityScores.protanopia;
  document.getElementById('deuteranopia-score').textContent = accessibilityScores.deuteranopia;
  document.getElementById('tritanopia-score').textContent = accessibilityScores.tritanopia;
  document.getElementById('achromatopsia-score').textContent = accessibilityScores.achromatopsia;
  
  // Update score bars
  document.getElementById('protanopia-score-bar').style.width = `${accessibilityScores.protanopia}%`;
  document.getElementById('deuteranopia-score-bar').style.width = `${accessibilityScores.deuteranopia}%`;
  document.getElementById('tritanopia-score-bar').style.width = `${accessibilityScores.tritanopia}%`;
  document.getElementById('achromatopsia-score-bar').style.width = `${accessibilityScores.achromatopsia}%`;
  
  // Update current simulation if not in original view
  if (currentSimulationType !== 'original') {
    updateScoreDisplay(currentSimulationType);
  }
}

/**
 * Generates visual highlights for problem areas
 */
function generateProblemHighlights(type, originalData, simulatedData, targetCtx = null) {
  const ctx = targetCtx || highlightCtx;
  const problems = window.problemAreas[type];
  
  // Clear the canvas
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
  if (!problems || problems.length === 0) return;
  
  // Draw problem areas
  for (const area of problems) {
    const radius = Math.max(3, Math.ceil(area.severity * 8));
    ctx.fillStyle = `rgba(255, 0, 0, ${area.severity * 0.5})`;
    ctx.beginPath();
    ctx.arc(area.x, area.y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

/**
 * Toggles the display of analysis panels
 */
function toggleAnalysisDisplay() {
  const panels = document.querySelectorAll('.analysis-panel');
  panels.forEach(panel => {
    if (showAnalysisToggle.checked) {
      panel.classList.remove('hidden');
    } else {
      panel.classList.add('hidden');
    }
  });
  
  if (showAnalysisToggle.checked && currentImage) {
    updateAllScores();
  }
}

/**
 * Toggles the display of problem highlights
 */
function toggleProblemHighlights() {
  const layers = document.querySelectorAll('.highlight-layer');
  
  layers.forEach(layer => {
    if (highlightIssuesToggle.checked) {
      layer.classList.remove('hidden');
    } else {
      layer.classList.add('hidden');
    }
  });
  
  if (highlightIssuesToggle.checked && currentImage) {
    // Regenerate highlights for current view
    if (!isGridView && currentSimulationType !== 'original') {
      const imageData = originalCtx.getImageData(0, 0, originalCanvas.width, originalCanvas.height);
      const simulatedData = simulationCtx.getImageData(0, 0, simulationCanvas.width, simulationCanvas.height);
      generateProblemHighlights(currentSimulationType, imageData, simulatedData);
    } else if (isGridView) {
      const imageData = gridOriginalCtx.getImageData(0, 0, gridOriginalCanvas.width, gridOriginalCanvas.height);
      
      // Regenerate all highlights for grid view
      const types = ['protanopia', 'deuteranopia', 'tritanopia', 'achromatopsia'];
      const canvases = [gridProtanopiaCanvas, gridDeuteranopiaCanvas, gridTritanopiaCanvas, gridAchromatopsiaCanvas];
      const highlights = [gridProtanopiaHighlightCtx, gridDeuteranopiaHighlightCtx, gridTritanopiaHighlightCtx, gridAchromatopsiaHighlightCtx];
      
      for (let i = 0; i < types.length; i++) {
        const simulatedData = canvases[i].getContext('2d').getImageData(0, 0, canvases[i].width, canvases[i].height);
        generateProblemHighlights(types[i], imageData, simulatedData, highlights[i]);
      }
    }
  }
}

/**
 * Generates recommendations based on the accessibility scores
 */
function generateRecommendations() {
  let html = '<ul>';
  const worstType = getWorstColorBlindnessType();
  
  // General recommendation
  html += '<li>Consider using patterns or textures in addition to colors to convey information.</li>';
  
  // Specific recommendations based on scores
  if (accessibilityScores.protanopia < 70 || accessibilityScores.deuteranopia < 70) {
    html += '<li>Avoid red-green color combinations as they are difficult to distinguish for the most common types of color blindness.</li>';
  }
  
  if (accessibilityScores.tritanopia < 70) {
    html += '<li>Be cautious with blue-yellow combinations, especially for small elements or text.</li>';
  }
  
  if (accessibilityScores.achromatopsia < 70) {
    html += '<li>Ensure sufficient brightness contrast in grayscale for people with complete color blindness.</li>';
  }
  
  // Worst type recommendation
  if (worstType) {
    html += `<li>This image is particularly challenging for people with ${worstType}. Consider using a color blindness simulator to test your designs.</li>`;
  }
  
  // Add text labels recommendation if overall accessibility is poor
  if (getAverageScore() < 65) {
    html += '<li>Add text labels to convey important information that might be lost due to color blindness.</li>';
  }
  
  html += '</ul>';
  recommendationsList.innerHTML = html;
}

/**
 * Gets the average accessibility score across all types
 */
function getAverageScore() {
  const scores = [
    accessibilityScores.protanopia,
    accessibilityScores.deuteranopia,
    accessibilityScores.tritanopia,
    accessibilityScores.achromatopsia
  ];
  
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

/**
 * Gets the worst type of color blindness for this image
 */
function getWorstColorBlindnessType() {
  const types = ['protanopia', 'deuteranopia', 'tritanopia', 'achromatopsia'];
  let worstType = null;
  let worstScore = 100;
  
  for (const type of types) {
    if (accessibilityScores[type] < worstScore) {
      worstScore = accessibilityScores[type];
      worstType = type;
    }
  }
  
  return worstType;
}

/**
 * Generates a downloadable report
 */
function generateReport() {
  if (!currentImage) {
    showToast('Please upload an image first', 'error');
    return;
  }
  
  // Create a report HTML
  const reportHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Color Blindness Accessibility Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; color: #333; }
        h1 { color: #2563eb; margin-bottom: 20px; }
        h2 { color: #555; margin-top: 30px; margin-bottom: 15px; }
        .score-section { display: flex; gap: 20px; flex-wrap: wrap; }
        .score-card { background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 15px; width: 200px; }
        .score-title { font-size: 1.1rem; margin-bottom: 10px; }
        .score-value { font-size: 2.5rem; font-weight: bold; margin-bottom: 10px; }
        .score-good { color: #4CAF50; }
        .score-medium { color: #FFAA00; }
        .score-poor { color: #F44336; }
        .recommendations { background: #f0f7ff; border: 1px solid #cce5ff; border-radius: 8px; padding: 20px; margin-top: 30px; }
        .recommendations h3 { color: #0d6efd; margin-top: 0; }
        .recommendations ul { padding-left: 20px; }
        .recommendations li { margin-bottom: 10px; }
        footer { margin-top: 40px; color: #777; font-size: 0.9rem; text-align: center; }
      </style>
    </head>
    <body>
      <h1>Color Blindness Accessibility Report</h1>
      <p>This report evaluates how accessible the image is for people with different types of color blindness.</p>
      
      <h2>Accessibility Scores</h2>
      <div class="score-section">
        <div class="score-card">
          <div class="score-title">Protanopia (Red-Blind)</div>
          <div class="score-value ${getScoreClass(accessibilityScores.protanopia)}">${accessibilityScores.protanopia}</div>
        </div>
        <div class="score-card">
          <div class="score-title">Deuteranopia (Green-Blind)</div>
          <div class="score-value ${getScoreClass(accessibilityScores.deuteranopia)}">${accessibilityScores.deuteranopia}</div>
        </div>
        <div class="score-card">
          <div class="score-title">Tritanopia (Blue-Blind)</div>
          <div class="score-value ${getScoreClass(accessibilityScores.tritanopia)}">${accessibilityScores.tritanopia}</div>
        </div>
        <div class="score-card">
          <div class="score-title">Achromatopsia (Monochrome)</div>
          <div class="score-value ${getScoreClass(accessibilityScores.achromatopsia)}">${accessibilityScores.achromatopsia}</div>
        </div>
      </div>
      
      <div class="recommendations">
        <h3>Recommendations for Improvement</h3>
        ${recommendationsList.innerHTML}
      </div>
      
      <footer>
        <p>Generated by Color Blindness Accessibility Analyzer on ${new Date().toLocaleDateString()}</p>
      </footer>
    </body>
    </html>
  `;
  
  // Convert HTML to Blob
  const blob = new Blob([reportHTML], { type: 'text/html' });
  
  // Create download link
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'color-blindness-report.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  showToast('Report downloaded successfully', 'success');
}

/**
 * Returns CSS class for score coloring in report
 */
function getScoreClass(score) {
  if (score >= 80) return 'score-good';
  if (score >= 60) return 'score-medium';
  return 'score-poor';
}

// Initialize theme icons
updateThemeIcons();
