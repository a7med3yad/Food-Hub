// Utility function to get the correct image path for both development and production
export const getImagePath = (imagePath) => {
  // If the path already starts with http or data, return as is
  if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
    return imagePath;
  }
  
  // Use PUBLIC_URL for GitHub Pages deployment, or empty string for development
  const publicUrl = process.env.PUBLIC_URL || '';
  
  // Ensure the image path starts with a slash
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  // Combine publicUrl and cleanPath, avoiding double slashes
  if (publicUrl) {
    // Remove trailing slash from publicUrl if present
    const baseUrl = publicUrl.endsWith('/') ? publicUrl.slice(0, -1) : publicUrl;
    return `${baseUrl}${cleanPath}`;
  }
  
  // In development, just return the path with leading slash
  return cleanPath;
};

