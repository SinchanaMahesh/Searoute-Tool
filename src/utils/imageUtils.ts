
export const fallbackImages = {
  cruise: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
  port: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600',
  destination: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400',
  ship: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800',
  location: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600'
};

export const getImageWithFallback = (primaryUrl?: string, fallbackType: keyof typeof fallbackImages = 'cruise') => {
  return primaryUrl || fallbackImages[fallbackType];
};

export const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>, fallbackType: keyof typeof fallbackImages = 'cruise') => {
  const img = event.currentTarget;
  if (img.src !== fallbackImages[fallbackType]) {
    img.src = fallbackImages[fallbackType];
  }
};
