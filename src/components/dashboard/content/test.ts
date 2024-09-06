const createExchange = async (offering, amount, payoutPaymentDetails) => {
    const selectedCredentials = PresentationExchange.selectCredentials({
        vcJwts: customerCredentials,
        presentationDefinition: offering.data.requiredClaims
    })

    const rfq = Rfq.create({
        metadata: {
            from: customerDid.uri,
            to: offering.metaData.from,
            protocol: '1.0'
        },
        data: {
            offeringId: offering.id,
            payin: {
                amount: amount.toString(),
                kind: offering.data.payin.methods[0].kind,
                paymentDetails: {}
            },
            payout: {
                kind: offering.data.payin.methods[0].kind,
                paymentDetails: payoutPaymentDetails
            },
            claims: selectedCredentials
        }
    })

    try {
        await rfq.verifyOfferingRequirements(offering)
    } catch (e) {
        console.log('offering requirements not met', e)
    }

    //Sign rfq message
    //Better to create  a sign function and sign popup
    await rfq.sign(customerDid)

    try {
        await TbdexHttpClient.createExchange(rfq);
    } catch (error) {
        console.error('failed to create exchange', error);
    }
}

//fetch exchanges
const fetchExchanges = async (pfiUri) => {
    try {
        const exchanges = await TbdexHttpClient.getExchanges({
            pfiDid: pfiUri,
            did: customerDid //store as state from lS
        })
    }
}



//const didDocument = await resolveDid(pfiDid);
//const isPFI = didDocument.service.some(service => service.type === 'PFI');


const payinCurrencyCode = amountFrom; // Desired payin currency code
const payoutCurrencyCode = amountTo; // Desired payout currency code

const fetchOfferings = async () => {

    const matchedOfferings = []; // Array to store the matched offerings

    // Loop through the all PFIs in your network
    for (const pfiDid of pfiDids) {

        //Makes a request to the PFI to get their offerings
        const offerings = await TbdexHttpClient.getOfferings({ pfiDid: pfiDid });

        // Filter offerings based on the currency pair
        if (offerings) {
            const filteredOfferings = offerings.filter(offering =>
                offering.data.payin.currencyCode === payinCurrencyCode &&
                offering.data.payout.currencyCode === payoutCurrencyCode
            );
            matchedOfferings.push(...filteredOfferings);
        }
    }
}