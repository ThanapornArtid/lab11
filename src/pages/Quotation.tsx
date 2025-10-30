import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Quotation, Client } from "@/models/models";
import api from "@/services/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { logout } from "@/services/logoutService";
import bg2 from "@/assets/bg2.png";
import logo from "@/assets/logo.png";
import CreateQuotation from "@/components/CreateQuotation";

// --- Helper Functions ---

const formatDate = (dateString?: string) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const formatCurrency = (amountStr?: string, currency?: string) => {
  const amount = parseFloat(amountStr || "0");
  const symbol = currency === "THB" ? '฿' : '$'; // Default to $
  return `${symbol}${amount.toLocaleString()}`;
};

// --- Component ---

const initialFilters = {
  company: "",
  email: "",
  startDate: "",
  endDate: "",
};

export default function QuotationPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [allQuotations, setAllQuotations] = useState<Quotation[]>([]);
  const [filteredQuotations, setFilteredQuotations] = useState<Quotation[]>([]);
  const [filters, setFilters] = useState(initialFilters);
  const navigate = useNavigate();

  // Fetch data on component mount
  const fetchQuotations = async () => {
    try {
      const [quotationRes, clientRes] = await Promise.all([
        api.get("/quotation"),
        api.get("/client"),
      ]);

      const quotations: Quotation[] = quotationRes.data;
      const clients: Client[] = clientRes.data;
      const clientMap = new Map<number, Client>();
      clients.forEach((c) => clientMap.set(c.client_id, c));

      const mergedQuotations = quotations.map((q) => ({
        ...q,
        client: clientMap.get(q.client_id),
      }));

      setAllQuotations(mergedQuotations);
      setFilteredQuotations(mergedQuotations);
    } catch (err) {
      console.error("Failed to fetch quotations or clients:", err);
    }
  };
  
  useEffect(() => {
    fetchQuotations();
  }, []);

  const refreshQuotations = () => {
    fetchQuotations(); // Simple refetch
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    let quotations = [...allQuotations];

    // Filter by text fields
    quotations = quotations.filter((q) => {
      const client = q.client;
      const matchCompany = !filters.company || client?.company_name.toLowerCase().includes(filters.company.toLowerCase());
      const matchEmail = !filters.email || client?.email.toLowerCase().includes(filters.email.toLowerCase());
      return matchCompany && matchEmail;
    });

    // Filter by date
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      quotations = quotations.filter(q => new Date(q.created_at!) >= startDate);
    }
    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setDate(endDate.getDate() + 1); // Make it inclusive
      quotations = quotations.filter(q => new Date(q.created_at!) < endDate);
    }
    
    setFilteredQuotations(quotations);
  };

  const handleReset = () => {
    setFilters(initialFilters);
    setFilteredQuotations(allQuotations);
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
            <Link to="/invoice">Invoice</Link>
            <Link to="/quotation" className="font-bold text-primary">Quotation</Link>
            <Link to="/aboutus">About Us</Link>
          </div>
          <a onClick={logout} className=" hover:font-bold cursor-pointer">Log out →</a>
        </nav>

        <div className="relative w-full h-60 opacity-90">
          <img src={bg2} alt="banner" className="absolute inset-0 w-full h-full object-cover brightness-50" />
          <h1 className="absolute inset-0 flex items-center justify-center text-white text-3xl font-bold">
            Quotation Management System
          </h1>
        </div>
      </header>

      {/* 2. Main Content Area */}
      <main className="flex-grow p-6">
        
        {/* Title Bar - HERE IS THE "+ Create Quotation" BUTTON */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-ink">Quotations</h2>
          {/*
            FIX 1:
            - Removed `bg-primary` and `text-white`.
            - The default variant (primary) will be used automatically.
            - Kept the custom `hover:bg-secondary`.
          */}
          <Button 
            onClick={() => setShowCreateModal(true)} 
            className="hover:bg-secondary"
          >
            + Create Quotation
          </Button>
        </div>

        {/* Search Form - HERE ARE THE "Search" AND "Reset" BUTTONS */}
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-4 items-end">
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
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="mt-1"
              />
            </div>
            <div className="flex-1 min-w-[120px]">
              <label htmlFor="end-date" className="block text-xs font-medium text-muted">To:</label>
              <Input
                id="end-date"
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="mt-1"
              />
            </div>
            {/*
              FIX 2:
              - Added `variant="secondary"`.
              - Removed `bg-secondary` and `text-white` from className.
              - Kept the custom `hover:bg-primary`.
            */}
            <Button type="submit" variant="secondary" className="hover:bg-primary h-9">
              Search
            </Button>
            <Button type="button" variant="outline" onClick={handleReset} className="h-9">
              Reset
            </Button>
          </form>
        </div>

        {/* 3. Quotation List (Table) */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-6">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase">Quotation#</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase">Created Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase">Valid Until</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase">Staff</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredQuotations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-muted">
                      No quotations found.
                    </td>
                  </tr>
                ) : (
                  filteredQuotations.map((q) => (
                    <tr key={q.quotation_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-ink">{q.quotation_number}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">{formatDate(q.created_at)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">{formatDate(q.valid_until)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-ink">{q.client?.company_name || "Unknown"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">{q.client?.contact_person || "-"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-ink">
                        {formatCurrency(q.total_amount, q.currency)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* 4. Modal (hidden by default) */}
      <CreateQuotation
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={() => {
          setShowCreateModal(false); // Close modal
          refreshQuotations();       // Refetch data
        }}
      />

      {/* 5. Footer */}
      <footer className="mt-auto flex items-center justify-center text-sm bg-ink text-white w-full p-3 mt-10">
        <p>Use for Tailwind Demo © Faculty of ICT, Mahidol University</p>
      </footer>
    </div>
  );
}