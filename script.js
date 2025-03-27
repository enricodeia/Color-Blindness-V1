/**
 * UI Vision - Color Accessibility Analyzer
 * A professional tool for evaluating UI designs against color blindness accessibility standards
 */

// ------ DOM Elements ------
// Main elements
const fileUpload = document.getElementById('file-upload');
const uploadArea = document.getElementById('upload-area');
const imageUrl = document.getElementById('image-url');
const urlSubmit = document.getElementById('url-submit');
const urlAlert = document.querySelector('.url-alert');
const loadingOverlay = document.getElementById('loading-overlay');
const emptyState = document.getElementById('empty-state');
const viewContainer = document.getElementById('view-container');
const themeToggle = document.getElementById('theme-toggle');
const infoBtn = document.getElementById('info-btn');
const infoModal = document.getElementById('info-modal');
const closeModalBtn = document.querySelector('.close-btn');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');
const exportReportBtn = document.getElementById('export-report');
const exportJsonBtn = document.getElementById('export-json');

// Tabs and views
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');
const simulationPills = document.querySelectorAll('.pill[data-type]');
const viewModePills = document.querySelectorAll('.pill[data-mode]');
const sideBySideView = document.getElementById('side-by-side-view');
const gridView = document.getElementById('grid-view');

// Analysis settings
const detectUiToggle = document.getElementById('detect-ui');
const highlightIssuesToggle = document.getElementById('highlight-issues');
const wcagGuidelinesToggle = document.getElementById('wcag-guidelines');

// Canvases
const originalCanvas = document.getElementById('original-canvas');
const simulationCanvas = document.getElementById('simulation-canvas');
const highlightCanvas = document.getElementById('highlight-canvas');
const gridOriginalCanvas = document.getElementById('grid-original-canvas');
const gridProtanopiaCanvas = document.getElementById('grid-protanopia-canvas');
const gridDeuteranopiaCanvas = document.getElementById('grid-deuteranopia-canvas');
const gridTritanopiaCanvas = document.getElementById('grid-tritanopia-canvas');
const gridAchromatopsiaCanvas = document.getElementById('grid-achromatopsia-canvas');
const gridProtanopiaHighlight = document.getElementById('grid-protanopia-highlight');
const gridDeuteranopiaHighlight = document.getElementById('grid-deuteranopia-highlight');
const gridTritanopiaHighlight = document.getElementById('grid-tritanopia-highlight');
const gridAchromatopsiaHighlight = document.getElementById('grid-achromatopsia-highlight');
const componentPreviewCanvas = document.getElementById('component-preview-canvas');

// UI Overlays
const originalOverlay = document.getElementById('original-overlay');
const simulationOverlay = document.getElementById('simulation-overlay');
const gridOriginalOverlay = document.getElementById('grid-original-overlay');
const gridProtanopiaOverlay = document.getElementById('grid-protanopia-overlay');
const gridDeuteranopiaOverlay = document.getElementById('grid-deuteranopia-overlay');
const gridTritanopiaOverlay = document.getElementById('grid-tritanopia-overlay');
const gridAchromatopsiaOverlay = document.getElementById('grid-achromatopsia-overlay');

// Canvas contexts
const originalCtx = originalCanvas.getContext('2d');
const simulationCtx = simulationCanvas.getContext('2d');
const highlightCtx = highlightCanvas.getContext('2d');
const gridOriginalCtx = gridOriginalCanvas.getContext('2d');
const gridProtanopiaCtx = gridProtanopiaCanvas.getContext('2d');
const gridDeuteranopiaCtx = gridDeuteranopiaCanvas.getContext('2d');
const gridTritanopiaCtx = gridTritanopiaCanvas.getContext('2d');
const gridAchromatopsiaCtx = gridAchromatopsiaCanvas.getContext('2d');
const gridProtanopiaHighlightCtx = gridProtanopiaHighlight.getContext('2d');
const gridDeuteranopiaHighlightCtx = gridDeuteranopiaHighlight.getContext('2d');
const gridTritanopiaHighlightCtx = gridTritanopiaHighlight.getContext('2d');
const gridAchromatopsiaHighlightCtx = gridAchromatopsiaHighlight.getContext('2d');
const componentPreviewCtx = componentPreviewCanvas.getContext('2d');

// Score and report elements
const simulationTitle = document.getElementById('simulation-title');
const simulationScore = document.getElementById('simulation-score');
const protanopiaScore = document.getElementById('protanopia-score');
const deuteranopiaScore = document.getElementById('deuteranopia-score');
const tritanopiaScore = document.getElementById('tritanopia-score');
const achromatopsiaScore = document.getElementById('achromatopsia-score');

// Report elements
const overallScore = document.getElementById('overall-score');
const overallScoreCircle = document.getElementById('overall-score-circle');
const reportDate = document.getElementById('report-date');
const scoreBarProtanopia = document.getElementById('score-bar-protanopia');
const scoreBarDeuteranopia = document.getElementById('score-bar-deuteranopia');
const scoreBarTritanopia = document.getElementById('score-bar-tritanopia');
const scoreBarAchromatopsia = document.getElementById('score-bar-achromatopsia');
const scoreBarProtanopiaValue = document.getElementById('score-bar-protanopia-value');
const scoreBarDeuteranopiaValue = document.getElementById('score-bar-deuteranopia-value');
const scoreBarTritanopiaValue = document.getElementById('score-bar-tritanopia-value');
const scoreBarAchromatopsiaValue = document.getElementById('score-bar-achromatopsia-value');
const componentSummary = document.getElementById('component-summary');
const criticalIssues = document.getElementById('critical-issues');
const recommendationsList = document.getElementById('recommendations-list');
const wcagSummary = document.getElementById('wcag-summary');

// Component analysis elements
const componentItems = document.getElementById('component-items');
const componentName = document.getElementById('component-name');
const contrastRatio = document.getElementById('contrast-ratio');
const wcagAA = document.getElementById('wcag-aa');
const wcagAALarge = document.getElementById('wcag-aa-large');
const wcagAAA = document.getElementById('wcag-aaa');
const impactProtanopia = document.getElementById('impact-protanopia');
const impactDeuteranopia = document.getElementById('impact-deuteranopia');
const impactTritanopia = document.getElementById('impact-tritanopia');
const impactAchromatopsia = document.getElementById('impact-achromatopsia');
const impactProtanopiaValue = document.getElementById('impact-protanopia-value');
const impactDeuteranopiaValue = document.getElementById('impact-deuteranopia-value');
const impactTritanopiaValue = document.getElementById('impact-tritanopia-value');
const impactAchromatopsiaValue = document.getElementById('impact-achromatopsia-value');
const colorRecommendations = document.getElementById('color-recommendations');
const componentDetailContent = document.querySelector('.component-detail-content');

// ------ App State ------
let currentImage = null;
let currentSimulationType = 'original';
let isGridView = false;
let detectedUIComponents = [];
let selectedComponent = null;
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

// Color blindness simulation matrices
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

// ------ Event Listeners ------
// File upload
uploadArea.addEventListener('click', () => fileUpload.click());
fileUpload.addEventListener('change', handleFileUpload);

// URL upload
urlSubmit.addEventListener('click', handleImageUrl);
imageUrl.addEventListener('keypress', e => {
  if (e.key === 'Enter') handleImageUrl();
});

