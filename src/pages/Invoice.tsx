import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Invoice, Client } from "@/models/models";
import api from "@/services/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { logout } from "@/services/logoutService";
import bg2 from "@/assets/bg2.png";
import logo from "@/assets/logo.png";

// --- Helper Functions ---

// Formats the date string
const formatDate = (dateString?: string) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

// Gets Tailwind classes for each status
const getStatusClasses = (status?: string) => {
  const s = status?.toLowerCase() || 'pending';
  switch (s) {
    case 'paid':
      return 'text-status-paid font-semibold';
    case 'pending':
      return 'text-status-pending font-semibold';
    case 'cancelled':
      return 'text-status-cancelled font-semibold';
    case 'unpaid':
      return 'text-status-unpaid font-semibold';
    case 'overdue':
      return 'text-status-overdue font-semibold';
    default:
      return 'text-status-pending font-semibold';
  }
};

// Formats the currency
const formatCurrency = (amountStr?: string, currency?: string) => {
  const amount = parseFloat(amountStr || "0");
  const symbol = currency === "THB" ? '฿' : '$'; // Default to $
  return `${symbol}${amount.toLocaleString()}`;
};

// --- Component ---

const initialFilters = {
  clientId: "",
  company: "",
  email: "",
  startDate: "30/10/2025", // Placeholder from screenshot
  endDate: "30/10/2025",   // Placeholder from screenshot
};

