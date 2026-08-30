import { describe, expect, it } from 'vitest';

import { extractPublicId, ownsPublicId, userFolder } from '@/lib/cloudinary';

// SEC-1: `/api/cloudinary/delete` authorises by public_id prefix, so these
// assertions are the authorisation rule itself. A regression here re-opens
// "any signed-in user can destroy any image in the account".

const UID   = '3f1a9c40-2b7e-4d51-9a03-8c6e5d1b7f22';
const OTHER = '8e2b4d17-6c93-4a08-b5f1-2d7c9e4a6b30';

describe('userFolder', () => {
    it('confines a user to their own folder', () => {
        expect(userFolder(UID)).toBe(`users/${UID}`);
    });
});

describe('ownsPublicId', () => {
    it('accepts an id inside the caller own folder', () => {
        expect(ownsPublicId(`users/${UID}/avatar_x9f2`, UID)).toBe(true);
    });

    it('rejects an id inside another user folder', () => {
        expect(ownsPublicId(`users/${OTHER}/avatar_x9f2`, UID)).toBe(false);
    });

    // The trailing slash in the prefix is load-bearing. Without it a plain
    // startsWith would let `users/abc` claim `users/abcdef/...`.
    it('rejects a folder whose name merely starts with the caller id', () => {
        expect(ownsPublicId(`users/${UID}extra/avatar`, UID)).toBe(false);
        expect(ownsPublicId('users/abcdef/avatar', 'abc')).toBe(false);
    });

    // Decided 2026-08-24: images uploaded before SEC-2 carry no folder and so no
    // provable owner. They are refused and their storage leaks — accepted cost.
    // Pinned as a test so nobody "fixes" the leak by re-opening the hole.
    it('rejects a legacy folderless id, leaking its storage on purpose', () => {
        expect(ownsPublicId('avatar_x9f2', UID)).toBe(false);
        expect(ownsPublicId('some_folder/avatar_x9f2', UID)).toBe(false);
    });

    it('rejects traversal segments', () => {
        expect(ownsPublicId(`users/${UID}/../${OTHER}/avatar`, UID)).toBe(false);
    });

    it('rejects empty inputs', () => {
        expect(ownsPublicId('', UID)).toBe(false);
        expect(ownsPublicId(`users/${UID}/avatar`, '')).toBe(false);
    });
});

// The two functions only matter composed: the browser stores a secure_url, and
// deletion feeds that url through extractPublicId before authorising it.
describe('extractPublicId composed with ownsPublicId', () => {
    it('authorises the caller own upload round-tripped through its url', () => {
        const url = `https://res.cloudinary.com/demo/image/upload/v1712345678/users/${UID}/avatar_x9f2.jpg`;
        const publicId = extractPublicId(url);

        expect(publicId).toBe(`users/${UID}/avatar_x9f2`);
        expect(ownsPublicId(publicId!, UID)).toBe(true);
        expect(ownsPublicId(publicId!, OTHER)).toBe(false);
    });

    it('authorises it through a transformation url too', () => {
        const url = `https://res.cloudinary.com/demo/image/upload/c_fill,g_face,h_256,w_256/v1712345678/users/${UID}/avatar_x9f2.jpg`;

        expect(ownsPublicId(extractPublicId(url)!, UID)).toBe(true);
    });
});