// Drag and drop
uploadArea.addEventListener('dragover', e => {
  e.preventDefault();
  uploadArea.classList.add('drag-over');
});

uploadArea.addEventListener('dragleave', () => {
  uploadArea.classList.remove('drag-over');
});

uploadArea.addEventListener('drop', e => {
  e.preventDefault();
  uploadArea.classList.remove('drag-over');
  
  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
    fileUpload.files = e.dataTransfer.files;
    handleFileUpload();
  }
});

// Simulation pills
simulationPills.forEach(pill => {
  pill.addEventListener('click', () => {
    // Update active pill
    simulationPills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    
    // Update simulation type
    currentSimulationType = pill.dataset.type;
    updateSimulationTitle();
    
    // Update the view
    if (currentImage) {
      if (isGridView) {
        // Grid view already shows all simulations
      } else {
        applySimulation(currentSimulationType);
      }
    }
  });
});

// View mode pills
viewModePills.forEach(pill => {
  pill.addEventListener('click', () => {
    // Update active pill
    viewModePills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    
    // Update view mode
    const mode = pill.dataset.mode;
    isGridView = mode === 'grid';
    
    // Update the view
    if (currentImage) {
      if (isGridView) {
        sideBySideView.classList.add('hidden');
        gridView.classList.remove('hidden');
        generateAllSimulations();
      } else {
        gridView.classList.add('hidden');
        sideBySideView.classList.remove('hidden');
        applySimulation(currentSimulationType);
      }
    }
  });
});

// Tabs navigation
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const tabId = tab.dataset.tab;
    
    // Update active tab
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    // Show corresponding content
    tabContents.forEach(content => {
      content.classList.remove('active');
      if (content.id === tabId) {
        content.classList.add('active');
      }
    });
  });
});

// Toggle switches
highlightIssuesToggle.addEventListener('change', () => {
  if (currentImage) {
    toggleProblemHighlights();
  }
});

detectUiToggle.addEventListener('change', () => {
  if (currentImage) {
    toggleUIComponentDetection();
  }
});

wcagGuidelinesToggle.addEventListener('change', () => {
  if (currentImage) {
    updateWCAGAnalysis();
  }
});

// Export buttons
exportReportBtn.addEventListener('click', generateReport);
exportJsonBtn.addEventListener('click', exportJsonData);

// Theme toggle
themeToggle.addEventListener('click', toggleTheme);

// Info modal
infoBtn.addEventListener('click', () => {
  infoModal.classList.add('active');
});

closeModalBtn.addEventListener('click', () => {
  infoModal.classList.remove('active');
});

// Close modal when clicking outside
infoModal.addEventListener('click', e => {
  if (e.target === infoModal) {
    infoModal.classList.remove('active');
  }
});

// ------ Core Functions ------
/**
 * Handles file upload from input
 */
function handleFileUpload() {
  const file = fileUpload.files[0];
  if (file && file.type.match('image.*')) {
    showLoading();
    
    const reader = new FileReader();
    reader.onload = e => {
      loadImage(e.target.result);
    };
    
    reader.readAsDataURL(file);
  }
}

/**
 * Handles image URL input with validation
 */
function handleImageUrl() {
  const url = imageUrl.value.trim();
  
  if (!url) {
    showUrlError('Please enter an image URL');
    return;
  }
  
  // Validate URL format
  if (!isValidUrl(url)) {
    showUrlError('Please enter a valid URL');
    return;
  }
  
  hideUrlError();
  showLoading();
  
  // Verify the URL points to an image
  checkImageUrl(url)
    .then(isValid => {
      if (isValid) {
        loadImage(url);
      } else {
        hideLoading();
        showUrlError('URL does not point to a valid image');
        showToast('Invalid image URL. Please check the URL and try again.', 'error');
      }
    })
    .catch(error => {
      hideLoading();
      showUrlError('Error loading image');
      showToast('Failed to load image. The server might not allow cross-origin requests.', 'error');
      console.error('Image loading error:', error);
    });
}

/**
 * Validates if the string is a proper URL
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
 * Checks if a URL points to a valid image
 */
