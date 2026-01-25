import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Appeal, Post } from '../types';

export const useAppeals = () => {
    const [appeals, setAppeals] = useState<Appeal[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAppeals = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'appeals'));
                const data: Appeal[] = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as Appeal));
                setAppeals(data);
            } catch (error) {
                console.error("Error fetching appeals:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAppeals();
    }, []);

    return { appeals, loading };
};

export const usePosts = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'posts'));
                const data: Post[] = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as Post));
                setPosts(data);
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    return { posts, loading };
};
