import { useEffect, useState } from "react";
import { Plus, Filter, Upload } from "lucide-react";
import PaymentItemCard from "./components/PaymentItemCards";
import PaymentItemSkeleton from "./components/PaymentItemSkeleton";
import MainLayout from "../../layouts/mainLayout";
import { API_ENDPOINTS } from "../../apiConfig";

export default function PaymentItems() {
  const [search, setSearch] = useState("");
  const [paymentItems, setPaymentItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentItems = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch(API_ENDPOINTS.PAYMENT_ITEMS, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch payment items");
        const data = await res.json();
        setPaymentItems(data); 
      } catch (err) {
        // error handling here
        setPaymentItems([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPaymentItems();
  }, []);

  // search filter
  const filteredItems = paymentItems.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="p-8 mt-20 bg-transparent min-h-screen">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-white">Payment Items</h1>
            <p className="text-gray-400 text-sm">Manage your organization&apos;s payment options</p>
          </div>
          <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-2xl transition">
            <Plus className="w-5 h-5" /> Add Payment Item
          </button>
        </div>

        <div className="flex flex-wrap gap-4 items-center mb-4">
          <input
            type="text"
            placeholder="Search payment items..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-[#23263A] border border-[#23263A] text-white px-4 py-2 rounded w-64 focus:outline-none"
          />
          <select className="bg-[#23263A] border border-[#23263A] text-white px-4 py-2 rounded">
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
          <select className="bg-[#23263A] border border-[#23263A] text-white px-4 py-2 rounded">
            <option>All Types</option>
            <option>Compulsory</option>
            <option>Optional</option>
          </select>
          <button className="flex items-center gap-2 bg-[#23263A] text-white px-4 py-2 rounded">
            <Filter className="w-4 h-4" /> More Filters
          </button>
          <button className="flex items-center gap-2 bg-[#23263A] text-white px-4 py-2 rounded">
            <Upload className="w-4 h-4" /> Export
          </button>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <input type="checkbox" id="selectAll" className="accent-purple-600" />
          <label htmlFor="selectAll" className="text-gray-300 text-sm">Select All</label>
          <span className="ml-auto text-gray-400 text-xs">{paymentItems.length} items</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 6 }).map((_, idx) => <PaymentItemSkeleton key={idx} />)
            : filteredItems.map((item, idx) => (
                <PaymentItemCard key={item.id || idx} {...item} />
              ))
          }
        </div>
      </div>
    </MainLayout>
  );
}