function checkImageUrl(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    
    // Add cache-busting parameter
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
 * Loads and processes an image from the given source
 */
function loadImage(src) {
  const img = new Image();
  img.crossOrigin = 'anonymous'; // Enable CORS support
  
  img.onload = () => {
    currentImage = img;
    
    // Setup canvas dimensions
    setCanvasDimensions(img);
    
    // Hide empty state and show view container
    emptyState.classList.add('hidden');
    viewContainer.classList.remove('hidden');
    
    // Reset scores
    resetAccessibilityScores();
    
    // Process the image based on view mode
    if (isGridView) {
      generateAllSimulations();
      sideBySideView.classList.add('hidden');
      gridView.classList.remove('hidden');
    } else {
      applySimulation(currentSimulationType);
      gridView.classList.add('hidden');
      sideBySideView.classList.remove('hidden');
    }
    
    // Detect UI components if enabled
    if (detectUiToggle.checked) {
      detectUIComponents();
    }
    
    // Update the report tab
    updateReportTab();
    
    // Enable export buttons
    exportReportBtn.disabled = false;
    exportJsonBtn.disabled = false;
    
    // Update current date in report
    reportDate.textContent = new Date().toLocaleDateString();
    
    hideLoading();
    showToast('Image loaded successfully!', 'success');
    
    // Clear URL input if loaded from URL
    if (src.startsWith('http') || src.startsWith('data:image')) {
      imageUrl.value = '';
    }
  };
  
  img.onerror = () => {
    hideLoading();
    
    // Try with CORS proxy if it's a URL
    if (src.startsWith('http') && !src.startsWith('https://cors-anywhere')) {
      showToast('Trying to load image through CORS proxy...', 'info');
      
      // Use a CORS proxy (note: for production, you should use your own proxy)
      const corsProxyUrl = 'https://cors-anywhere.herokuapp.com/';
      loadImage(corsProxyUrl + src);
    } else {
      showToast('Failed to load image. Please try a different image.', 'error');
    }
  };
  
  // Add cache-busting parameter for URLs
  if (src.startsWith('http')) {
    src = src + (src.includes('?') ? '&' : '?') + 'nocache=' + Date.now();
  }
  
  img.src = src;
}

/**
 * Sets dimensions for all canvases based on the image
 */
function setCanvasDimensions(img) {
  const canvases = [
    originalCanvas, simulationCanvas, highlightCanvas,
    gridOriginalCanvas, gridProtanopiaCanvas, gridDeuteranopiaCanvas,
    gridTritanopiaCanvas, gridAchromatopsiaCanvas,
    gridProtanopiaHighlight, gridDeuteranopiaHighlight,
    gridTritanopiaHighlight, gridAchromatopsiaHighlight,
    componentPreviewCanvas
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
    highlightCtx.clearRect(0, 0, highlightCtx.canvas.width, highlightCtx.canvas.height);
    return;
  }
  
  // Get image data from original canvas
  const imageData = originalCtx.getImageData(0, 0, originalCanvas.width, originalCanvas.height);
  
  // Apply color transformation
  const transformedData = transformColors(imageData, colorBlindnessMatrices[type]);
  
  // Draw transformed image
  simulationCtx.putImageData(transformedData, 0, 0);
  
  // Calculate accessibility score
  calculateAccessibilityScore(type, imageData, transformedData);
  
  // Update score display
  updateScoreDisplay(type);
  
  // Generate problem highlights if enabled
  if (highlightIssuesToggle.checked) {
    generateProblemHighlights(type, imageData, transformedData);
  } else {
    highlightCtx.clearRect(0, 0, highlightCtx.canvas.width, highlightCtx.canvas.height);
  }
  
  // Update overlay with UI components if enabled
  if (detectUiToggle.checked) {
    updateUIComponentOverlay(simulationOverlay, type);
  }
}

/**
 * Generates all simulations for grid view
 */
function generateAllSimulations() {
  // Draw original image
  drawImageOnCanvas(gridOriginalCtx, currentImage);
  
  // Get image data
  const imageData = gridOriginalCtx.getImageData(0, 0, gridOriginalCanvas.width, gridOriginalCanvas.height);
  
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
  
  // Calculate accessibility scores
  calculateAccessibilityScore('protanopia', imageData, protanopiaData);
  calculateAccessibilityScore('deuteranopia', imageData, deuteranopiaData);
  calculateAccessibilityScore('tritanopia', imageData, tritanopiaData);
  calculateAccessibilityScore('achromatopsia', imageData, achromatopsiaData);
  
  // Update score displays
  updateAllScores();
  
  // Generate problem highlights if enabled
  if (highlightIssuesToggle.checked) {
    generateProblemHighlights('protanopia', imageData, protanopiaData, gridProtanopiaHighlightCtx);
    generateProblemHighlights('deuteranopia', imageData, deuteranopiaData, gridDeuteranopiaHighlightCtx);
    generateProblemHighlights('tritanopia', imageData, tritanopiaData, gridTritanopiaHighlightCtx);
    generateProblemHighlights('achromatopsia', imageData, achromatopsiaData, gridAchromatopsiaHighlightCtx);
  } else {
    gridProtanopiaHighlightCtx.clearRect(0, 0, gridProtanopiaHighlight.width, gridProtanopiaHighlight.height);
    gridDeuteranopiaHighlightCtx.clearRect(0, 0, gridDeuteranopiaHighlight.width, gridDeuteranopiaHighlight.height);
    gridTritanopiaHighlightCtx.clearRect(0, 0, gridTritanopiaHighlight.width, gridTritanopiaHighlight.height);
    gridAchromatopsiaHighlightCtx.clearRect(0, 0, gridAchromatopsiaHighlight.width, gridAchromatopsiaHighlight.height);
  }
  
  // Update overlays with UI components if enabled
  if (detectUiToggle.checked) {
    updateUIComponentOverlay(gridOriginalOverlay, 'original');
    updateUIComponentOverlay(gridProtanopiaOverlay, 'protanopia');
    updateUIComponentOverlay(gridDeuteranopiaOverlay, 'deuteranopia');
    updateUIComponentOverlay(gridTritanopiaOverlay, 'tritanopia');
    updateUIComponentOverlay(gridAchromatopsiaOverlay, 'achromatopsia');
  }
}

/**
 * Transforms colors using the provided color blindness matrix
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
    
    // Apply color matrix transformation
    resultData[i] = r * matrix[0] + g * matrix[1] + b * matrix[2]; // Red
    resultData[i + 1] = r * matrix[3] + g * matrix[4] + b * matrix[5]; // Green
    resultData[i + 2] = r * matrix[6] + g * matrix[7] + b * matrix[8]; // Blue
    // Alpha remains unchanged
  }
  
  return result;
}

/**
 * Calculate an accessibility score for a simulated image
 */
function calculateAccessibilityScore(type, originalData, simulatedData) {
  const originalPixels = originalData.data;
  const simulatedPixels = simulatedData.data;
  
  // Store problematic areas
  const problems = [];
  
  // Track color differentiation statistics
  let totalPixels = originalPixels.length / 4;
  let colorLossSum = 0;
  let significantColorChanges = 0;
  let contrastLossPixels = 0;
  
  // Sampling step (check every Nth pixel for performance)
  const sampleStep = 6;
  
  // Color difference thresholds
  const MINOR_CHANGE_THRESHOLD = 20;
  const SIGNIFICANT_CHANGE_THRESHOLD = 45;
  const CRITICAL_CHANGE_THRESHOLD = 80;
  
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
    
    // Calculate color difference using a modified Delta E formula
    const colorDiff = Math.sqrt(
      Math.pow(r1 - r2, 2) + 
      Math.pow(g1 - g2, 2) + 
      Math.pow(b1 - b2, 2)
    );
    
    // Calculate perceived brightness
    const brightness1 = (r1 * 299 + g1 * 587 + b1 * 114) / 1000;
    const brightness2 = (r2 * 299 + g2 * 587 + b2 * 114) / 1000;
    
    // Calculate contrast change
    const contrastChange = Math.abs(brightness1 - brightness2);
    
    if (colorDiff > MINOR_CHANGE_THRESHOLD) {
      colorLossSum += colorDiff;
      
      if (colorDiff > SIGNIFICANT_CHANGE_THRESHOLD) {
        significantColorChanges++;
        
        // Calculate pixel position
        const pixelIndex = i / 4;
        const x = pixelIndex % originalData.width;
        const y = Math.floor(pixelIndex / originalData.width);
        
        // Check if this is a UI element boundary (significant color changes)
        const isLikelyUI = checkIfUIElement(x, y, originalData);
        
        // Add to problem areas if significant color loss
        if (colorDiff > CRITICAL_CHANGE_THRESHOLD && isLikelyUI) {
          problems.push({
            x: x,
            y: y,
            severity: Math.min(colorDiff / 255, 1),
            isDangerous: contrastChange > 30
          });
        }
      }
      
      // Count pixels with significant contrast loss
      if (contrastChange > 20) {
        contrastLossPixels++;
      }
    }
  }
  
  // Normalize the statistics
  const sampledPixels = Math.ceil(totalPixels / sampleStep);
  const percentSignificantChanges = (significantColorChanges / sampledPixels) * 100;
  const percentContrastLoss = (contrastLossPixels / sampledPixels) * 100;
  const avgColorLoss = colorLossSum / Math.max(1, significantColorChanges);
  
  // Score formula gives weight to both color changes and contrast loss
  const colorLossScore = 100 - Math.min(100, (percentSignificantChanges * 0.8 + (avgColorLoss / 255) * 20));
  const contrastLossScore = 100 - Math.min(100, percentContrastLoss * 1.5);
  
  // Final score is weighted average with more weight to contrast loss
  const weightedScore = (colorLossScore * 0.4) + (contrastLossScore * 0.6);
  
  // Store the score (rounded to nearest integer)
  accessibilityScores[type] = Math.max(0, Math.min(100, Math.round(weightedScore)));
  
  // Store problem areas
  problemAreas[type] = problems;
  
  return accessibilityScores[type];
}

/**
 * Checks if a pixel is likely part of a UI element by analyzing surrounding pixels
 */
