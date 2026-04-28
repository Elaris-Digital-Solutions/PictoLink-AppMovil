import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'PictoLink',
    short_name: 'PictoLink',
    description: 'Augmentative and Alternative Communication via pictograms',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    // 'any' here lets the OS follow device rotation. We lock to landscape
    // dynamically via screen.orientation.lock() only for AAC users on AAC routes.
    // Caregivers and onboarding users follow device orientation freely.
    orientation: 'any',
    background_color: '#ffffff',
    theme_color: '#FF8844',
    categories: ['education', 'medical', 'utilities'],
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
