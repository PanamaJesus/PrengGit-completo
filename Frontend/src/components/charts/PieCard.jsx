import { PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = ["#BA487F", "#FF9587", "#FFC29B", "#FFD8A9"];

export default function PieCard({ title, data }) {
  return (
    <div className="bg-white rounded-xl shadow border border-[#FFC29B] p-6">
      <h3 className="text-xl font-bold text-[#722323] mb-4">{title}</h3>

      <div className="flex justify-center">
        <PieChart width={240} height={240}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={50}
            outerRadius={90}
            paddingAngle={3}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
    </div>
  );
}
