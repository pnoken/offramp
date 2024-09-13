import { PayoutMethod, PayinMethod } from '@tbdex/protocol';

interface Offering {
    metadata: {
        from: string;
        protocol: string;
        kind: string;
        id: string;
        createdAt: string;
    };
    data: {
        description: string;
        payoutUnitsPerPayinUnit: string;
        payout: {
            currencyCode: string;
            methods: PayoutMethod[];
        };
        payin: {
            currencyCode: string;
            methods: PayinMethod[];
        };
        requiredClaims: {
            id: string;
            format: {
                jwt_vc: {
                    alg: string[];
                };
            };
            input_descriptors: Array<{
                id: string;
                constraints: {
                    fields: Array<{
                        path: string[];
                        filter: {
                            type: string;
                            const: string;
                        };
                    }>;
                };
            }>;
        };
    };
    signature: string;
}

export type { Offering }