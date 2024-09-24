import { Jwt, VerifiableCredential } from "@web5/credentials"

export const renderCredential = (credentialJwt: string) => {
    const vc = Jwt.parse({ jwt: credentialJwt }).decoded.payload['vc'] as VerifiableCredential;
    return {
        title: vc.type[vc.type.length - 1].replace(/(?<!^)(?<![A-Z])[A-Z](?=[a-z])/g, ' $&'), // get the last credential type in the array and format it with spaces
        name: vc.credentialSubject['name'],
        countryCode: vc.credentialSubject['countryOfResidence'],
        issuanceDate: new Date(vc.issuanceDate).toLocaleDateString(undefined, { dateStyle: 'medium' }),
    }
}