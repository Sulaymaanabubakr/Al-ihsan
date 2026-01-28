import { db } from "./firebase";
import {
    doc,
    getDoc,
    setDoc,
    runTransaction,
    serverTimestamp,
    onSnapshot
} from "firebase/firestore";

export const PROGRAM_SETTINGS_DOC_ID = "ramadan_teens_2026";
export const SETTINGS_COLLECTION = "program_settings";
export const REGISTRATIONS_COLLECTION = "teens_registrations";

export interface ProgramSettings {
    general_slots_taken: number;
    competition_slots_taken: number;
    general_limit: number;
    competition_limit: number;
    is_registration_open: boolean;
}

export type RegistrationType = 'GENERAL' | 'COMPETITION';

export interface RegistrationData {
    childName: string;
    age: number;
    gender: string;
    parentName: string;
    phone: string;
    whatsapp: string;
    email: string;
    city: string;
    state: string;
    type: RegistrationType;
    activity: string; // 'General Attendance' or specific competition
    experience?: string;
    notes?: string;
}

// Initialize the settings document if it doesn't exist
export const initializeProgramSettings = async () => {
    const settingsRef = doc(db, SETTINGS_COLLECTION, PROGRAM_SETTINGS_DOC_ID);
    const settingsSnap = await getDoc(settingsRef);

    if (!settingsSnap.exists()) {
        const initialSettings: ProgramSettings = {
            general_slots_taken: 0,
            competition_slots_taken: 0,
            general_limit: 80,
            competition_limit: 20,
            is_registration_open: true,
        };
        await setDoc(settingsRef, initialSettings);
        console.log("Program settings initialized");
    } else {
        console.log("Program settings already exist");
    }
};

// Listen to real-time slot updates
export const subscribeToProgramSettings = (callback: (settings: ProgramSettings | null) => void) => {
    const settingsRef = doc(db, SETTINGS_COLLECTION, PROGRAM_SETTINGS_DOC_ID);
    return onSnapshot(settingsRef, (doc) => {
        if (doc.exists()) {
            callback(doc.data() as ProgramSettings);
        } else {
            callback(null);
        }
    }, (error) => {
        console.error("Program settings snapshot error:", error);
        callback(null); // Fallback to defaults in UI
    });
};

// Register a student using a transaction to ensure slot safety
export const registerStudent = async (data: RegistrationData) => {
    const settingsRef = doc(db, SETTINGS_COLLECTION, PROGRAM_SETTINGS_DOC_ID);
    const registrationRef = doc(db, REGISTRATIONS_COLLECTION, crypto.randomUUID());

    try {
        await runTransaction(db, async (transaction) => {
            const settingsDoc = await transaction.get(settingsRef);

            if (!settingsDoc.exists()) {
                throw new Error("Program settings not found!");
            }

            const settings = settingsDoc.data() as ProgramSettings;

            if (!settings.is_registration_open) {
                throw new Error("Registration is closed.");
            }

            // Check specific limits based on type
            if (data.type === 'GENERAL') {
                if (settings.general_slots_taken >= settings.general_limit) {
                    throw new Error("General program slots are full.");
                }
                transaction.update(settingsRef, {
                    general_slots_taken: settings.general_slots_taken + 1
                });
            } else if (data.type === 'COMPETITION') {
                if (settings.competition_slots_taken >= settings.competition_limit) {
                    throw new Error("Competition slots are full.");
                }
                transaction.update(settingsRef, {
                    competition_slots_taken: settings.competition_slots_taken + 1
                });
            } else {
                throw new Error("Invalid registration type.");
            }

            // Create the registration document
            transaction.set(registrationRef, {
                ...data,
                status: 'PENDING',
                timestamp: serverTimestamp()
            });
        });

        return { success: true };
    } catch (error: any) {
        console.error("Registration failed: ", error);
        throw error;
    }
};
// ... existing code ...

// Admin: Fetch all registrations
export interface RegistrationWithId extends RegistrationData {
    id: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    timestamp: any;
}

import { collection, query, orderBy, updateDoc, getDocs } from "firebase/firestore";

export const getRegistrations = async () => {
    const registrationsRef = collection(db, REGISTRATIONS_COLLECTION);
    const q = query(registrationsRef, orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as RegistrationWithId[];
};

// Admin: Update registration status
export const updateRegistrationStatus = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    const docRef = doc(db, REGISTRATIONS_COLLECTION, id);
    await updateDoc(docRef, { status });
};
