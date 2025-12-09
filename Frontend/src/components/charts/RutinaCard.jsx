import SignoGauge from "./SignoGauge";

export default function RutinaCard({ rutina }) {
  const { nombre, promedios } = rutina;

  return (
    <div className="p-5 bg-white rounded-2xl shadow-md border border-pink-200">
      <h3 className="text-xl font-bold text-[#722323] mb-4">
        {nombre}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        <SignoGauge
          title="Frecuencia Cardíaca"
          valor={promedios.frecuenciaCardiaca}
          unidad="bpm"
          rangos={{ normalMin: 70, normalMax: 100, peligroMin: 120, peligroMax: 160 }}
        />

        <SignoGauge
          title="Presión Sistólica"
          valor={promedios.presionSistolica}
          unidad="mmHg"
          rangos={{ normalMin: 90, normalMax: 120, peligroMin: 140, peligroMax: 180 }}
        />

        <SignoGauge
          title="Oxigenación"
          valor={promedios.oxigenacion}
          unidad="%"
          rangos={{ normalMin: 95, normalMax: 100, peligroMin: 91, peligroMax: 100 }}
        />

      </div>
    </div>
  );
}
