/*
AI Declaration:
I used Gemini to help debug the table structure in my invoice layout.
I wrote all the other code, and I understand the entire implementation.

Reflection:
[ I learned how to connect an API to my code, and I also learned how to write functions to fetch, execute, and handle any errors that occurred.
  I also learned how to solve problems that came from my lack of understanding of the basics at first. In the end I managed to complete it successfully. Thank you to Aj. Wudhichart for all the help ka/\ ]
*/

import { createInvoice } from "../controller/invoiceController.js";
import { Invoice } from "../models/interface.js";

document.addEventListener("DOMContentLoaded", () => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        alert("Authentication required. Please log in.");
        window.location.href = "/login.html";
        return;
    }

    const form = document.getElementById('create-invoice-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const invoiceData = {
            invoice_number: (document.getElementById('invoice_number') as HTMLSelectElement).value ,
            client_id: parseInt((document.getElementById('client_id') as HTMLInputElement).value),
            quotation_number: (document.getElementById('quotation_number') as HTMLSelectElement).value,
            issue_date: (document.getElementById('issue_date') as HTMLInputElement).value,
            due_date: (document.getElementById('due_date') as HTMLInputElement).value,
            status: (document.getElementById('status') as HTMLSelectElement).value,
            subtotal: parseFloat((document.getElementById('subtotal') as HTMLInputElement).value),
            tax_amount: parseFloat((document.getElementById('tax_amount') as HTMLInputElement).value),
            total_amount: parseFloat((document.getElementById('total_amount') as HTMLInputElement).value),
            currency: (document.getElementById('currency') as HTMLInputElement).value,
            notes: (document.getElementById('notes') as HTMLTextAreaElement).value,
            created_by: parseInt((document.getElementById('created_by') as HTMLInputElement).value),
            amount_paid: 0,
        };
        
        if (!invoiceData.client_id || !invoiceData.issue_date || !invoiceData.due_date) {
            alert("Please fill out all required fields (*).");
            return;
        }
        
        try {
            await createInvoice(authToken, invoiceData as Partial<Invoice>);
            alert('Invoice created successfully!');
            window.location.href = '/invoices.html'; 
        } catch (err: any) {
            alert(`Error creating invoice: ${err.message}`);
        }
    });
});
