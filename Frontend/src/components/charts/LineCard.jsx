import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function LineCard({ title, data }) {
  return (
    <div className="bg-white rounded-xl shadow border border-[#FFC29B] p-6">
      <h3 className="text-xl font-bold text-[#722323] mb-4">{title}</h3>

      <LineChart width={380} height={250} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="fecha" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="valor" stroke="#FF9587" strokeWidth={3} />
      </LineChart>
    </div>
  );
}
