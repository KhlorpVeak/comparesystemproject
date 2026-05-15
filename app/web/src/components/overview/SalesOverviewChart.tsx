import { motion } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const salesData = [
    {name: "Jan", sales: 0},
    {name: "Feb", sales: 100},
    {name: "Mar", sales: 900},
    {name: "Apr", sales: 700},
    {name: "May", sales: 200},
    {name: "Jun", sales: 300},
    {name: "Jul", sales: 300},
    {name: "Aug", sales: 300},
    {name: "Sep", sales: 900},
    {name: "Oct", sales: 200},
    {name: "Nov", sales: 500},
    {name: "Dec", sales: 800},
 ];
const SalesOverviewChart = () => {
    return (
        <motion.div
            className = "bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 lg:col-span-2 border-gray-700"
            initial = {{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.2}}
        >
            <h2
                className="text-lg font-medium text-gray-100 mb-4"
            >Sales Overview</h2>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={salesData}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#4B5563"/>
                        <XAxis dataKey={"name"} stroke="#9ca3af"/>
                        <YAxis stroke="#9ca3af"/>
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: "rgba(31, 41, 55, 0.8)",
                                borderColor: "#4B5563",
                            }}
                            itemStyle={{ color: "#E5E7EB"}}
                        />
                        <Line 
                            type ="monotone"
                            dataKey="sales"
                            strokeWidth = {3}
                            dot = {{ fill: "#6366F1", strokeWidth: 2, r: 6}}
                            activeDot = {{ r: 8, strokeWidth:2}}
                            style={{background: 'red'}}
                         />
                         {/* <Line type="monotone" dataKey="sales" stroke="#6EE7B7" /> */}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    )
}

export default SalesOverviewChart;