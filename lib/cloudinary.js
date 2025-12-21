/**
 * Upload file to Cloudinary
 * @param {File} file - File object from input
 * @param {string} folder - Cloudinary folder name (optional)
 * @returns {Promise<{url: string, publicId: string}>}
 */
export async function uploadToCloudinary(file, folder = 'kitobdosh') {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || 'Upload failed');
  }

  return {
    url: data.url,
    publicId: data.publicId
  };
}

/**
 * Delete file from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<boolean>}
 */
export async function deleteFromCloudinary(publicId) {
  const response = await fetch('/api/upload', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ publicId })
  });

  const data = await response.json();
  return data.success;
}

/**
 * Get optimized Cloudinary URL with transformations
 * @param {string} url - Original Cloudinary URL
 * @param {object} options - Transformation options
 * @returns {string} - Transformed URL
 */
export function getOptimizedImageUrl(url, options = {}) {
  if (!url || !url.includes('cloudinary.com')) return url;

  const {
    width = 'auto',
    height = 'auto',
    crop = 'fill',
    quality = 'auto',
    format = 'auto'
  } = options;

  // Insert transformations into URL
  const parts = url.split('/upload/');
  if (parts.length !== 2) return url;

  const transformation = `w_${width},h_${height},c_${crop},q_${quality},f_${format}`;
  return `${parts[0]}/upload/${transformation}/${parts[1]}`;
}
