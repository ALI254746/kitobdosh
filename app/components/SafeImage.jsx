"use client";

import { useState } from "react";
import Image from "next/image";

/**
 * SafeImage - Next/Image wrapper with error handling and fallback
 * @param {string} src - Image URL (Cloudinary or other)
 * @param {string} fallbackSrc - Fallback image URL if main src fails
 * @param {string} alt - Alt text
 * @param {object} rest - Other Image props (fill, width, height, className, etc.)
 */
export default function SafeImage({ 
    src, 
    fallbackSrc = "https://placehold.co/400x600?text=No+Image", 
    alt = "Image", 
    ...rest 
}) {
    const [imgSrc, setImgSrc] = useState(src || fallbackSrc);
    const [hasError, setHasError] = useState(false);

    const handleError = () => {
        if (!hasError) {
            console.warn(`Image failed to load: ${imgSrc}. Using fallback.`);
            setImgSrc(fallbackSrc);
            setHasError(true);
        }
    };

    return (
        <Image
            {...rest}
            src={imgSrc}
            alt={alt}
            onError={handleError}
        />
    );
}
