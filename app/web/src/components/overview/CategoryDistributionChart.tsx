import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const CategoryData = [
    { name: "Electronics", value: 4500 },
    { name: "Clothing", value: 3200 },
    { name: "Home & Garden", value: 2800 },
    { name: "Books", value: 2100 },
    { name: "Sports & Outdoors", value: 1900 },
];

const CategoryDistributionChart = () => {
    return (
        <motion.div
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <h2 className="text-lg font-medium mb-4 text-gray-100">Category Distribution</h2>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={CategoryData}
                            dataKey="value"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                            {CategoryData.map((entry, index) => (
                                <Cell key={index} fill={entry.name === "Electronics"? "#6366F1" : entry.name === "Clothing"? "#885CF6" : entry.name === "Home & Garden"? "#EC4899" : entry.name === "Books"? "#F2994A" : "#F7C654"} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default CategoryDistributionChart;
