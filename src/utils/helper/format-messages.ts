import { Exchange, Close } from "@tbdex/http-client"

export const formatMessages = (exchanges: Exchange[][]) => {
    const formattedMessages = exchanges.map(exchange => {
        const latestMessage = exchange[exchange.length - 1]
        const rfqMessage = exchange.find(message => message.kind === 'rfq')
        const quoteMessage = exchange.find(message => message.kind === 'quote')
        // console.log('quote', quoteMessage)
        const status = generateExchangeStatusValues(latestMessage)
        const fee = quoteMessage?.data['payin']?.['fee']
        const payinAmount = quoteMessage?.data['payin']?.['amount']
        const payoutPaymentDetails = rfqMessage.privateData?.payout.paymentDetails
        return {
            id: latestMessage.metadata.exchangeId,
            payinAmount: (fee ? Number(payinAmount) + Number(fee) : Number(payinAmount)).toString() || rfqMessage.data['payinAmount'],
            payinCurrency: quoteMessage.data['payin']?.['currencyCode'] ?? null,
            payoutAmount: quoteMessage?.data['payout']?.['amount'] ?? null,
            payoutCurrency: quoteMessage.data['payout']?.['currencyCode'],
            status,
            createdTime: rfqMessage.createdAt,
            ...latestMessage.kind === 'quote' && { expirationTime: quoteMessage.data['expiresAt'] ?? null },
            from: 'You',
            to: payoutPaymentDetails?.address || payoutPaymentDetails?.accountNumber + ', ' + payoutPaymentDetails?.bankName || payoutPaymentDetails?.phoneNumber + ', ' + payoutPaymentDetails?.networkProvider || 'Unknown',
            pfiDid: rfqMessage.metadata.to
        }
    })

    return formattedMessages;
}

const generateExchangeStatusValues = (exchangeMessage) => {
    if (exchangeMessage instanceof Close) {
        if (exchangeMessage.data.reason.toLowerCase().includes('complete') || exchangeMessage.data.reason.toLowerCase().includes('success')) {
            return 'completed'
        } else if (exchangeMessage.data.reason.toLowerCase().includes('expired')) {
            return exchangeMessage.data.reason.toLowerCase()
        } else if (exchangeMessage.data.reason.toLowerCase().includes('cancelled')) {
            return 'cancelled'
        } else {
            return 'failed'
        }
    }
    return exchangeMessage.kind
}