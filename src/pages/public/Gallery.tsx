import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, Loader } from 'lucide-react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import SEO from '../../components/common/SEO';
import { useAnimations } from '../../hooks/useAnimations';

const categories = ["All", "Food Relief", "Medical", "Education", "Orphans"];

interface GalleryImage {
    id: string;
    url: string;
    category: string;
    title: string;
}

const Gallery: React.FC = () => {
    const { slideInLeft, fadeInUp, staggerContainer } = useAnimations();
    const [activeCategory, setActiveCategory] = useState("All");
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

    useEffect(() => {
        const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedImages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as GalleryImage));
            setImages(fetchedImages);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const filteredImages = activeCategory === "All"
        ? images
        : images.filter(img => img.category === activeCategory);

    return (
        <div className="bg-gray-50 min-h-screen py-20">
            <SEO
                title="Gallery"
                description="View our impact in pictures. Al-Ihsan Relief gallery showcasing food distribution, medical camps, and educational support."
            />
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <motion.h1 variants={slideInLeft} initial="hidden" animate="visible" className="text-4xl md:text-5xl font-heading font-bold text-primary-900 mb-4">Our Impact in Pictures</motion.h1>
                    <motion.p variants={fadeInUp} initial="hidden" animate="visible" className="text-gray-600 max-w-2xl mx-auto">
                        Witness the joy and relief your donations bring to the community.
                    </motion.p>
                </div>

                {/* Filter Buttons */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-wrap justify-center gap-4 mb-12"
                >
                    {categories.map((cat) => (
                        <motion.button
                            key={cat}
                            variants={fadeInUp}
                            onClick={() => setActiveCategory(cat)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat
                                ? 'bg-gold-500 text-white shadow-lg'
                                : 'bg-white text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {cat}
                        </motion.button>
                    ))}
                </motion.div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center py-20">
                        <Loader className="animate-spin text-gold-500" size={40} />
                    </div>
                )}

                {/* Empty State */}
                {!loading && images.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-gray-500">No images uploaded yet. Check back soon!</p>
                    </div>
                )}

                {/* Grid */}
                <motion.div
                    layout
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    <AnimatePresence>
                        {filteredImages.map((img) => (
                            <motion.div
                                layout
                                variants={fadeInUp}
                                initial="hidden"
                                animate="visible"
                                exit={{ opacity: 0, scale: 0.9 }}
                                key={img.id}
                                className="group relative rounded-2xl overflow-hidden shadow-md cursor-pointer aspect-[4/3] bg-gray-200"
                                onClick={() => setSelectedImage(img)}
                            >
                                <img src={img.url} alt={img.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-primary-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <div className="text-center text-white px-4">
                                        <ZoomIn size={32} className="mx-auto mb-2 text-gold-400" />
                                        <h3 className="text-xl font-bold font-heading">{img.title}</h3>
                                        <p className="text-sm text-gold-200">{img.category}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
                        onClick={() => setSelectedImage(null)}
                    >
                        <button className="absolute top-6 right-6 text-white hover:text-gold-400 transition-colors">
                            <X size={32} />
                        </button>
                        <motion.img
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            src={selectedImage.url}
                            alt={selectedImage.title}
                            className="max-w-full max-h-[90vh] rounded-lg shadow-2xl border-2 border-primary-900"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <div className="absolute bottom-6 left-0 w-full text-center text-white">
                            <h3 className="text-2xl font-bold font-heading">{selectedImage.title}</h3>
                            <p className="text-gold-400">{selectedImage.category}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Gallery;
