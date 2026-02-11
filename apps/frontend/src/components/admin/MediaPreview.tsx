import React, { useState } from 'react';
import { Image as ImageIcon, Video, FileQuestion } from 'lucide-react';

interface MediaPreviewProps {
    imageUrl?: string;
    videoUrl?: string;
    galleryImages?: string[];
    label?: string;
    maxWidth?: string;
}

const MediaPreview: React.FC<MediaPreviewProps> = ({
    imageUrl,
    videoUrl,
    galleryImages,
    label = 'Media',
    maxWidth = '400px'
}) => {
    const [imageError, setImageError] = useState(false);
    const [videoError, setVideoError] = useState(false);
    const [selectedGalleryIndex, setSelectedGalleryIndex] = useState(0);

    const hasMedia = imageUrl || videoUrl || (galleryImages && galleryImages.length > 0);

    if (!hasMedia) {
        return (
            <div
                className="flex flex-col items-center justify-center p-8 bg-gray-800/20 rounded-lg border border-gray-700/50"
                style={{ maxWidth }}
            >
                <FileQuestion size={48} className="text-gray-600 mb-2" />
                <p className="text-gray-500 text-sm">No media available</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {label && (
                <label className="block text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    {label}
                </label>
            )}

            {/* Gallery Images */}
            {galleryImages && galleryImages.length > 0 && (
                <div className="space-y-2">
                    <div className="relative rounded-lg overflow-hidden border border-gray-700/50 bg-gray-900" style={{ maxWidth }}>
                        {!imageError ? (
                            <img
                                src={galleryImages[selectedGalleryIndex]}
                                alt={`Gallery ${selectedGalleryIndex + 1}`}
                                className="w-full h-auto object-contain"
                                style={{ maxHeight: '400px' }}
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center p-12 bg-gray-800/20">
                                <ImageIcon size={48} className="text-gray-600 mb-2" />
                                <p className="text-gray-500 text-sm">Failed to load image</p>
                            </div>
                        )}
                    </div>

                    {/* Gallery Thumbnails */}
                    <div className="flex gap-2 flex-wrap">
                        {galleryImages.map((img, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setSelectedGalleryIndex(index);
                                    setImageError(false);
                                }}
                                className={`relative w-16 h-16 rounded border-2 transition-all ${selectedGalleryIndex === index
                                        ? 'border-blue-500 ring-2 ring-blue-500/30'
                                        : 'border-gray-700 hover:border-gray-600'
                                    }`}
                            >
                                <img
                                    src={img}
                                    alt={`Thumbnail ${index + 1}`}
                                    className="w-full h-full object-cover rounded"
                                />
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-gray-500">
                        {galleryImages.length} {galleryImages.length === 1 ? 'image' : 'images'} in gallery
                    </p>
                </div>
            )}

            {/* Single Image */}
            {imageUrl && !galleryImages && (
                <div className="relative rounded-lg overflow-hidden border border-gray-700/50 bg-gray-900" style={{ maxWidth }}>
                    {!imageError ? (
                        <img
                            src={imageUrl}
                            alt="Preview"
                            className="w-full h-auto object-contain"
                            style={{ maxHeight: '400px' }}
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center p-12 bg-gray-800/20">
                            <ImageIcon size={48} className="text-gray-600 mb-2" />
                            <p className="text-gray-500 text-sm">Failed to load image</p>
                            <p className="text-gray-600 text-xs mt-1 break-all px-4">{imageUrl}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Video */}
            {videoUrl && (
                <div className="relative rounded-lg overflow-hidden border border-gray-700/50 bg-gray-900" style={{ maxWidth }}>
                    {!videoError ? (
                        <video
                            src={videoUrl}
                            controls
                            className="w-full h-auto"
                            style={{ maxHeight: '400px' }}
                            onError={() => setVideoError(true)}
                        >
                            Your browser does not support the video tag.
                        </video>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-12 bg-gray-800/20">
                            <Video size={48} className="text-gray-600 mb-2" />
                            <p className="text-gray-500 text-sm">Failed to load video</p>
                            <p className="text-gray-600 text-xs mt-1 break-all px-4">{videoUrl}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MediaPreview;