function checkIfUIElement(x, y, imageData) {
  // Sample surrounding pixels to check for UI element boundary
  const width = imageData.width;
  const height = imageData.height;
  const data = imageData.data;
  
  // Skip edge pixels
  if (x < 2 || y < 2 || x >= width - 2 || y >= height - 2) {
    return false;
  }
  
  // Check for high contrast with neighbors (UI elements often have sharp edges)
  let highContrastCount = 0;
  
  // Get center pixel
  const centerOffset = (y * width + x) * 4;
  const centerR = data[centerOffset];
  const centerG = data[centerOffset + 1];
  const centerB = data[centerOffset + 2];
  
  // Check surrounding pixels
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue; // Skip center pixel
      
      const nx = x + dx;
      const ny = y + dy;
      const offset = (ny * width + nx) * 4;
      
      const r = data[offset];
      const g = data[offset + 1];
      const b = data[offset + 2];
      
      // Calculate color difference
      const colorDiff = Math.sqrt(
        Math.pow(centerR - r, 2) + 
        Math.pow(centerG - g, 2) + 
        Math.pow(centerB - b, 2)
      );
      
      if (colorDiff > 40) {
        highContrastCount++;
      }
    }
  }
  
  // UI elements often have sharp edges with high contrast
  return highContrastCount >= 2;
}

/**
 * Generates visual highlights for problem areas
 */
function generateProblemHighlights(type, originalData, simulatedData, targetCtx = null) {
  const ctx = targetCtx || highlightCtx;
  const problems = problemAreas[type];
  
  // Clear the canvas
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
  if (!problems || problems.length === 0) return;
  
  // Draw problem areas
  for (const area of problems) {
    const radius = Math.max(3, Math.ceil(4 + area.severity * 4));
    const alpha = Math.min(0.5, 0.2 + area.severity * 0.3);
    
    // Use different colors for different severity levels
    let color = area.isDangerous ? 'rgba(255, 0, 0, ' : 'rgba(255, 165, 0, ';
    ctx.fillStyle = color + alpha + ')';
    
    ctx.beginPath();
    ctx.arc(area.x, area.y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

/**
 * Updates the display of all scores in grid view
 */
function updateAllScores() {
  // Update score values
  protanopiaScore.textContent = accessibilityScores.protanopia;
  deuteranopiaScore.textContent = accessibilityScores.deuteranopia;
  tritanopiaScore.textContent = accessibilityScores.tritanopia;
  achromatopsiaScore.textContent = accessibilityScores.achromatopsia;
  
  // Update score colors
  updateScoreColor(protanopiaScore, accessibilityScores.protanopia);
  updateScoreColor(deuteranopiaScore, accessibilityScores.deuteranopia);
  updateScoreColor(tritanopiaScore, accessibilityScores.tritanopia);
  updateScoreColor(achromatopsiaScore, accessibilityScores.achromatopsia);
  
  // Update report tab scores
  updateReportScores();
}

/**
 * Updates the score display for the current simulation
 */
function updateScoreDisplay(type) {
  if (type === 'original') return;
  
  // Update score value
  simulationScore.textContent = accessibilityScores[type];
  
  // Update score color
  updateScoreColor(simulationScore, accessibilityScores[type]);
}

/**
 * Updates the color of a score display based on its value
 */
function updateScoreColor(element, score) {
  if (score >= 85) {
    element.style.backgroundColor = 'rgba(6, 214, 160, 0.1)';
    element.style.color = '#06d6a0';
  } else if (score >= 70) {
    element.style.backgroundColor = 'rgba(255, 209, 102, 0.1)';
    element.style.color = '#ffd166';
  } else {
    element.style.backgroundColor = 'rgba(239, 71, 111, 0.1)';
    element.style.color = '#ef476f';
  }
}

/**
 * Updates the simulation title based on current simulation type
 */
function updateSimulationTitle() {
  const titles = {
    'original': 'Original Design',
    'protanopia': 'Protanopia (Red-Blind)',
    'deuteranopia': 'Deuteranopia (Green-Blind)',
    'tritanopia': 'Tritanopia (Blue-Blind)',
    'achromatopsia': 'Achromatopsia (Monochrome)'
  };
  
  simulationTitle.textContent = titles[currentSimulationType] || 'Simulation';
}

/**
 * Resets accessibility scores to default values
 */
function resetAccessibilityScores() {
  accessibilityScores = {
    original: 100,
    protanopia: 0,
    deuteranopia: 0,
    tritanopia: 0,
    achromatopsia: 0
  };
  
  problemAreas = {
    protanopia: [],
    deuteranopia: [],
    tritanopia: [],
    achromatopsia: []
  };
}

/**
 * Toggles the display of problem highlights
 */
function toggleProblemHighlights() {
  const showHighlights = highlightIssuesToggle.checked;
  
  // Update all canvases
  if (currentImage) {
    if (!isGridView) {
      // Update side-by-side view
      if (currentSimulationType !== 'original' && showHighlights) {
        const imageData = originalCtx.getImageData(0, 0, originalCanvas.width, originalCanvas.height);
        const simulatedData = simulationCtx.getImageData(0, 0, simulationCanvas.width, simulationCanvas.height);
        generateProblemHighlights(currentSimulationType, imageData, simulatedData);
      } else {
        highlightCtx.clearRect(0, 0, highlightCtx.canvas.width, highlightCtx.canvas.height);
      }
    } else {
      // Update grid view
      const imageData = gridOriginalCtx.getImageData(0, 0, gridOriginalCanvas.width, gridOriginalCanvas.height);
      
      if (showHighlights) {
        const types = ['protanopia', 'deuteranopia', 'tritanopia', 'achromatopsia'];
        const canvases = [gridProtanopiaCanvas, gridDeuteranopiaCanvas, gridTritanopiaCanvas, gridAchromatopsiaCanvas];
        const highlights = [gridProtanopiaHighlightCtx, gridDeuteranopiaHighlightCtx, gridTritanopiaHighlightCtx, gridAchromatopsiaHighlightCtx];
        
        for (let i = 0; i < types.length; i++) {
          const simulatedData = canvases[i].getContext('2d').getImageData(0, 0, canvases[i].width, canvases[i].height);
          generateProblemHighlights(types[i], imageData, simulatedData, highlights[i]);
        }
      } else {
        gridProtanopiaHighlightCtx.clearRect(0, 0, gridProtanopiaHighlight.width, gridProtanopiaHighlight.height);
        gridDeuteranopiaHighlightCtx.clearRect(0, 0, gridDeuteranopiaHighlight.width, gridDeuteranopiaHighlight.height);
        gridTritanopiaHighlightCtx.clearRect(0, 0, gridTritanopiaHighlight.width, gridTritanopiaHighlight.height);
        gridAchromatopsiaHighlightCtx.clearRect(0, 0, gridAchromatopsiaHighlight.width, gridAchromatopsiaHighlight.height);
      }
    }
  }
}

/**
 * Detects UI components in the image
 */
function detectUIComponents() {
  if (!currentImage) return;
  
  // Get image data from original canvas
  const imageData = originalCtx.getImageData(0, 0, originalCanvas.width, originalCanvas.height);
  
  // Reset detected components
  detectedUIComponents = [];
  
  // Run edge detection to find UI elements
  const edgeData = detectEdges(imageData);
  
  // Identify potential UI components
  identifyUIComponents(imageData, edgeData);
  
  // Update UI component list display
  updateComponentList();
  
  // Update overlays
  updateUIComponentOverlay(originalOverlay, 'original');
  updateUIComponentOverlay(simulationOverlay, currentSimulationType);
  
  if (isGridView) {
    updateUIComponentOverlay(gridOriginalOverlay, 'original');
    updateUIComponentOverlay(gridProtanopiaOverlay, 'protanopia');
    updateUIComponentOverlay(gridDeuteranopiaOverlay, 'deuteranopia');
    updateUIComponentOverlay(gridTritanopiaOverlay, 'tritanopia');
    updateUIComponentOverlay(gridAchromatopsiaOverlay, 'achromatopsia');
  }
  
  // Update component summary in report
  updateComponentSummary();
  
  console.log(`Detected ${detectedUIComponents.length} UI components`);
}

/**
 * Simple edge detection algorithm to find UI element boundaries
 */
function detectEdges(imageData) {
  const width = imageData.width;
  const height = imageData.height;
  const data = imageData.data;
  
  // Create new ImageData for edges
  const edgeData = new Uint8ClampedArray(width * height);
  
  // Sobel operator for edge detection
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const pixelIndex = (y * width + x) * 4;
      
      // Calculate gradient magnitudes using surrounding pixels
      let gradX = 0;
      let gradY = 0;
      
      // Sample surrounding pixels for edge detection
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          
          const nx = x + dx;
          const ny = y + dy;
          const neighborIndex = (ny * width + nx) * 4;
          
          const r = data[neighborIndex];
          const g = data[neighborIndex + 1];
          const b = data[neighborIndex + 2];
          
          // Calculate brightness
          const brightness = (r * 299 + g * 587 + b * 114) / 1000;
          
          // Apply gradient weights
          const weight = (dx === 0 || dy === 0) ? 2 : 1;
          gradX += dx * brightness * weight;
          gradY += dy * brightness * weight;
        }
      }
      
      // Calculate gradient magnitude
      const gradMag = Math.sqrt(gradX * gradX + gradY * gradY);
      
      // Threshold gradient to detect edges
      edgeData[y * width + x] = gradMag > 30 ? 255 : 0;
    }
  }
  
  return edgeData;
}

