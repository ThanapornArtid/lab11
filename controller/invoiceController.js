const API_URL = "http://203.159.93.114:3100";
export async function fetchInvoices(token) {
    const response = await fetch(`${API_URL}/invoice`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) {
        throw new Error("Failed to fetch invoices");
    }
    return response.json();
}
export async function fetchClientById(token, clientId) {
    const response = await fetch(`${API_URL}/client/${clientId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) {
        console.error(`Failed to fetch client ${clientId}. Status: ${response.status}`);
        return null;
    }
    return response.json();
}
export async function searchInvoices(token, query) {
    const response = await fetch(`${API_URL}/invoice/search?q=${encodeURIComponent(query)}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to search for invoices");
    }
    return response.json();
}
export async function createInvoice(token, invoiceData) {
    const response = await fetch(`${API_URL}/invoice`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(invoiceData)
    });
    if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || "Failed to create invoice");
    }
    return response.json();
}
//# sourceMappingURL=invoiceController.js.map