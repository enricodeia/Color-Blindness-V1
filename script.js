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

// Canvases
const originalCanvas = document.getElementById('original-canvas');
const simulationCanvas = document.getElementById('simulation-canvas');
const gridOriginalCanvas = document.getElementById('grid-original-canvas');
const gridProtanopiaCanvas = document.getElementById('grid-protanopia-canvas');
const gridDeuteranopiaCanvas = document.getElementById('grid-deuteranopia-canvas');
const gridTritanopiaCanvas = document.getElementById('grid-tritanopia-canvas');
const gridAchromatopsiaCanvas = document.getElementById('grid-achromatopsia-canvas');

// Canvas contexts
const originalCtx = originalCanvas.getContext('2d');
const simulationCtx = simulationCanvas.getContext('2d');
const gridOriginalCtx = gridOriginalCanvas.getContext('2d');
const gridProtanopiaCtx = gridProtanopiaCanvas.getContext('2d');
const gridDeuteranopiaCtx = gridDeuteranopiaCanvas.getContext('2d');
const gridTritanopiaCtx = gridTritanopiaCanvas.getContext('2d');
const gridAchromatopsiaCtx = gridAchromatopsiaCanvas.getContext('2d');

// Current state
let currentImage = null;
let currentSimulationType = 'original';
let isGridView = false;

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
    originalCanvas, simulationCanvas,
    gridOriginalCanvas, gridProtanopiaCanvas, 
    gridDeuteranopiaCanvas, gridTritanopiaCanvas, 
    gridAchromatopsiaCanvas
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

// Initialize theme icons
updateThemeIcons();
