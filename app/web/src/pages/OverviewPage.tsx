import { motion } from "framer-motion";
import Header from "../components/common/Header";
import { ShoppingBag, Users, Zap } from "lucide-react";
import StatCard from "../components/common/StatCard";
import SalesOverviewChart from "../components/overview/SalesOverviewChart";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import RenderActiveShape from "../components/overview/RenderActiveShape";

const OverviewPage = () => {
    return (
        <div className="flex-1 overflow-auto relative z-10">
            <Header title="Overview" />
            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                <motion.div
                    className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <StatCard
                        name="Total Sales" icone={Zap} value="$12, 345" color="#6366F1"
                    />
                    <StatCard name="New User" icone={Users} value="1, 234" color="#885CF6" />
                    <StatCard name="Tatal Products" icone={ShoppingBag} value="545" color="#EC4899" />
                </motion.div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2 mb-8">
                    <CategoryDistributionChart />
                    <RenderActiveShape />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <SalesOverviewChart />
                </div>
            </main>
        </div>
    )
}

export default OverviewPage;