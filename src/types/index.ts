export interface Project {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    category: 'feeding' | 'education' | 'medical' | 'empowerment' | 'emergency';
    date: string;
}

export interface GalleryItem {
    id: string;
    url: string;
    type: 'image' | 'video';
    title?: string;
    description?: string;
    category?: string;
}

export interface Donation {
    id: string;
    amount: number;
    currency: string;
    email: string;
    reference: string;
    status: 'success' | 'failed' | 'pending';
    date: any; // Firestore Timestamp
}
