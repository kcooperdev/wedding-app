import {
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    doc,
    setDoc,
    deleteDoc,
    serverTimestamp
} from "firebase/firestore";
import {
    ref,
    uploadBytes,
    getDownloadURL
} from "firebase/storage";
import { db, storage } from "./firebase";

// MOCK DATA STORE (LocalStorage based for cross-tab sync)
const STORAGE_KEYS = {
    PHOTOS: 'mock_photos',
    GUESTS: 'mock_guests',
    MESSAGES: 'mock_messages'
};

const MOCK_DELAY = 300;
const USE_MOCK = true;

// Initial Data Seeding - Wedding-themed mock photos
if (typeof window !== 'undefined') {
    const existingPhotos = localStorage.getItem(STORAGE_KEYS.PHOTOS);
    if (!existingPhotos || JSON.parse(existingPhotos).length === 0) {
        const mockPhotos = [
            { id: '1', url: 'https://images.unsplash.com/photo-1519741497674-61d48d22ee31?w=800&h=800&fit=crop&q=80', uploaderName: 'Sarah', timestamp: Date.now() },
            { id: '2', url: 'https://images.unsplash.com/photo-1511285560982-1351cdeb9821?w=800&h=800&fit=crop&q=80', uploaderName: 'Michael', timestamp: Date.now() - 10000 },
            { id: '3', url: 'https://images.unsplash.com/photo-1520854221256-17451cc330e7?w=800&h=800&fit=crop&q=80', uploaderName: 'Emma', timestamp: Date.now() - 20000 },
            { id: '4', url: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=800&h=800&fit=crop&q=80', uploaderName: 'James', timestamp: Date.now() - 30000 },
            { id: '5', url: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=800&h=800&fit=crop&q=80', uploaderName: 'Olivia', timestamp: Date.now() - 40000 },
            { id: '6', url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&h=800&fit=crop&q=80', uploaderName: 'David', timestamp: Date.now() - 50000 },
            { id: '7', url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=800&fit=crop&q=80', uploaderName: 'Sophia', timestamp: Date.now() - 60000 },
            { id: '8', url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&h=800&fit=crop&q=80', uploaderName: 'Ryan', timestamp: Date.now() - 70000 },
            { id: '9', url: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=800&h=800&fit=crop&q=80', uploaderName: 'Isabella', timestamp: Date.now() - 80000 },
            { id: '10', url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&h=800&fit=crop&q=80', uploaderName: 'Matthew', timestamp: Date.now() - 90000 }
        ];
        localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(mockPhotos));
    }
}

// Helper: Read/Write
const getStore = (key) => {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem(key) || '[]');
};
const setStore = (key, data) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(data));
    // Dispatch event for same-tab listeners
    window.dispatchEvent(new Event('local-storage-update'));
};

// --- PHOTOS ---

export async function uploadPhoto(file, userId, userName) {
    if (USE_MOCK) {
        return new Promise(resolve => {
            setTimeout(() => {
                const photos = getStore(STORAGE_KEYS.PHOTOS);
                const newPhoto = {
                    id: Math.random().toString(36),
                    url: URL.createObjectURL(file),
                    uploaderName: userName,
                    uploaderId: userId,
                    timestamp: Date.now()
                };
                photos.unshift(newPhoto);
                setStore(STORAGE_KEYS.PHOTOS, photos);
                resolve(newPhoto.url);
            }, MOCK_DELAY);
        });
    }

    try {
        const filename = `photos/${Date.now()}_${file.name}`;
        const storageRef = ref(storage, filename);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        await addDoc(collection(db, "photos"), {
            url: downloadURL,
            uploaderId: userId,
            uploaderName: userName,
            timestamp: serverTimestamp(),
            storagePath: filename,
        });

        return downloadURL;
    } catch (error) {
        console.error("Error uploading photo:", error);
        throw error;
    }
}

export function subscribeToPhotos(callback) {
    if (USE_MOCK) {
        const load = () => {
            let photos = getStore(STORAGE_KEYS.PHOTOS);
            // Filter out any photos without valid URLs
            photos = photos.filter(photo => photo && photo.url && photo.url.trim() !== '');
            
            // Ensure mock data exists if empty
            if (photos.length === 0 && typeof window !== 'undefined') {
                const mockPhotos = [
                    { id: '1', url: 'https://images.unsplash.com/photo-1519741497674-61d48d22ee31?w=800&h=800&fit=crop&q=80', uploaderName: 'Sarah', timestamp: Date.now() },
                    { id: '2', url: 'https://images.unsplash.com/photo-1511285560982-1351cdeb9821?w=800&h=800&fit=crop&q=80', uploaderName: 'Michael', timestamp: Date.now() - 10000 },
                    { id: '3', url: 'https://images.unsplash.com/photo-1520854221256-17451cc330e7?w=800&h=800&fit=crop&q=80', uploaderName: 'Emma', timestamp: Date.now() - 20000 },
                    { id: '4', url: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=800&h=800&fit=crop&q=80', uploaderName: 'James', timestamp: Date.now() - 30000 },
                    { id: '5', url: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=800&h=800&fit=crop&q=80', uploaderName: 'Olivia', timestamp: Date.now() - 40000 },
                    { id: '6', url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&h=800&fit=crop&q=80', uploaderName: 'David', timestamp: Date.now() - 50000 },
                    { id: '7', url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=800&fit=crop&q=80', uploaderName: 'Sophia', timestamp: Date.now() - 60000 },
                    { id: '8', url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&h=800&fit=crop&q=80', uploaderName: 'Ryan', timestamp: Date.now() - 70000 },
                    { id: '9', url: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=800&h=800&fit=crop&q=80', uploaderName: 'Isabella', timestamp: Date.now() - 80000 },
                    { id: '10', url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&h=800&fit=crop&q=80', uploaderName: 'Matthew', timestamp: Date.now() - 90000 }
                ];
                setStore(STORAGE_KEYS.PHOTOS, mockPhotos);
                photos = mockPhotos;
            } else if (photos.length !== getStore(STORAGE_KEYS.PHOTOS).length) {
                // Clean up invalid photos from storage
                setStore(STORAGE_KEYS.PHOTOS, photos);
            }
            callback(photos);
        };
        load(); // Initial

        const handleStorage = () => load();
        window.addEventListener('storage', handleStorage);
        window.addEventListener('local-storage-update', handleStorage);

        return () => {
            window.removeEventListener('storage', handleStorage);
            window.removeEventListener('local-storage-update', handleStorage);
        };
    }

    const q = query(collection(db, "photos"), orderBy("timestamp", "desc"));
    return onSnapshot(q, (snapshot) => {
        const photos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(photos);
    });
}

export async function deletePhoto(photoId) {
    if (USE_MOCK) {
        const photos = getStore(STORAGE_KEYS.PHOTOS).filter(p => p.id !== photoId);
        setStore(STORAGE_KEYS.PHOTOS, photos);
        return;
    }
    // Note: Deleting from storage requires a separate call or cloud function mostly for security,
    // but we can try client side if rules allow.
    // For now, just delete doc.
    await deleteDoc(doc(db, "photos", photoId));
}

// --- USERS ---

export async function createUser(userId, name) {
    if (USE_MOCK) {
        const guests = getStore(STORAGE_KEYS.GUESTS);
        if (!guests.find(g => g.id === userId)) {
            guests.push({
                id: userId,
                name,
                role: 'guest',
                createdAt: new Date().toISOString()
            });
            setStore(STORAGE_KEYS.GUESTS, guests);
        }
        return;
    }
    await setDoc(doc(db, "users", userId), {
        name,
        role: 'guest',
        createdAt: new Date().toISOString()
    });
}

// --- CHECK-INS ---

export async function updateCheckIn(userId, userName, type, status) {
    if (USE_MOCK) {
        const guests = getStore(STORAGE_KEYS.GUESTS);
        let guest = guests.find(g => g.id === userId);
        if (!guest) {
            guest = { id: userId, name: userName };
            guests.push(guest);
        }
        guest[`checkIn_${type}`] = status;
        guest.lastActive = new Date().toISOString();
        setStore(STORAGE_KEYS.GUESTS, guests);
        return;
    }

    // type is 'ceremony' or 'dinner'
    // status is boolean
    const userRef = doc(db, "users", userId);

    // We can merge this into a 'users' collection or a separate 'checkins' collection.
    // Using 'users' for simplicity and easy admin view.
    await setDoc(userRef, {
        name: userName, // Ensure name is always fresh
        role: 'guest',
        [`checkIn_${type}`]: status,
        lastActive: serverTimestamp()
    }, { merge: true });
}

export function subscribeToGuests(callback) {
    if (USE_MOCK) {
        const load = () => callback(getStore(STORAGE_KEYS.GUESTS));
        load();

        const handleStorage = () => load();
        window.addEventListener('storage', handleStorage);
        window.addEventListener('local-storage-update', handleStorage);

        return () => {
            window.removeEventListener('storage', handleStorage);
            window.removeEventListener('local-storage-update', handleStorage);
        };
    }
    // Only for admin usually
    const q = query(collection(db, "users"), orderBy("lastActive", "desc"));
    return onSnapshot(q, (snapshot) => {
        const guests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(guests);
    });
}

// --- MESSAGING ---

export async function sendMessage(content, senderId, senderName, type = "guest-to-couple") {
    if (USE_MOCK) {
        const messages = getStore(STORAGE_KEYS.MESSAGES);
        messages.unshift({
            id: Math.random().toString(36),
            content,
            senderId,
            senderName,
            type,
            timestamp: Date.now()
        });
        setStore(STORAGE_KEYS.MESSAGES, messages);
        return;
    }
    await addDoc(collection(db, "messages"), {
        content,
        senderId,
        senderName,
        type,
        timestamp: serverTimestamp()
    });
}

export function subscribeToMessages(callback) {
    if (USE_MOCK) {
        const load = () => callback(getStore(STORAGE_KEYS.MESSAGES));
        load();

        const handleStorage = () => load();
        window.addEventListener('storage', handleStorage);
        window.addEventListener('local-storage-update', handleStorage);

        return () => {
            window.removeEventListener('storage', handleStorage);
            window.removeEventListener('local-storage-update', handleStorage);
        };
    }
    const q = query(collection(db, "messages"), orderBy("timestamp", "desc"));
    return onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(messages);
    });
}
