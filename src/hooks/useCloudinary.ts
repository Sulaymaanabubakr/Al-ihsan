import { useState } from 'react';

export const useCloudinary = () => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const uploadImage = async (file: File) => {
        setUploading(true);
        setError(null);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'unsigned_preset');

        try {
            const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
            if (!cloudName) throw new Error('Cloudinary cloud name is missing');

            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Upload failed');
            const data = await response.json();
            return data.secure_url;
        } catch (err: any) {
            setError(err.message);
            return null;
        } finally {
            setUploading(false);
        }
    };

    return { uploadImage, uploading, error };
};
