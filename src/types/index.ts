export interface Appeal {
    id: string;
    title: string;
    description: string;
    raised: number;
    goal: number;
    imageUrl?: string;
    isUrgent?: boolean;
}

export interface Post {
    id: string;
    title: string;
    date: string; // ISO date string or formatted
    excerpt?: string;
    imageUrl?: string;
    link?: string;
}
