import { promises as fs } from 'fs';

// Define the expected structure of a DID object
interface DID {
    export(): Promise<object>;
}

// Function to load a DID from a file
export async function loadDID(filename: string): Promise<object | false> {
    try {
        const data = await fs.readFile(filename, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading from file:', error);
        return false;
    }
}

// Function to store a DID to a file
export async function storeDID(filename: string, portableDid: any): Promise<boolean> {
    try {
        const response = await fetch('/api/store-did', {
            method: 'POST', // Ensure the method is POST
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ filename, portableDid }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result.success;
    } catch (error) {
        console.error('Error storing DID:', error);
        return false;
    }
}