/**
 * Identifies potential UI components based on edge detection and color regions
 */
function identifyUIComponents(imageData, edgeData) {
  const width = imageData.width;
  const height = imageData.height;
  const data = imageData.data;
  
  // Potential UI element types and their color characteristics
  const uiTypes = ['button', 'text', 'input', 'icon', 'nav', 'card', 'header'];
  
  // Scan for rectangular regions with consistent colors (likely UI elements)
  const visited = new Set();
  
  // Sampling density (for performance)
  const sampleStep = Math.max(1, Math.floor(width * height / 200000));
  
  for (let y = 10; y < height - 10; y += sampleStep) {
    for (let x = 10; x < width - 10; x += sampleStep) {
      const pixelIndex = (y * width + x);
      
      // Skip if already visited or not an edge
      if (visited.has(pixelIndex) || edgeData[pixelIndex] === 0) {
        continue;
      }
      
      // Find connected edge pixels
      const region = floodFillEdges(x, y, width, height, edgeData, visited);
      
      // Analyze the region to determine if it's a UI component
      if (region.points.length > 20 && region.width > 10 && region.height > 10) {
        const componentType = analyzeUIRegion(region, imageData, data);
        
        if (componentType) {
          // Calculate region's center point
          const centerX = Math.floor(region.minX + region.width / 2);
          const centerY = Math.floor(region.minY + region.height / 2);
          
          // Get average color inside the region
          const color = getAverageColor(centerX, centerY, region.width, region.height, imageData);
          
          // Create UI component record
          const component = {
            id: detectedUIComponents.length,
            type: componentType,
            name: `${componentType[0].toUpperCase() + componentType.slice(1)} ${detectedUIComponents.length + 1}`,
            x: region.minX,
            y: region.minY,
            width: region.width,
            height: region.height,
            color: color,
            textColor: findDominantTextColor(region, imageData),
            contrastRatio: 0,
            accessibilityScores: {}
          };
          
          // Calculate contrast ratio if we found a text color
          if (component.textColor) {
            component.contrastRatio = calculateContrastRatio(component.color, component.textColor);
          }
          
          // Calculate accessibility scores for this component
          calculateComponentAccessibilityScores(component);
          
          detectedUIComponents.push(component);
          
          // Limit to a reasonable number of components for performance
          if (detectedUIComponents.length >= 20) {
            break;
          }
        }
      }
    }
    
    if (detectedUIComponents.length >= 20) {
      break;
    }
  }
}

/**
 * Flood fill algorithm to find connected edge pixels
 */
function floodFillEdges(startX, startY, width, height, edgeData, visited) {
  const queue = [{x: startX, y: startY}];
  const region = {
    points: [],
    minX: startX,
    minY: startY,
    maxX: startX,
    maxY: startY
  };
  
  const maxPoints = 1000; // Limit region size for performance
  
  while (queue.length > 0 && region.points.length < maxPoints) {
    const {x, y} = queue.shift();
    const pixelIndex = y * width + x;
    
    if (x < 0 || y < 0 || x >= width || y >= height || visited.has(pixelIndex) || edgeData[pixelIndex] === 0) {
      continue;
    }
    
    visited.add(pixelIndex);
    region.points.push({x, y});
    
    // Update region boundaries
    region.minX = Math.min(region.minX, x);
    region.minY = Math.min(region.minY, y);
    region.maxX = Math.max(region.maxX, x);
    region.maxY = Math.max(region.maxY, y);
    
    // Check neighbors
    queue.push({x: x + 1, y});
    queue.push({x: x - 1, y});
    queue.push({x, y: y + 1});
    queue.push({x, y: y - 1});
  }
  
  // Calculate region dimensions
  region.width = region.maxX - region.minX;
  region.height = region.maxY - region.minY;
  
  return region;
}

/**
 * Analyzes a region to determine if it's a UI component and what type
 */
function analyzeUIRegion(region, imageData, data) {
  const {width, height} = imageData;
  const {minX, minY, maxX, maxY} = region;
  
  // Simple heuristics for UI component detection
  const aspectRatio = region.width / region.height;
  
  // Calculate shape characteristics
  let isRectangular = false;
  
  // Check if the region forms a roughly rectangular shape
  const cornerPoints = [
    {x: minX, y: minY},
    {x: maxX, y: minY},
    {x: minX, y: maxY},
    {x: maxX, y: maxY}
  ];
  
  let cornersPresent = 0;
  cornerPoints.forEach(point => {
    const cornerIndex = (point.y * width + point.x);
    if (region.points.some(p => Math.abs(p.x - point.x) < 5 && Math.abs(p.y - point.y) < 5)) {
      cornersPresent++;
    }
  });
  
  isRectangular = cornersPresent >= 3;
  
  // Calculate fill ratio (percentage of region filled with edges)
  const totalArea = region.width * region.height;
  const fillRatio = region.points.length / totalArea;
  
  // Check for text-like patterns (horizontal lines of similar height)
  let isTextLike = false;
  if (region.width > region.height * 2 && region.height < 40) {
    isTextLike = true;
  }
  
  // Determine component type based on characteristics
  if (isRectangular && fillRatio < 0.1 && aspectRatio > 0.8 && aspectRatio < 5 && region.width < 200 && region.height < 80) {
    return 'button';
  } else if (isRectangular && fillRatio < 0.1 && region.width < 300 && region.height < 60) {
    return 'input';
  } else if (isTextLike) {
    return 'text';
  } else if (region.width < 50 && region.height < 50 && fillRatio > 0.1) {
    return 'icon';
  } else if (isRectangular && region.width > 200 && region.height > 100) {
    return 'card';
  } else if (isRectangular && region.width > width * 0.6 && region.height < 100) {
    return 'header';
  } else if (isRectangular && (region.width > width * 0.7 || region.height > height * 0.7) && fillRatio < 0.05) {
    return 'nav';
  }
  
  return null;
}

