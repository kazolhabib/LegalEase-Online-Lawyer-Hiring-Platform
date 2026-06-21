'use strict';

const MAX_IMAGE_SIZE = 900;
const JPEG_QUALITY = 0.82;

const compressImageToDataUrl = (file) => new Promise((resolve, reject) => {
  const objectUrl = URL.createObjectURL(file);
  const image = new Image();

  image.onload = () => {
    const scale = Math.min(1, MAX_IMAGE_SIZE / Math.max(image.width, image.height));
    const width = Math.max(1, Math.round(image.width * scale));
    const height = Math.max(1, Math.round(image.height * scale));
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Image processing is not supported in this browser.'));
      return;
    }

    canvas.width = width;
    canvas.height = height;
    context.drawImage(image, 0, 0, width, height);
    URL.revokeObjectURL(objectUrl);
    resolve(canvas.toDataURL('image/jpeg', JPEG_QUALITY));
  };

  image.onerror = () => {
    URL.revokeObjectURL(objectUrl);
    reject(new Error('Could not read the selected image.'));
  };

  image.src = objectUrl;
});

export const uploadImageWithFallback = async (file, apiKey = '') => {
  if (!file?.type?.startsWith('image/')) {
    throw new Error('Please choose a valid image file.');
  }

  if (apiKey) {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.success && data.data?.display_url) {
        return {
          url: data.data.display_url,
          message: 'Image uploaded successfully!'
        };
      }

      console.warn('ImgBB upload failed, using local image fallback:', data);
    } catch (err) {
      console.warn('ImgBB upload error, using local image fallback:', err);
    }
  }

  const dataUrl = await compressImageToDataUrl(file);
  return {
    url: dataUrl,
    message: 'Image processed successfully. Save changes to update your profile.'
  };
};
