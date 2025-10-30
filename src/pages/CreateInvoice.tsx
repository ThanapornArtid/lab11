import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/services/api"; //
import { Input } from "@/components/ui/input"; //
import { Button } from "@/components/ui/button"; //
import { Label } from "@/components/ui/label"; //
import { logout } from "@/services/logoutService";
import bg2 from "@/assets/bg2.png";
import logo from "@/assets/logo.png";
import type { Invoice } from "@/models/models"; //

export default function CreateInvoicePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    invoice_number: "",
    client_id: "",
    quotation_number: "",
    issue_date: "",
    due_date: "",
    status: "Pending", // Default status
    subtotal: "",
    tax_amount: "",
    total_amount: "",
    currency: "THB", // Default currency
    notes: "",
    created_by: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation from your old project
    if (!formData.client_id || !formData.issue_date || !formData.due_date) {
      alert("Please fill out all required fields (*).");
      setLoading(false);
      return;
    }

    // --- THIS IS THE UPDATED PART ---
    // We keep amounts as strings to match the Invoice model
    const invoiceData = {
      ...formData,
      client_id: parseInt(formData.client_id) || 0,
      created_by: parseInt(formData.created_by) || 0,
      
      // Ensure amounts are strings, not numbers
      subtotal: formData.subtotal || "0",
      tax_amount: formData.tax_amount || "0",
      total_amount: formData.total_amount || "0",
      amount_paid: "0", // Send as a string
    };
    // --- END OF UPDATE ---

    try {
      // The type error should now be gone
      await api.post("/invoice", invoiceData as Partial<Invoice>); 
      alert('Invoice created successfully!');
      navigate('/invoice'); // Go back to the invoice list
    } catch (err: any) {
      console.error("Error creating invoice:", err);
      alert(`Error creating invoice: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
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
            Create a New Invoice
          </h1>
        </div>
      </header>

      {/* Page Content - Recreated Form */}
      <main className="flex justify-center py-10">
        <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-lg shadow-xl border w-full max-w-4xl">
          <h2 className="font-bold text-2xl pb-4 mb-6 border-b text-ink">New Invoice Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Column 1 */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="invoice_number">Invoice number *</Label>
                <Input id="invoice_number" value={formData.invoice_number} onChange={handleChange} placeholder="e.g., INV-2025-001" required />
              </div>
              <div>
                <Label htmlFor="client_id">Client ID *</Label>
                <Input id="client_id" type="number" value={formData.client_id} onChange={handleChange} placeholder="e.g., 1" required />
              </div>
              <div>
                <Label htmlFor="quotation_number">Quotation Number</Label>
                <Input id="quotation_number" value={formData.quotation_number} onChange={handleChange} placeholder="e.g., Q-2025-001" />
              </div>
              <div>
                <Label htmlFor="status">Status *</Label>
                <select id="status" value={formData.status} onChange={handleChange} className="w-full h-9 border border-input rounded-md px-3 py-1 text-sm">
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Unpaid">Unpaid</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="issue_date">Issue Date *</Label>
                <Input id="issue_date" type="date" value={formData.issue_date} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="due_date">Due Date *</Label>
                <Input id="due_date" type="date" value={formData.due_date} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="currency">Currency *</Label>
                <Input id="currency" value={formData.currency} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="created_by">Created by (User ID) *</Label>
                <Input id="created_by" type="number" value={formData.created_by} onChange={handleChange} placeholder="e.g., 1" required />
              </div>
            </div>

            {/* Column 3 */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="subtotal">Subtotal *</Label>
                <Input id="subtotal" type="number" value={formData.subtotal} onChange={handleChange} placeholder="0.00" required step="0.01" />
              </div>
              <div>
                <Label htmlFor="tax_amount">Tax Amount * (7%)</Label>
                <Input id="tax_amount" type="number" value={formData.tax_amount} onChange={handleChange} placeholder="0.00" required step="0.01" />
              </div>
              <div>
                <Label htmlFor="total_amount">Total Amount *</Label>
                <Input id="total_amount" type="number" value={formData.total_amount} onChange={handleChange} placeholder="0.00" required step="0.01" />
              </div>
            </div>

            {/* Notes field */}
            <div className="md:col-span-3">
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="w-full border border-input rounded-md px-3 py-2 text-sm"
                placeholder="Additional details..."
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-8 flex justify-end gap-4">
            <Button type="button" variant="outline" asChild>
              <Link to="/invoice">Cancel</Link>
            </Button>
            <Button type="submit" className="bg-secondary text-white hover:bg-primary" disabled={loading}>
              {loading ? "Creating..." : "Create Invoice"}
            </Button>
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer className="mt-auto flex items-center justify-center text-sm bg-ink text-white w-full p-3">
        <p>Use for Tailwind Demo © Faculty of ICT, Mahidol University</p>
      </footer>
    </div>
  );
}