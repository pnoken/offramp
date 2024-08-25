interface PortableDid {
    did: string,
    document: {
        id: string,
        verificationMethod: [
            {
                id: string,
                type: string,
                controller: string,
                publicKeyJwk: {
                    "alg": "EdDSA",
                    "crv": "Ed25519",
                    "kty": "OKP",
                    "ext": "true",
                    "key_ops": ["verify"],
                    "x": "YuQHFTco44nzORYnQubOtVLr1oQA6sIcYY8hlk2B-IU",
                    "kid": "0"
                }
            }
        ],
        "authentication": ["#0"],
        "assertionMethod": ["#0"],
        "capabilityInvocation": ["#0"],
        "capabilityDelegation": ["#0"]
    },
    keySet: {
        "verificationMethodKeys": [
            {
                "privateKeyJwk": {
                    "d": "*************",
                    "alg": "EdDSA",
                    "crv": "Ed25519",
                    "kty": "OKP",
                    "ext": "true",
                    "key_ops": ["sign"],
                    "x": "YuQHFTco44nzORYnQubOtVLr1oQA6sIcYY8hlk2B-IU",
                    "kid": "0"
                },
                "publicKeyJwk": {
                    "alg": "EdDSA",
                    "crv": "Ed25519",
                    "kty": "OKP",
                    "ext": "true",
                    "key_ops": ["verify"],
                    "x": "YuQHFTco44nzORYnQubOtVLr1oQA6sIcYY8hlk2B-IU",
                    "kid": "0"
                },
                "relationships": [
                    "authentication",
                    "assertionMethod",
                    "capabilityInvocation",
                    "capabilityDelegation"
                ]
            }
        ]
    }
}