import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, Loader, Play, Film, ChevronLeft, Calendar, Tag } from 'lucide-react';
import SEO from '../../components/common/SEO';
import { useAnimations } from '../../hooks/useAnimations';
import { supabase } from '../../lib/supabase';

const categories = ["All", "Food Relief", "Medical", "Education", "Orphans", "Events", "Videos"];

interface GalleryItem {
    id: string;
    url: string;
    category: string;
    title: string;
    description: string;
    mediaType: 'image' | 'video' | 'video_link';
    source: 'gallery' | 'videos';
    createdAt: string;
}

const isVideoFile = (url: string) => /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);

const getEmbedUrl = (url: string): string | null => {
    try {
        const parsed = new URL(url);
        if (parsed.hostname.includes('youtube.com') || parsed.hostname.includes('youtu.be')) {
            const videoId = parsed.hostname.includes('youtu.be')
                ? parsed.pathname.slice(1)
                : parsed.searchParams.get('v');
            return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
        }
        if (parsed.hostname.includes('vimeo.com')) {
            const videoId = parsed.pathname.split('/').filter(Boolean).pop();
            return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
        }
    } catch { /* ignore */ }
    return null;
};

const getYouTubeThumbnail = (url: string): string | null => {
    try {
        const parsed = new URL(url);
        let videoId: string | null = null;
        if (parsed.hostname.includes('youtu.be')) {
            videoId = parsed.pathname.slice(1);
        } else if (parsed.hostname.includes('youtube.com')) {
            videoId = parsed.searchParams.get('v');
        }
        return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
    } catch { return null; }
};

const formatDate = (v: string) =>
    new Date(v).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

