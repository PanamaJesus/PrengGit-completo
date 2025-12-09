import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function BarCard({ title, data }) {
  return (
    <div className="bg-white rounded-xl shadow border border-[#FFC29B] p-6">
      <h3 className="text-xl font-bold text-[#722323] mb-4">{title}</h3>

      <BarChart width={350} height={250} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#BA487F" />
      </BarChart>
    </div>
  );
}
