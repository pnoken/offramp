import { DidDht } from '@web5/dids';
import { LocalKeyManager } from "@web5/crypto";
let AwsKeyManager: any;

if (typeof window === 'undefined') {
    AwsKeyManager = require('@web5/crypto-aws-kms').AwsKeyManager;
}

interface PortableDid {
    did: string,
    document: {},
    keySet: {}
}

type Environment = 'production' | 'development' | 'test';


export async function initKeyManagement(env: Environment, portableDid: PortableDid) {
    // Determine which key manager to use based on the environment
    let keyManager;
    if (env === "production") {
        keyManager = new AwsKeyManager();
    } else {
        keyManager = new LocalKeyManager();
    }

    // Initialize or load a DID
    if (portableDid == null) {
        // Create a new DID
        return await DidDht.create(keyManager);
    } else {
        // Load existing DID
        return await DidDht.import({ portableDid, keyManager });
    }
}
