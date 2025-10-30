import { Invoice } from '../models/interface';
export interface Client {
    client_id: number;
    company_name: string;
    email: string;
}
export declare function fetchInvoices(token: string): Promise<Invoice[]>;
export declare function fetchClientById(token: string, clientId: number): Promise<Client | null>;
export declare function searchInvoices(token: string, query: string): Promise<Invoice[]>;
export declare function createInvoice(token: string, invoiceData: Partial<Invoice>): Promise<Invoice>;
//# sourceMappingURL=invoiceController.d.ts.map