import { useState } from "react";
import { BarChart2, DollarSign, LucideShoppingCart, Menu, Settings, ShoppingBag, TrendingUp, Users, ArrowRightLeft, PlusCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";

const SIDEBAR_ITEMS = [
    {
        name: "Overview",
        icon: BarChart2,
        color: "#6366f1",
        href: "/",
        requiresAuth: false
    },
    { name: "Products", icon: ShoppingBag, color: "#885cf6", href: "/products", requiresAuth: false },
    { name: "Users", icon: Users, color: "#EC4899", href: "/users", requiresAuth: false },
    { name: "List Compare", icon: ArrowRightLeft, color: "#10B981", href: "/list-compare", requiresAuth: false },
    { name: "Add Compare", icon: PlusCircle, color: "#F59E0B", href: "/add-compare", requiresAuth: true },
    { name: "Sales", icon: DollarSign, color: "#108981", href: "/sales", requiresAuth: false },
    { name: "Orders", icon: LucideShoppingCart, color: "#F59E0B", href: "/orders", requiresAuth: false },
    { name: "Analytics", icon: TrendingUp, color: "#3B82F6", href: "/analytics", requiresAuth: false },
    { name: "Settings", icon: Settings, color: "#6EE7B7", href: "/settings", requiresAuth: false },
]
const Sidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    return (
        <motion.div
            className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${isSidebarOpen ? 'w-64' : 'w-20'}
        `}
            animate={{ width: isSidebarOpen ? 256 : 80 }}
        >
            <div className="h-full bg-gray-800 bg-opacity-50 backdrop-blur-0 p-4 flex flex-col border-r border-gray-700">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 rounded-full hover: bg-gray-700 transition-colors max-w-fit"
                >
                    <Menu size={24} />
                </motion.button>
                <nav className="mt-8 flex-grow">
                    {SIDEBAR_ITEMS.map((item) => (
                        <Link key={item.href} to={item.href}>
                            <motion.div className='flex items-center p-4 text-sm font-medium rounded-lg hover: bg-gray-700 transition-colors mb-2'>
                                <item.icon size={20} style={{ color: item.color, minWidth: "20px" }} />
                                <AnimatePresence>
                                    {isSidebarOpen && (
                                        <motion.span
                                            className="ml-4 whitespace-nowrap"
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: "auto" }}
                                            exit={{ opacity: 0, width: 0 }}
                                            transition={{ duration: 0.2, delay: 0.3 }}
                                        >
                                            {item.name}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </Link>
                    ))}
                </nav>
            </div>
        </motion.div>
    )
}

export default Sidebar;