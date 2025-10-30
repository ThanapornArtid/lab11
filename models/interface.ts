export interface Invoice {
    invoice_number: string;
    client_id: Number;
    quotation_number: string;
    issue_date: string;
    due_date: string;
    status: string;
    subtotal: Number;
    tax_amount: Number;
    total_amount: Number;
    amount_paid: Number;
    currency: string;
    notes: string;
    created_by: Number;
}