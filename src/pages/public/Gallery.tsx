import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

const Gallery: React.FC = () => {
    return (
        <div className="w-full">
            <section className="bg-emerald-900 py-20 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Our Gallery</h1>
                    <p className="max-w-xl mx-auto text-emerald-100 text-lg">
                        See the impact of your donations through our activities and events.
                    </p>
                </div>
            </section>

            <section className="py-20">
                <div className="container mx-auto px-4">
                    {/* Placeholder for Gallery Grid - Will be populated from Cloudinary/Firestore */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                            <div key={item} className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                                <ImageIcon size={48} />
                            </div>
                        ))}
                    </div>
                    <p className="text-center text-gray-500 mt-8">Gallery is being integrated with Cloudinary/Firestore.</p>
                </div>
            </section>
        </div>
    );
};

export default Gallery;
