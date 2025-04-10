export function generateUniqueTransactionId(): string {
    const timestamp = Date.now().toString().slice(-5);
    const random = Math.floor(Math.random() * 90000 + 10000).toString();
    return `TXN${timestamp}${random}`;
}