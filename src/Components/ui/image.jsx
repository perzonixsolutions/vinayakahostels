import { forwardRef, useState } from 'react'
import './image.css'
import { cn } from '@/lib/utils';

const FALLBACK_IMAGE_URL = "https://static.wixstatic.com/media/12d367_4f26ccd17f8f4e3a8958306ea08c2332~mv2.png";

export const Image = forwardRef(
    ({ src, className, alt, ...props }, ref) => {
        const [imgSrc, setImgSrc] = useState(src || FALLBACK_IMAGE_URL)

        return (
            <img
                ref={ref}
                src={imgSrc}
                alt={alt || "Image"}
                className={cn('inline-block relative', className)}
                onError={() => setImgSrc(FALLBACK_IMAGE_URL)}
                {...props}
            />
        )
    }
)
Image.displayName = 'Image'
