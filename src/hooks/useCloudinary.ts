import { useState } from 'react';

export const useCloudinary = () => {
    const [uploading, setUploading] = useState(false);
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    const uploadImage = async (file: File) => {
        setUploading(true);

        try {
            if (!cloudName || !uploadPreset) {
                throw new Error(
                    'Cloudinary configuration is missing. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.'
                );
            }

            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', uploadPreset);
            formData.append('folder', 'al-ihsan');

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            if (!response.ok) {
                throw new Error('Cloudinary upload failed.');
            }

            const data = (await response.json()) as {
                secure_url?: string;
                resource_type?: string;
            };

            if (!data.secure_url) {
                throw new Error('Cloudinary upload did not return a media URL.');
            }

            setUploading(false);
            return {
                url: data.secure_url,
                type: data.resource_type || file.type,
            };
        } catch (error) {
            console.error('Upload failed:', error);
            setUploading(false);
            return null;
        }
    };

    return { uploadImage, uploading };
};
