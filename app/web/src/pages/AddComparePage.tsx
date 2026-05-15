import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Calendar, DollarSign, User, ArrowRightLeft, Search, Filter, Loader2 } from "lucide-react";
import Header from "../components/common/Header";
import { compareService } from "../services/compareService";
import type { CompareItem } from "@comparesystem/shared";

const AddComparePage = () => {
    const [items, setItems] = useState<CompareItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        full_name: "",
        price: "",
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            setLoading(true);
            const data = await compareService.getAll();
            setItems(data);
            setError(null);
        } catch (err) {
            console.error("Error fetching items:", err);
            setError("Failed to load comparison items");
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.full_name || !formData.price || !formData.date) return;

        try {
            setSubmitting(true);
            const newItem = await compareService.create(formData);
            setItems([newItem, ...items]);
            setFormData({
                full_name: "",
                price: "",
                date: new Date().toISOString().split('T')[0]
            });
            setError(null);
        } catch (err) {
            console.error("Error adding item:", err);
            setError("Failed to add entry. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const removeHandle = async (id: string) => {
        try {
            await compareService.delete(id);
            setItems(items.filter(item => item.id !== id));
        } catch (err) {
            console.error("Error deleting item:", err);
            setError("Failed to delete item.");
        }
    };

    return (
        <div className="flex-1 overflow-auto relative z-10 bg-gray-900 text-gray-100">
            <Header title="Add Comparison" />

            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Form Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-1"
                    >
                        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6 border border-gray-700 shadow-xl sticky top-6">
                            <h2 className="text-xl font-semibold text-indigo-400 mb-6 flex items-center gap-2">
                                <Plus size={24} />
                                New Entry
                            </h2>

                            {error && (
                                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleAdd} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                            <User size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={formData.full_name}
                                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                            className="w-full bg-gray-900 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                            placeholder="Enter item name..."
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Price</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                            <DollarSign size={18} />
                                        </div>
                                        <input
                                            type="number"
                                            step="0.01"
                                            required
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            className="w-full bg-gray-900 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Date</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                            <Calendar size={18} />
                                        </div>
                                        <input
                                            type="date"
                                            required
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            className="w-full bg-gray-900 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 mt-4"
                                >
                                    {submitting ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                                    {submitting ? "Adding..." : "Add to Compare"}
                                </button>
                            </form>
                        </div>
                    </motion.div>

                    {/* Comparison List Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-2"
                    >
                        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6 border border-gray-700 shadow-xl h-full min-h-[600px]">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                        Comparison View
                                        <span className="text-sm font-normal text-gray-400 bg-gray-900 px-3 py-1 rounded-full border border-gray-700">
                                            {items.length} items
                                        </span>
                                    </h2>
                                    <p className="text-gray-400 text-sm mt-1">Review and compare your selected entries.</p>
                                </div>

                                {items.length > 0 && (
                                    <div className="flex gap-2">
                                        <button
                                            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-all text-sm font-medium"
                                            onClick={async () => {
                                                if (window.confirm("Are you sure you want to clear all items?")) {
                                                    try {
                                                        await compareService.clearAll();
                                                        setItems([]);
                                                    } catch (err) {
                                                        setError("Failed to clear items.");
                                                    }
                                                }
                                            }}
                                        >
                                            <Trash2 size={16} />
                                            Clear All
                                        </button>
                                        <button
                                            className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-lg hover:bg-indigo-500/20 transition-all text-sm font-medium"
                                            onClick={() => {
                                                const sorted = [...items].sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
                                                setItems(sorted);
                                            }}
                                        >
                                            <Filter size={16} />
                                            Sort by Price
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="overflow-x-auto custom-scrollbar">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-gray-700 text-gray-400 uppercase text-xs tracking-wider">
                                            <th className="px-6 py-4 font-semibold">Item Details</th>
                                            <th className="px-6 py-4 font-semibold text-indigo-400">Price</th>
                                            <th className="px-6 py-4 font-semibold">Date</th>
                                            <th className="px-6 py-4 font-semibold text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        <AnimatePresence mode="popLayout">
                                            {loading ? (
                                                <tr>
                                                    <td colSpan={4} className="py-20 text-center">
                                                        <div className="flex flex-col items-center">
                                                            <Loader2 size={40} className="text-indigo-500 animate-spin mb-4" />
                                                            <p className="text-gray-400">Loading comparisons...</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : items.length > 0 ? (
                                                items.map((item) => (
                                                    <motion.tr
                                                        key={item.id}
                                                        layout
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.95 }}
                                                        className="hover:bg-gray-700/30 transition-colors group"
                                                    >
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                                                                    <ArrowRightLeft size={20} />
                                                                </div>
                                                                <span className="font-medium text-gray-200">{item.full_name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="font-mono text-indigo-400 font-bold">
                                                                ${parseFloat(item.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="text-gray-400 text-sm">{new Date(item.date).toLocaleDateString()}</span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <button
                                                                onClick={() => removeHandle(item.id)}
                                                                className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                                                title="Delete"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </td>
                                                    </motion.tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={4} className="py-20 text-center text-gray-500">
                                                        <div className="flex flex-col items-center">
                                                            <Search size={48} className="text-gray-700 mb-4" />
                                                            <p className="text-lg font-medium">No items to compare</p>
                                                            <p className="text-sm text-gray-600">Start by adding your first entry using the form on the left.</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </AnimatePresence>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default AddComparePage;
