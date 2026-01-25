import { useState } from 'react';

export const useCloudinary = () => {
    const [uploading, setUploading] = useState(false);

    const uploadImage = async (file: File) => {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'al_ihsan_preset'); // Replace with actual preset
        formData.append('cloud_name', 'djakb290'); // Replace with actual cloud name

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/djakb290/auto/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );
            const data = await response.json();
            setUploading(false);
            return { url: data.secure_url, type: data.resource_type };
        } catch (error) {
            console.error('Upload failed:', error);
            setUploading(false);
            return null;
        }
    };

    return { uploadImage, uploading };
};