/**
 * Gets the average color within a region
 */
function getAverageColor(centerX, centerY, width, height, imageData) {
  const data = imageData.data;
  const imgWidth = imageData.width;
  
  // Sample points within the region (reduced sampling for performance)
  const sampleSize = Math.min(100, width * height);
  
  let rSum = 0, gSum = 0, bSum = 0;
  let sampleCount = 0;
  
  // Calculate region boundaries with padding
  const startX = Math.max(0, centerX - Math.floor(width / 2) + 5);
  const startY = Math.max(0, centerY - Math.floor(height / 2) + 5);
  const endX = Math.min(imgWidth - 1, centerX + Math.floor(width / 2) - 5);
  const endY = Math.min(imageData.height - 1, centerY + Math.floor(height / 2) - 5);
  
  // Sample step size based on region size
  const step = Math.max(1, Math.floor(Math.sqrt((endX - startX) * (endY - startY) / sampleSize)));
  
  for (let y = startY; y < endY; y += step) {
    for (let x = startX; x < endX; x += step) {
      const pixelIndex = (y * imgWidth + x) * 4;
      
      rSum += data[pixelIndex];
      gSum += data[pixelIndex + 1];
      bSum += data[pixelIndex + 2];
      
      sampleCount++;
    }
  }
  
  if (sampleCount === 0) {
    return { r: 0, g: 0, b: 0 };
  }
  
  return {
    r: Math.round(rSum / sampleCount),
    g: Math.round(gSum / sampleCount),
    b: Math.round(bSum / sampleCount)
  };
}

/**
 * Finds the dominant text color within a region
 */
function findDominantTextColor(region, imageData) {
  // Find high contrast areas that are likely text
  const data = imageData.data;
  const width = imageData.width;
  
  // Sample points within the region
  const sampleSize = Math.min(100, region.width * region.height);
  
  // Calculate background color (avg color of the region)
  const bgColor = getAverageColor(
    region.minX + Math.floor(region.width / 2), 
    region.minY + Math.floor(region.height / 2),
    region.width, 
    region.height, 
    imageData
  );
  
  // Look for colors with high contrast against the background
  let textColorCandidates = [];
  
  // Sample step size
  const step = Math.max(1, Math.floor(Math.sqrt(region.width * region.height / sampleSize)));
  
  for (let y = region.minY; y < region.maxY; y += step) {
    for (let x = region.minX; x < region.maxX; x += step) {
      const pixelIndex = (y * width + x) * 4;
      
      const r = data[pixelIndex];
      const g = data[pixelIndex + 1];
      const b = data[pixelIndex + 2];
      
      const pixelColor = { r, g, b };
      
      // Calculate contrast with background
      const contrast = calculateContrastRatio(bgColor, pixelColor);
      
      // If high contrast, add as text color candidate
      if (contrast > 3) {
        textColorCandidates.push({
          color: pixelColor,
          contrast: contrast
        });
      }
    }
  }
  
  // Find the most common high-contrast color
  if (textColorCandidates.length > 0) {
    // Sort by contrast ratio
    textColorCandidates.sort((a, b) => b.contrast - a.contrast);
    
    // Return the color with highest contrast
    return textColorCandidates[0].color;
  }
  
  return null;
}

/**
 * Calculates contrast ratio between two colors
 */
function calculateContrastRatio(color1, color2) {
  // Calculate relative luminance for WCAG contrast ratio
  const getLuminance = (color) => {
    const srgb = [color.r / 255, color.g / 255, color.b / 255];
    
    // Convert sRGB to linear RGB
    const rgb = srgb.map(val => {
      if (val <= 0.03928) {
        return val / 12.92;
      }
      return Math.pow((val + 0.055) / 1.055, 2.4);
    });
    
    // Calculate luminance
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  };
  
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  
  // Ensure lighter color is l1
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  // Calculate contrast ratio
  const contrast = (lighter + 0.05) / (darker + 0.05);
  
  return contrast;
}

/**
 * Calculates accessibility scores for a UI component
 */
function calculateComponentAccessibilityScores(component) {
  const scores = {
    protanopia: 0,
    deuteranopia: 0,
    tritanopia: 0,
    achromatopsia: 0
  };
  
  // Get component colors
  const bgColor = component.color;
  const textColor = component.textColor;
  
  if (!textColor) {
    // If no text color found, use default scores
    Object.keys(scores).forEach(type => {
      scores[type] = 80; // Default medium-high score
    });
  } else {
    // Calculate simulated colors for each type
    Object.keys(scores).forEach(type => {
      // Skip original
      if (type === 'original') return;
      
      // Apply color transformation matrix
      const matrix = colorBlindnessMatrices[type];
      
      // Simulate background color
      const simBgColor = {
        r: bgColor.r * matrix[0] + bgColor.g * matrix[1] + bgColor.b * matrix[2],
        g: bgColor.r * matrix[3] + bgColor.g * matrix[4] + bgColor.b * matrix[5],
        b: bgColor.r * matrix[6] + bgColor.g * matrix[7] + bgColor.b * matrix[8]
      };
      
      // Simulate text color
      const simTextColor = {
        r: textColor.r * matrix[0] + textColor.g * matrix[1] + textColor.b * matrix[2],
        g: textColor.r * matrix[3] + textColor.g * matrix[4] + textColor.b * matrix[5],
        b: textColor.r * matrix[6] + textColor.g * matrix[7] + textColor.b * matrix[8]
      };
      
      // Calculate contrast ratio between simulated colors
      const simContrast = calculateContrastRatio(simBgColor, simTextColor);
      const originalContrast = component.contrastRatio;
      
      // Calculate contrast loss
      const contrastLoss = Math.max(0, originalContrast - simContrast);
      
      // Score is based on how much contrast is preserved
      // WCAG requires 4.5:1 for normal text, 3:1 for large text
      if (simContrast >= 4.5) {
        scores[type] = 100; // Perfect
      } else if (simContrast >= 3) {
        scores[type] = 85; // Good
      } else if (simContrast >= 2) {
        scores[type] = 70; // Adequate
      } else if (simContrast >= 1.5) {
        scores[type] = 50; // Poor
      } else {
        scores[type] = 30; // Very poor
      }
      
      // Adjust score based on how much contrast was lost
      if (contrastLoss > 2) {
        scores[type] = Math.max(30, scores[type] - 30);
      } else if (contrastLoss > 1) {
        scores[type] = Math.max(30, scores[type] - 15);
      }
    });
  }
  
  component.accessibilityScores = scores;
}

/**
 * Updates the UI component list display
 */
