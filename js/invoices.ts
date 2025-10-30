/*
AI Declaration:
I used Gemini to help debug the table structure in my invoice layout.
I wrote all the other code, and I understand the entire implementation.

Reflection:
[ I learned how to connect an API to my code, and I also learned how to write functions to fetch, execute, and handle any errors that occurred.
  I also learned how to solve problems that came from my lack of understanding of the basics at first. In the end I managed to complete it successfully. Thank you to Aj. Wudhichart for all the help ka/\ ]
*/

import { fetchInvoices, fetchClientById, Client } from "../controller/invoiceController.js";
import { Invoice } from "../models/interface.js";

interface SearchCriteria {
  clientId?: number | null;
  companyName?: string;
  clientEmail?: string;
  startDate?: Date | null;
  endDate?: Date | null;
}

let authToken: string | null = null;
let allInvoices: Invoice[] = [];

document.addEventListener("DOMContentLoaded", async () => {
    authToken = localStorage.getItem('authToken');
    if (!authToken) {
        alert("You are not logged in!");
        window.location.href = "/login.html";
        return;
    }

    await loadInvoices();

    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            
            const clientIdStr = (document.getElementById('search-client-id') as HTMLInputElement).value;
            const companyName = (document.getElementById('search-company-name') as HTMLInputElement).value;
            const clientEmail = (document.getElementById('search-client-email') as HTMLInputElement).value;
            const startDate = (document.getElementById('start-date') as HTMLInputElement).value;
            const endDate = (document.getElementById('end-date') as HTMLInputElement).value;

            const criteria: SearchCriteria = {
                clientId: clientIdStr ? Number(clientIdStr) : null,
                companyName: companyName.toLowerCase().trim(),
                clientEmail: clientEmail.toLowerCase().trim(),
                startDate: normalizeToDateOnly(startDate),
                endDate: normalizeToDateOnly(endDate),
            };

            const filteredInvoices = await filterInvoices(criteria);
            await renderInvoices(filteredInvoices);
        });
    }
});

async function loadInvoices() {
    if (!authToken) return;
    try {
        allInvoices = await fetchInvoices(authToken);
        await renderInvoices(allInvoices);
    } catch (err) {
        console.error("Failed to load invoices:", err);
    }
}

function normalizeToDateOnly(dateString?: string): Date | null {
  if (!dateString) return null;
  const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;
  const [_, year, month, day] = match;
  return new Date(Number(year), Number(month) - 1, Number(day));
}

async function filterInvoices(criteria: SearchCriteria): Promise<Invoice[]> {
    if (!authToken) return [];

    const clientCache: Record<number, Client | null> = {};
    const inclusiveEndDate = criteria.endDate ? new Date(criteria.endDate.getTime() + 24 * 60 * 60 * 1000) : null;

    const getClient = async (id: number): Promise<Client | null> => {
        if (clientCache[id] === undefined) {
            clientCache[id] = await fetchClientById(authToken!, id);
        }
        return clientCache[id];
    };

    let filtered = allInvoices;

    if (criteria.clientId) {
        filtered = filtered.filter(inv => inv.client_id === criteria.clientId);
    }
    if (criteria.startDate) {
        filtered = filtered.filter(inv => new Date(inv.issue_date) >= criteria.startDate!);
    }
    if (inclusiveEndDate) {
        filtered = filtered.filter(inv => new Date(inv.issue_date) < inclusiveEndDate);
    }

    const results: Invoice[] = [];
    for (const invoice of filtered) {
        const client = await getClient(invoice.client_id as number);
        const companyMatch = !criteria.companyName || client?.company_name.toLowerCase().includes(criteria.companyName);
        const emailMatch = !criteria.clientEmail || client?.email.toLowerCase().includes(criteria.clientEmail);
        
        if (companyMatch && emailMatch) {
            results.push(invoice);
        }
    }
    
    return results;
}

async function renderInvoices(invoices: Invoice[]) {
    const container = document.getElementById("invoice-list-container");
    if (!container) return;
    
    if (invoices.length === 0) {
        container.innerHTML = "<p style='padding: 1rem;'>No invoices found.</p>";
        return;
    }

    if (!authToken) return;
    const clientIds = [...new Set(invoices.map(inv => inv.client_id as number))];
    const clientPromises = clientIds.map(id => fetchClientById(authToken!, id));
    const clients = (await Promise.all(clientPromises)).filter(c => c !== null) as Client[];
    const clientMap = new Map(clients.map(c => [c.client_id, c.company_name]));

    container.innerHTML = invoices.map(invoice => {
        const companyName = clientMap.get(invoice.client_id as number) || 'Unknown Client';
        const status = invoice.status || 'pending';

        return `
            <article class="invoice">
                <div class="invoice__info">
                    <div class="invoice__date">${new Date(invoice.issue_date).toLocaleDateString()}</div>
                    <div class="invoice__company">${companyName}</div>
                    <div class="invoice__id">${invoice.invoice_number}</div>
                </div>
                <div class="invoice__amount">
                    <div class="invoice__value">฿${(invoice.total_amount as number).toLocaleString()}</div>
                    <div class="invoice__status invoice__status--${status.toLowerCase()}">${status}</div>
                </div>
            </article>
        `;
    }).join('');
}