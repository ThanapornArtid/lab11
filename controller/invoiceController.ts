import { Invoice } from '../models/interface';

export interface Client {
    client_id: number;
    company_name: string;
    email: string;
}

const API_URL = "http://203.159.93.114:3100";

export async function fetchInvoices(token: string): Promise<Invoice[]> {
    const response = await fetch(`${API_URL}/invoice`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) {
        throw new Error("Failed to fetch invoices");
    }
    return response.json();
}

export async function fetchClientById(token: string, clientId: number): Promise<Client | null> {
    const response = await fetch(`${API_URL}/client/${clientId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) {
        console.error(`Failed to fetch client ${clientId}. Status: ${response.status}`);
        return null;
    }
    return response.json();
}

export async function searchInvoices(token: string, query: string): Promise<Invoice[]> {
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

export async function createInvoice(token: string, invoiceData: Partial<Invoice>): Promise<Invoice> {
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