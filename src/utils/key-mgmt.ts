import { DidDht } from '@web5/dids';
import { LocalKeyManager } from "@web5/crypto";
let AwsKeyManager: any;

if (typeof window === 'undefined') {
    AwsKeyManager = require('@web5/crypto-aws-kms').AwsKeyManager;
}

interface PortableDid {
    did: string;
    document: object;
    keySet: object;
}

type Environment = 'production' | 'development' | 'test';

export async function initKeyManagement(env: Environment, portableDid: PortableDid | null): Promise<DidDhtInstance> {
    let keyManager: LocalKeyManager | typeof AwsKeyManager;

    if (env === "production" && AwsKeyManager) {
        keyManager = new AwsKeyManager();
    } else {
        keyManager = new LocalKeyManager();
    }

    if (portableDid == null) {
        return await DidDht.create({ keyManager });
    } else {
        return await DidDht.import({ portableDid, keyManager });
    }
}
