import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TypewriterTextProps {
    texts: string[];
    delay?: number;
    baseText?: string;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({ texts, delay = 100, baseText = "" }) => {
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [currentText, setCurrentText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            const fullText = texts[currentTextIndex];

            if (isDeleting) {
                setCurrentText(fullText.substring(0, currentText.length - 1));
            } else {
                setCurrentText(fullText.substring(0, currentText.length + 1));
            }

            if (!isDeleting && currentText === fullText) {
                setTimeout(() => setIsDeleting(true), 1500); // Wait before deleting
            } else if (isDeleting && currentText === '') {
                setIsDeleting(false);
                setCurrentTextIndex((prev) => (prev + 1) % texts.length);
            }
        }, isDeleting ? delay / 2 : delay);

        return () => clearTimeout(timeout);
    }, [currentText, isDeleting, currentTextIndex, texts, delay]);

    return (
        <span>
            {baseText} <span className="text-gold-500 italic">{currentText}</span>
            <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                className="inline-block w-[3px] h-[1em] bg-gold-500 ml-1 align-middle"
            />
        </span>
    );
};

export default TypewriterText;
