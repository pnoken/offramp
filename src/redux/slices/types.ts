

export interface MockProviderDid {
    uri: string;
    name: string;
    description: string;
}

export interface Offering {
    id: string;
    metadata: {
        from: string;
    };
    data: {
        requiredClaims: any[];
        payin: {
            currencyCode: string;
            methods: { kind: string }[];
        };
        payout: {
            currencyCode: string;
            methods: { kind: string }[];
        };
    };
}

export interface Transaction {
    id: string;
    payinAmount: string;
    payinCurrency: string | null;
    payoutAmount: string | null;
    payoutCurrency: string | null;
    status: string;
    createdTime: string;
    expirationTime?: string | null;
    from: string;
    to: string;
    pfiDid: string;
}

export interface State {
    balance: number;
    transactions: Transaction[];
    transactionsLoading: boolean;
    pfiAllowlist: MockProviderDid[];
    selectedTransaction: Transaction | null;
    offering: Offering | null;
    payinCurrencies: string[];
    payoutCurrencies: string[];
    offerings: Offering[];
    customerDid: any | null; // Adjust as per DID type
    customerCredentials: string[];
}