function updateComponentList() {
  if (!detectedUIComponents || detectedUIComponents.length === 0) {
    componentItems.innerHTML = `
      <div class="empty-components">
        <p>No UI elements detected.</p>
        <p>Enable "Auto-detect UI elements" to analyze components.</p>
      </div>
    `;
    return;
  }
  
  let html = '';
  
  detectedUIComponents.forEach(component => {
    const color = `rgb(${component.color.r}, ${component.color.g}, ${component.color.b})`;
    
    html += `
      <div class="component-item" data-id="${component.id}">
        <div class="component-color" style="background-color: ${color}"></div>
        <div class="component-info">
          <div>${component.name}</div>
          <div class="component-type">${component.type}</div>
        </div>
      </div>
    `;
  });
  
  componentItems.innerHTML = html;
  
  // Add click event listeners
  document.querySelectorAll('.component-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.component-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      
      const componentId = parseInt(item.dataset.id);
      selectedComponent = detectedUIComponents[componentId];
      
      showComponentDetails(selectedComponent);
    });
  });
}

/**
 * Shows detailed analysis for a UI component
 */
function showComponentDetails(component) {
  // Show component details panel
  componentDetailContent.classList.remove('hidden');
  
  // Update component name
  componentName.textContent = component.name;
  
  // Draw component preview
  drawComponentPreview(component);
  
  // Update contrast info
  if (component.textColor) {
    contrastRatio.textContent = component.contrastRatio.toFixed(2);
    
    // Update WCAG compliance indicators
    updateWCAGCompliance(component.contrastRatio);
  } else {
    contrastRatio.textContent = 'N/A';
    wcagAA.textContent = 'N/A';
    wcagAALarge.textContent = 'N/A';
    wcagAAA.textContent = 'N/A';
  }
  
  // Update impact scores
  updateImpactMeters(component.accessibilityScores);
  
  // Generate color recommendations
  generateColorRecommendations(component);
}

/**
 * Draws a preview of the UI component
 */
function drawComponentPreview(component) {
  // Clear canvas
  componentPreviewCtx.clearRect(0, 0, componentPreviewCanvas.width, componentPreviewCanvas.height);
  
  // Draw component region from original image
  if (currentImage) {
    const { x, y, width, height } = component;
    
    // Draw component region
    componentPreviewCtx.drawImage(
      currentImage,
      x, y, width, height,
      0, 0, width, height
    );
    
    // Draw border around the component
    componentPreviewCtx.strokeStyle = 'rgba(58, 134, 255, 0.8)';
    componentPreviewCtx.lineWidth = 2;
    componentPreviewCtx.strokeRect(0, 0, width, height);
  }
}

/**
 * Updates WCAG compliance indicators for a component
 */
function updateWCAGCompliance(contrastRatio) {
  // WCAG 2.1 contrast requirements
  const aaPass = contrastRatio >= 4.5;
  const aaLargePass = contrastRatio >= 3;
  const aaaPass = contrastRatio >= 7;
  
  wcagAA.textContent = aaPass ? 'Pass' : 'Fail';
  wcagAA.className = 'value ' + (aaPass ? 'pass' : 'fail');
  
  wcagAALarge.textContent = aaLargePass ? 'Pass' : 'Fail';
  wcagAALarge.className = 'value ' + (aaLargePass ? 'pass' : 'fail');
  
  wcagAAA.textContent = aaaPass ? 'Pass' : 'Fail';
  wcagAAA.className = 'value ' + (aaaPass ? 'pass' : 'fail');
}

/**
 * Updates impact meters for a component
 */
function updateImpactMeters(scores) {
  // Update impact meters
  impactProtanopia.style.width = `${100 - scores.protanopia}%`;
  impactDeuteranopia.style.width = `${100 - scores.deuteranopia}%`;
  impactTritanopia.style.width = `${100 - scores.tritanopia}%`;
  impactAchromatopsia.style.width = `${100 - scores.achromatopsia}%`;
  
  // Update impact values
  impactProtanopiaValue.textContent = scores.protanopia;
  impactDeuteranopiaValue.textContent = scores.deuteranopia;
  impactTritanopiaValue.textContent = scores.tritanopia;
  impactAchromatopsiaValue.textContent = scores.achromatopsia;
}

/**
 * Generates color recommendations for better accessibility
 */
function generateColorRecommendations(component) {
  // Check if component has contrast issues
  const hasContrastIssues = component.textColor && component.contrastRatio < 4.5;
  const hasColorBlindIssues = Object.values(component.accessibilityScores).some(score => score < 70);
  
  if (!hasContrastIssues && !hasColorBlindIssues) {
    colorRecommendations.innerHTML = `
      <p>This component has good accessibility colors. No changes needed.</p>
    `;
    return;
  }
  
  // Generate alternative colors
  let html = '';
  
  if (hasContrastIssues) {
    // Generate better background colors
    const bgAlternatives = generateAlternativeColors(component.color, component.textColor, true);
    
    // Generate better text colors
    const textAlternatives = generateAlternativeColors(component.textColor, component.color, false);
    
    html += `<div class="color-alternatives">`;
    
    // Add background color alternatives
    bgAlternatives.forEach(color => {
      const colorStr = `rgb(${color.r}, ${color.g}, ${color.b})`;
      const hexColor = rgbToHex(color.r, color.g, color.b);
      
      html += `
        <div class="color-recommendation">
          <div class="color-swatch" style="background-color: ${colorStr}"></div>
          <div class="color-value">${hexColor}</div>
          <div class="color-type">Background</div>
        </div>
      `;
    });
    
    // Add text color alternatives
    textAlternatives.forEach(color => {
      const colorStr = `rgb(${color.r}, ${color.g}, ${color.b})`;
      const hexColor = rgbToHex(color.r, color.g, color.b);
      
      html += `
        <div class="color-recommendation">
          <div class="color-swatch" style="background-color: ${colorStr}"></div>
          <div class="color-value">${hexColor}</div>
          <div class="color-type">Text</div>
        </div>
      `;
    });
    
    html += `</div>`;
  } else if (hasColorBlindIssues) {
    // Generate color-blind friendly alternatives
    const alternatives = generateColorBlindFriendlyAlternatives(component);
    
    html += `<div class="color-alternatives">`;
    
    alternatives.forEach(color => {
      const colorStr = `rgb(${color.r}, ${color.g}, ${color.b})`;
      const hexColor = rgbToHex(color.r, color.g, color.b);
      
      html += `
        <div class="color-recommendation">
          <div class="color-swatch" style="background-color: ${colorStr}"></div>
          <div class="color-value">${hexColor}</div>
          <div class="color-type">${color.type}</div>
        </div>
      `;
    });
    
    html += `</div>`;
  }
  
  colorRecommendations.innerHTML = html;
}

/**
 * Generates alternative colors with better contrast
 */