export default function InvoicePage() {
  const [allInvoices, setAllInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [filters, setFilters] = useState(initialFilters);
  const [activeStatus, setActiveStatus] = useState("All");
  const navigate = useNavigate();

  // Fetch data on component mount
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const [invoiceRes, clientRes] = await Promise.all([
          api.get("/invoice"),
          api.get("/client"),
        ]);

        const invoices: Invoice[] = invoiceRes.data;
        const clients: Client[] = clientRes.data;
        const clientMap = new Map<number, Client>();
        clients.forEach((c) => clientMap.set(c.client_id, c));

        const mergedInvoices = invoices.map((inv) => ({
          ...inv,
          client: clientMap.get(inv.client_id),
        }));

        setAllInvoices(mergedInvoices);
        setFilteredInvoices(mergedInvoices);
      } catch (err) {
        console.error("Failed to fetch invoices or clients:", err);
      }
    };
    fetchInvoices();
  }, []);

  // --- Event Handlers ---

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Re-apply filters based on state
    let invoices = [...allInvoices];
    
    // NOTE: Date filtering logic would need to be updated
    // if the text inputs aren't actual date pickers.
    // For now, it filters text fields.
    invoices = invoices.filter((inv) => {
      const client = inv.client;
      const matchClientId = !filters.clientId || inv.client_id.toString().includes(filters.clientId);
      const matchCompany = !filters.company || client?.company_name.toLowerCase().includes(filters.company.toLowerCase());
      const matchEmail = !filters.email || client?.email.toLowerCase().includes(filters.email.toLowerCase());
      return matchClientId && matchCompany && matchEmail;
    });
    
    setFilteredInvoices(invoices);
    setActiveStatus("All");
  };

  const handleStatusFilter = (status: string) => {
    setActiveStatus(status);
    if (status === "All") {
      setFilteredInvoices(allInvoices);
    } else {
      // This will filter for "Paid", "Pending", etc.
      // "Due this month" would require different date logic.
      const filtered = allInvoices.filter(
        (inv) => inv.status?.toLowerCase() === status.toLowerCase()
      );
      setFilteredInvoices(filtered);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* 1. Header & Banner */}
      <header>
        <nav className="flex items-center justify-between p-4 text-xs font-bold bg-white shadow-sm">
          <div>
            <Link to="/">
              <img src={logo} alt="logo" className="w-12" />
            </Link>
          </div>
          <div className="space-x-6">
            <Link to="/invoice" className="font-bold text-primary">Invoice</Link>
            <Link to="/quotation">Quotation</Link>
            <Link to="/aboutus">About Us</Link>
          </div>
          <a onClick={logout} className=" hover:font-bold cursor-pointer">Log out →</a>
        </nav>

        <div className="relative w-full h-60 opacity-90">
          <img src={bg2} alt="banner" className="absolute inset-0 w-full h-full object-cover brightness-50" />
          <h1 className="absolute inset-0 flex items-center justify-center text-white text-3xl font-bold">
            My Invoices
          </h1>
        </div>
      </header>


      <main className="flex-grow p-6">
        
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-ink">Invoices</h2>
          {/* FIX 1:
            - Removed `bg-primary` and `text-white` from className.
            - The component will now use the default 'primary' variant.
            - Kept the custom `hover:bg-secondary`.
          */}
          <Button asChild className="hover:bg-secondary">
            <Link to="/create-invoice">+ Create Invoice</Link>
          </Button>
        </div>
        

        {/* Search Form */}
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[150px]">
              <label htmlFor="search-client-id" className="block text-xs font-medium text-muted">Client ID</label>
              <Input
                id="search-client-id"
                type="text"
                placeholder="Client ID"
                value={filters.clientId}
                onChange={(e) => setFilters({ ...filters, clientId: e.target.value })}
                className="mt-1"
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <label htmlFor="search-company-name" className="block text-xs font-medium text-muted">Company Name</label>
              <Input
                id="search-company-name"
                type="text"
                placeholder="Company Name"
                value={filters.company}
                onChange={(e) => setFilters({ ...filters, company: e.target.value })}
                className="mt-1"
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <label htmlFor="search-client-email" className="block text-xs font-medium text-muted">Client Email</label>
              <Input
                id="search-client-email"
                type="email"
                placeholder="Client Email"
                value={filters.email}
                onChange={(e) => setFilters({ ...filters, email: e.target.value })}
                className="mt-1"
              />
            </div>
            <div className="flex-1 min-w-[120px]">
              <label htmlFor="start-date" className="block text-xs font-medium text-muted">From:</label>
              <Input
                id="start-date"
                type="text" // Using text to match screenshot, use type="date" for a date picker
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="mt-1"
              />
            </div>
            <div className="flex-1 min-w-[120px]">
              <label htmlFor="end-date" className="block text-xs font-medium text-muted">To:</label>
              <Input
                id="end-date"
                type="text" // Using text to match screenshot
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="mt-1"
              />
            </div>
            {/* FIX 2:
              - Added `variant="secondary"`.
              - Removed `bg-secondary` and `text-white` from className.
              - Kept the custom `hover:bg-primary` and `h-9`.
            */}
            <Button type="submit" variant="secondary" className="hover:bg-primary h-9">
              Search
            </Button>
          </form>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 py-4">
          {["All", "Overdue", "Paid", "Due this month", "Pending"].map((status) => (
            <Button
              key={status}
              variant="ghost"
              onClick={() => handleStatusFilter(status)}
              className={`text-sm ${activeStatus === status ? 'bg-blue-100 text-status-overdue font-bold' : 'text-muted'}`}
            >
              {status}
            </Button>
          ))}
        </div>

        {/* 3. Invoice List (Table) */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <tbody className="divide-y divide-gray-200">
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-muted">
                      No invoices found.
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((invoice) => (
                    <tr key={invoice.invoice_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-ink">{invoice.invoice_number}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-ink">{invoice.client?.company_name || "Unknown"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">{formatDate(invoice.issue_date)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-ink">
                        {formatCurrency(invoice.total_amount, invoice.currency)}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${getStatusClasses(invoice.status)}`}>
                        {invoice.status || "Pending"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* 4. Footer */}
      <footer className="mt-auto flex items-center justify-center text-sm bg-ink text-white w-full p-3 mt-10">
        <p>Use for Tailwind Demo © Faculty of ICT, Mahidol University</p>
      </footer>
    </div>
  );
}