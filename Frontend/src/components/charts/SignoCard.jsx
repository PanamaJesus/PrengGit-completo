import { PieChart, Pie, Cell } from "recharts";

export default function SignoCard({ title, valor, limite, unidad }) {

  const porcentaje = Math.min((valor / limite) * 100, 100);

  const data = [
    { name: "valor", value: porcentaje },
    { name: "peligro", value: 100 - porcentaje },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#FFC29B] flex items-center justify-between">
      
      {/* IZQUIERDA: TEXTO */}
      <div>
        <h3 className="text-lg font-semibold text-[#722323] mb-1">
          {title}
        </h3>

        <p className="text-4xl font-bold text-[#BA487F]">
          {valor}
          <span className="text-xl ml-1 text-[#722323] opacity-70">
            {unidad}
          </span>
        </p>

        <p className="text-sm text-[#E63B3B] font-semibold mt-1">
          Límite peligroso: {limite} {unidad}
        </p>
      </div>

      {/* DERECHA: GRÁFICA PIE */}
      <PieChart width={150} height={150}>
        <Pie
          data={data}
          dataKey="value"
          innerRadius={40}
          outerRadius={70}
          stroke="none"
        >
          <Cell fill="#BA487F" />  {/* valor */}
          <Cell fill="#E63B3B" />  {/* peligro */}
        </Pie>
      </PieChart>

    </div>
  );
}
