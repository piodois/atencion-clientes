import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import * as XLSX from 'xlsx/xlsx.js';

function App() {
  const [atenciones, setAtenciones] = useState([]);
  const [formData, setFormData] = useState({
    rut: '',
    nombre: '',
    comuna: '',
    tipoSubsidio: '',
    comentario: '',
  });
  const [inicioAtencion, setInicioAtencion] = useState(null);
  const [formHabilitado, setFormHabilitado] = useState(false);

  useEffect(() => {
    fetchAtenciones();
  }, []);

  const fetchAtenciones = async () => {
    try {
      const response = await fetch('/api/atenciones');
      const data = await response.json();
      setAtenciones(data.data);
    } catch (error) {
      console.error('Error fetching atenciones:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finAtencion = new Date();
    const duracion = inicioAtencion ? (finAtencion - inicioAtencion) / 1000 : 0;

    const nuevaAtencion = {
      ...formData,
      horaInicio: format(inicioAtencion, 'HH:mm:ss'),
      horaFin: format(finAtencion, 'HH:mm:ss'),
      duracion: Math.round(duracion),
    };

    try {
      const response = await fetch('/api/atenciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevaAtencion),
      });
      if (response.ok) {
        fetchAtenciones();
        setFormData({
          rut: '',
          nombre: '',
          comuna: '',
          tipoSubsidio: '',
          comentario: '',
        });
        setInicioAtencion(null);
        setFormHabilitado(false);
      }
    } catch (error) {
      console.error('Error saving atencion:', error);
    }
  };

  const iniciarAtencion = () => {
    setInicioAtencion(new Date());
    setFormHabilitado(true);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(atenciones);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Atenciones");
    XLSX.writeFile(wb, "atenciones.xlsx");
  };

  const isFormValid = () => {
    return formData.rut && formData.nombre && formData.comuna && formData.tipoSubsidio;
  };

  return (
    <div className="min-h-screen bg-blue-100 p-8">
      <h1 className="text-4xl font-bold text-center text-red-600 mb-8">Registro de Atenciones</h1>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rut">
            RUT
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="rut"
            type="text"
            name="rut"
            value={formData.rut}
            onChange={handleInputChange}
            required
            disabled={!formHabilitado}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
            Nombre
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="nombre"
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            required
            disabled={!formHabilitado}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="comuna">
            Comuna
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="comuna"
            type="text"
            name="comuna"
            value={formData.comuna}
            onChange={handleInputChange}
            required
            disabled={!formHabilitado}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tipoSubsidio">
            Tipo de Subsidio
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="tipoSubsidio"
            type="text"
            name="tipoSubsidio"
            value={formData.tipoSubsidio}
            onChange={handleInputChange}
            required
            disabled={!formHabilitado}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="comentario">
            Comentario
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="comentario"
            name="comentario"
            value={formData.comentario}
            onChange={handleInputChange}
            disabled={!formHabilitado}
          ></textarea>
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={iniciarAtencion}
            disabled={inicioAtencion !== null}
          >
            Iniciar Atención
          </button>
          <button
            className={`bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              (!formHabilitado || !isFormValid()) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            type="submit"
            disabled={!formHabilitado || !isFormValid()}
          >
            Registrar Atención
          </button>
        </div>
      </form>

      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-4">Atenciones Registradas</h2>
        <table className="w-full text-left table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">RUT</th>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Comuna</th>
              <th className="px-4 py-2">Tipo de Subsidio</th>
              <th className="px-4 py-2">Hora Inicio</th>
              <th className="px-4 py-2">Hora Fin</th>
              <th className="px-4 py-2">Duración (s)</th>
            </tr>
          </thead>
          <tbody>
            {atenciones.map((atencion, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                <td className="border px-4 py-2">{atencion.rut}</td>
                <td className="border px-4 py-2">{atencion.nombre}</td>
                <td className="border px-4 py-2">{atencion.comuna}</td>
                <td className="border px-4 py-2">{atencion.tipoSubsidio}</td>
                <td className="border px-4 py-2">{atencion.horaInicio}</td>
                <td className="border px-4 py-2">{atencion.horaFin}</td>
                <td className="border px-4 py-2">{atencion.duracion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-center">
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={exportToExcel}
        >
          Descargar Excel
        </button>
      </div>
    </div>
  );
}

export default App;