function generateAlternativeColors(color, contrastColor, isBg) {
  const alternatives = [];
  
  // Adjust brightness to improve contrast
  const adjustBrightness = (color, amount) => {
    return {
      r: Math.min(255, Math.max(0, Math.round(color.r + amount))),
      g: Math.min(255, Math.max(0, Math.round(color.g + amount))),
      b: Math.min(255, Math.max(0, Math.round(color.b + amount)))
    };
  };
  
  // Determine if we need to lighten or darken
  const getLuminance = (color) => {
    const srgb = [color.r / 255, color.g / 255, color.b / 255];
    const rgb = srgb.map(val => {
      if (val <= 0.03928) return val / 12.92;
      return Math.pow((val + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  };
  
  const colorLuminance = getLuminance(color);
  const contrastLuminance = getLuminance(contrastColor);
  
  // For background, if text is darker, lighten the background; if text is lighter, darken the background
  // For text, do the opposite
  let direction = 1;
  if (isBg) {
    direction = colorLuminance < contrastLuminance ? 1 : -1;
  } else {
    direction = colorLuminance < contrastLuminance ? -1 : 1;
  }
  
  // Generate 3 alternatives with increasing contrast
  for (let i = 1; i <= 3; i++) {
    const adjustmentAmount = direction * i * 50;
    const newColor = adjustBrightness(color, adjustmentAmount);
    
    // Check if new contrast is better
    const newContrast = calculateContrastRatio(newColor, contrastColor);
    const minContrast = isBg ? 4.5 : 3; // WCAG AA requirements
    
    if (newContrast >= minContrast) {
      alternatives.push(newColor);
      
      // Once we find a good alternative, no need for more
      break;
    }
  }
  
  // If no good alternatives, try shifting hue while maintaining luminance
  if (alternatives.length === 0) {
    // Convert RGB to HSL
    const rgbToHsl = (r, g, b) => {
      r /= 255;
      g /= 255;
      b /= 255;
      
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h, s, l = (max + min) / 2;
      
      if (max === min) {
        h = s = 0; // achromatic
      } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        
        h /= 6;
      }
      
      return { h, s, l };
    };
    
    // Convert HSL to RGB
    const hslToRgb = (h, s, l) => {
      let r, g, b;
      
      if (s === 0) {
        r = g = b = l; // achromatic
      } else {
        const hue2rgb = (p, q, t) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1/6) return p + (q - p) * 6 * t;
          if (t < 1/2) return q;
          if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
          return p;
        };
        
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
      }
      
      return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
      };
    };
    
    // Get HSL values
    const hsl = rgbToHsl(color.r, color.g, color.b);
    
    // For each hue shift, create a new color
    const hueShifts = [0.25, 0.5, 0.75]; // 90, 180, 270 degrees
    
    for (const shift of hueShifts) {
      const newHue = (hsl.h + shift) % 1;
      const newColor = hslToRgb(newHue, hsl.s, hsl.l);
      
      // Adjust luminance to improve contrast if needed
      let adjustedColor = newColor;
      
      for (let j = 0; j < 5; j++) {
        const adjustmentAmount = direction * j * 20;
        adjustedColor = adjustBrightness(newColor, adjustmentAmount);
        
        const newContrast = calculateContrastRatio(adjustedColor, contrastColor);
        if (newContrast >= minContrast) {
          alternatives.push(adjustedColor);
          break;
        }
      }
      
      if (alternatives.length > 0) {
        break;
      }
    }
  }
  
  // If still no alternatives, provide generic high-contrast options
  if (alternatives.length === 0) {
    if (isBg) {
      // White or black background depending on text color
      alternatives.push(contrastLuminance < 0.5 ? { r: 255, g: 255, b: 255 } : { r: 0, g: 0, b: 0 });
    } else {
      // White or black text depending on background color
      alternatives.push(contrastLuminance < 0.5 ? { r: 0, g: 0, b: 0 } : { r: 255, g: 255, b: 255 });
    }
  }
  
  return alternatives.slice(0, 3);
}

/**
 * Generates color-blind friendly alternatives
 */
function generateColorBlindFriendlyAlternatives(component) {
  const alternatives = [];
  
  // Determine which types of color blindness are problematic
  const problematicTypes = Object.entries(component.accessibilityScores)
    .filter(([type, score]) => score < 70)
    .map(([type]) => type);
  
  if (problematicTypes.length === 0) return alternatives;
  
  // Determine if background or text color needs adjustment
  const adjustBackground = true; // Default to adjusting background
  
  // Color-blind safe palettes
  const safeColors = [
    { r: 0, g: 0, b: 0, name: 'Black' },
    { r: 255, g: 255, b: 255, name: 'White' },
    { r: 230, g: 159, b: 0, name: 'Yellow' },
    { r: 86, g: 180, b: 233, name: 'Blue' },
    { r: 0, g: 158, b: 115, name: 'Green' },
    { r: 240, g: 228, b: 66, name: 'Light Yellow' },
    { r: 0, g: 114, b: 178, name: 'Dark Blue' },
    { r: 213, g: 94, b: 0, name: 'Orange' },
    { r: 204, g: 121, b: 167, name: 'Pink' }
  ];
  
  // Find colors that work well for the problematic types
  const textColor = component.textColor || { r: 0, g: 0, b: 0 };
  
  for (const safeColor of safeColors) {
    // Skip colors too similar to the original
    const colorDistance = Math.sqrt(
      Math.pow(component.color.r - safeColor.r, 2) +
      Math.pow(component.color.g - safeColor.g, 2) +
      Math.pow(component.color.b - safeColor.b, 2)
    );
    
    if (colorDistance < 50) continue;
    
    // Test contrast with text
    const contrast = calculateContrastRatio(safeColor, textColor);
    
    if (contrast >= 4.5) {
      // Test for color blind simulations
      let isGoodForAllTypes = true;
      
      for (const type of problematicTypes) {
        const matrix = colorBlindnessMatrices[type];
        
        // Simulate the safe color
        const simColor = {
          r: safeColor.r * matrix[0] + safeColor.g * matrix[1] + safeColor.b * matrix[2],
          g: safeColor.r * matrix[3] + safeColor.g * matrix[4] + safeColor.b * matrix[5],
          b: safeColor.r * matrix[6] + safeColor.g * matrix[7] + safeColor.b * matrix[8]
        };
        
        // Simulate the text color
        const simTextColor = {
          r: textColor.r * matrix[0] + textColor.g * matrix[1] + textColor.b * matrix[2],
          g: textColor.r * matrix[3] + textColor.g * matrix[4] + textColor.b * matrix[5],
          b: textColor.r * matrix[6] + textColor.g * matrix[7] + textColor.b * matrix[8]
        };
        
        // Check contrast in simulated view
        const simContrast = calculateContrastRatio(simColor, simTextColor);
        
        if (simContrast < 3) {
          isGoodForAllTypes = false;
          break;
        }
      }
      
      if (isGoodForAllTypes) {
        alternatives.push({
          r: safeColor.r,
          g: safeColor.g,
          b: safeColor.b,
          type: `Background (${safeColor.name})`
        });
        
               if (alternatives.length >= 3) {
          break;
        }
      }
    }
  }
  
  // If we couldn't find good alternatives, add some generic options
  if (alternatives.length === 0) {
    // Add safe colors for color blindness
    alternatives.push({
      r: 0, g: 0, b: 0, 
      type: 'Background (Black)'
    });
    
    alternatives.push({
      r: 255, g: 255, b: 255,
      type: 'Background (White)'
    });
    
    alternatives.push({
      r: 0, g: 114, b: 178, 
      type: 'Background (Blue)'
    });
  }
  
  return alternatives.slice(0, 3);
}break;
        }
      }
    }
  }
  