const Gallery: React.FC = () => {
    const { slideInLeft, fadeInUp, staggerContainer } = useAnimations();
    const [activeCategory, setActiveCategory] = useState("All");
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

    useEffect(() => {
        const loadMedia = async () => {
            try {
                const [galleryRes, videosRes] = await Promise.all([
                    supabase.from('gallery').select('*').order('created_at', { ascending: false }),
                    supabase.from('videos').select('*').order('created_at', { ascending: false }),
                ]);

                const galleryItems: GalleryItem[] = (galleryRes.data ?? []).map((row: any) => ({
                    id: row.id,
                    url: row.url,
                    category: row.category ?? 'General',
                    title: row.title ?? '',
                    description: row.description ?? '',
                    mediaType: row.media_type === 'video' ? 'video' : 'image',
                    source: 'gallery' as const,
                    createdAt: row.created_at ?? new Date().toISOString(),
                }));

                const videoItems: GalleryItem[] = (videosRes.data ?? []).map((row: any) => ({
                    id: `vid-${row.id}`,
                    url: row.url,
                    category: row.category ?? 'Videos',
                    title: row.title ?? '',
                    description: row.description ?? '',
                    mediaType: 'video_link' as const,
                    source: 'videos' as const,
                    createdAt: row.created_at ?? new Date().toISOString(),
                }));

                setItems([...galleryItems, ...videoItems]);
            } catch (e) {
                console.error('Failed to load media:', e);
            }
            setLoading(false);
        };

        loadMedia();

        const channel = supabase
            .channel('gallery_realtime')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'gallery' },
                () => { loadMedia(); }
            )
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    const filteredItems = activeCategory === "All"
        ? items
        : activeCategory === "Videos"
            ? items.filter(i => i.mediaType === 'video' || i.mediaType === 'video_link')
            : items.filter(i => i.category === activeCategory);

    const isVideo = (item: GalleryItem) => item.mediaType === 'video' || item.mediaType === 'video_link';

    // Get related items (same category, excluding selected)
    const relatedItems = selectedItem
        ? items.filter(i => i.id !== selectedItem.id && i.category === selectedItem.category).slice(0, 6)
        : [];

    return (
        <div className="bg-gray-50 min-h-screen py-20">
            <SEO
                title="Media Gallery"
                description="View our impact in pictures and videos. Al-Ihsan Relief gallery showcasing food distribution, medical camps, educational support, and community events."
            />
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <motion.h1 variants={slideInLeft} initial="hidden" animate="visible" className="text-4xl md:text-5xl font-heading font-bold text-primary-900 mb-4">Our Impact in Pictures & Videos</motion.h1>
                    <motion.p variants={fadeInUp} initial="hidden" animate="visible" className="text-gray-600 max-w-2xl mx-auto">
                        Witness the joy and relief your donations bring to the community.
                    </motion.p>
                </div>

                {/* Filter Buttons */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-wrap justify-center gap-3 mb-12"
                >
                    {categories.map((cat) => (
                        <motion.button
                            key={cat}
                            variants={fadeInUp}
                            onClick={() => setActiveCategory(cat)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${activeCategory === cat
                                ? 'bg-gold-500 text-white shadow-lg'
                                : 'bg-white text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {cat === 'Videos' && <Film size={14} />}
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
                {!loading && items.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-gray-500">No media uploaded yet. Check back soon!</p>
                    </div>
                )}

                {/* Grid */}
                <motion.div
                    layout
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    <AnimatePresence>
                        {filteredItems.map((item) => (
                            <motion.div
                                layout
                                variants={fadeInUp}
                                initial="hidden"
                                animate="visible"
                                exit={{ opacity: 0, scale: 0.9 }}
                                key={item.id}
                                className="group cursor-pointer"
                                onClick={() => setSelectedItem(item)}
                            >
                                {/* Thumbnail Container */}
                                <div className="relative rounded-2xl overflow-hidden shadow-md aspect-[4/3] bg-gray-200">
                                    {item.mediaType === 'image' ? (
                                        <img src={item.url} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    ) : item.mediaType === 'video' && isVideoFile(item.url) ? (
                                        <video src={item.url} className="w-full h-full object-cover" preload="metadata" muted />
                                    ) : item.mediaType === 'video_link' ? (
                                        <div className="w-full h-full bg-primary-900 relative">
                                            {getYouTubeThumbnail(item.url) ? (
                                                <img src={getYouTubeThumbnail(item.url)!} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Film size={48} className="text-gold-400 opacity-50" />
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="w-full h-full bg-primary-900 flex items-center justify-center">
                                            <Film size={48} className="text-gold-400 opacity-50" />
                                        </div>
                                    )}

                                    {/* Video Play Badge */}
                                    {isVideo(item) && (
                                        <div className="absolute top-3 left-3 bg-primary-900/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                            <Play size={10} fill="currentColor" /> Video
                                        </div>
                                    )}

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-primary-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        {isVideo(item) ? <Play size={48} className="text-gold-400 drop-shadow-lg" fill="currentColor" /> : <ZoomIn size={48} className="text-gold-400 drop-shadow-lg" />}
                                    </div>
                                </div>

                                {/* Title + Category Below Card */}
                                <div className="mt-3 px-1">
                                    <h3 className="font-heading font-bold text-primary-900 text-base line-clamp-1">{item.title || 'Untitled'}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-gold-600 font-medium">{item.category}</span>
                                        {isVideo(item) && (
                                            <span className="text-[10px] bg-primary-100 text-primary-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Video</span>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Detail View Modal */}
            <AnimatePresence>
                {selectedItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm overflow-y-auto"
                        onClick={() => setSelectedItem(null)}
                    >
                        <div className="min-h-screen flex flex-col">
                            {/* Top Bar */}
                            <div className="flex items-center justify-between p-4 md:p-6 sticky top-0 z-10 bg-gradient-to-b from-black/80 to-transparent">
                                <button
                                    onClick={(e) => { e.stopPropagation(); setSelectedItem(null); }}
                                    className="flex items-center gap-2 text-white/80 hover:text-white transition-colors font-medium text-sm"
                                >
                                    <ChevronLeft size={20} /> Back to Gallery
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setSelectedItem(null); }}
                                    className="text-white/60 hover:text-white transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 flex items-center justify-center px-4 pb-8" onClick={(e) => e.stopPropagation()}>
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.9, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="w-full max-w-5xl"
                                >
                                    {/* Media */}
                                    <div className="rounded-2xl overflow-hidden shadow-2xl bg-black">
                                        {selectedItem.mediaType === 'image' && (
                                            <img
                                                src={selectedItem.url}
                                                alt={selectedItem.title}
                                                className="w-full max-h-[70vh] object-contain mx-auto"
                                                onContextMenu={(e) => e.preventDefault()}
                                            />
                                        )}

                                        {selectedItem.mediaType === 'video' && (
                                            <video
                                                src={selectedItem.url}
                                                className="w-full max-h-[70vh]"
                                                controls
                                                autoPlay
                                                controlsList="nodownload"
                                                onContextMenu={(e) => e.preventDefault()}
                                            />
                                        )}

                                        {selectedItem.mediaType === 'video_link' && getEmbedUrl(selectedItem.url) && (
                                            <div className="aspect-video">
                                                <iframe
                                                    src={`${getEmbedUrl(selectedItem.url)!}?autoplay=1`}
                                                    className="w-full h-full"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Details Section */}
                                    <div className="mt-6 bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10">
                                        <div className="flex flex-wrap items-center gap-3 mb-4">
                                            <span className="bg-gold-500/20 text-gold-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                                                <Tag size={12} /> {selectedItem.category}
                                            </span>
                                            {isVideo(selectedItem) && (
                                                <span className="bg-primary-500/20 text-primary-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                                                    <Film size={12} /> Video
                                                </span>
                                            )}
                                            <span className="text-white/40 text-xs flex items-center gap-1.5 ml-auto">
                                                <Calendar size={12} /> {formatDate(selectedItem.createdAt)}
                                            </span>
                                        </div>

                                        <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4">
                                            {selectedItem.title || 'Untitled'}
                                        </h2>

                                        {selectedItem.description && (
                                            <p className="text-white/70 leading-relaxed text-base md:text-lg whitespace-pre-line">
                                                {selectedItem.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Related Media */}
                                    {relatedItems.length > 0 && (
                                        <div className="mt-8">
                                            <h3 className="text-lg font-bold text-white/80 mb-4 font-heading">More from {selectedItem.category}</h3>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                {relatedItems.map(item => (
                                                    <div
                                                        key={item.id}
                                                        className="cursor-pointer group/related"
                                                        onClick={() => setSelectedItem(item)}
                                                    >
                                                        <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-gray-800">
                                                            {item.mediaType === 'image' ? (
                                                                <img src={item.url} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 group-hover/related:scale-110" />
                                                            ) : item.mediaType === 'video_link' && getYouTubeThumbnail(item.url) ? (
                                                                <img src={getYouTubeThumbnail(item.url)!} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 group-hover/related:scale-110" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center bg-primary-900">
                                                                    <Film size={24} className="text-gold-400/50" />
                                                                </div>
                                                            )}
                                                            {isVideo(item) && (
                                                                <div className="absolute inset-0 flex items-center justify-center">
                                                                    <Play size={24} className="text-white drop-shadow-lg" fill="currentColor" />
                                                                </div>
                                                            )}
                                                            <div className="absolute inset-0 bg-black/0 group-hover/related:bg-black/30 transition-colors" />
                                                        </div>
                                                        <p className="text-white/60 text-xs mt-2 line-clamp-1 font-medium">{item.title}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Gallery;
