import React, { useState, useEffect } from 'react';

export default function Cotizador() {
  // --- ESTADOS ---
  // Estado para guardar los precios cargados desde data.json
  const [precios, setPrecios] = useState(null);
  
  // Estados para las selecciones del usuario
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [selectedColor, setSelectedColor] = useState(null);
  const [largoMesada, setLargoMesada] = useState('');
  const [anchoMesada, setAnchoMesada] = useState('');
  const [largoZocalo, setLargoZocalo] = useState('');
  const [selectedBacha, setSelectedBacha] = useState(null);
  
  // Estado para el total calculado
  const [total, setTotal] = useState(0);

  // --- EFECTOS ---
  // useEffect para cargar los datos del JSON una sola vez cuando el componente se monta
  useEffect(() => {
    fetch('/data.json')
      .then(response => response.json())
      .then(data => setPrecios(data))
      .catch(error => console.error("Error al cargar los precios:", error));
  }, []); // El array vacío [] significa que solo se ejecuta una vez.

  // useEffect para recalcular el total cada vez que una opción cambia
  useEffect(() => {
    if (!precios) return; // Si aún no se han cargado los precios, no hacer nada.

    let calculo = 0;

    // 1. Cálculo de la mesada
    if (selectedColor && largoMesada > 0 && anchoMesada > 0) {
      const areaMesadaM2 = (largoMesada * anchoMesada) / 10000;
      const precioColor = precios.colores.find(c => c.id === selectedColor)?.precio_m2 || 0;
      calculo += areaMesadaM2 * precioColor;
    }

    // 2. Cálculo de la bacha
    if (selectedBacha) {
        // ... (Aquí iría la lógica para sumar el precio de la bacha)
        // ... (Y el costo de corte y pegado)
    }

    // ... (Aquí iría el resto de los cálculos: zócalo, forma, etc.)

    setTotal(calculo);
  }, [selectedColor, largoMesada, anchoMesada, selectedBacha, precios]); // Este efecto se ejecuta si cualquiera de estos valores cambia.


  // Si los precios aún no se han cargado, muestra un mensaje
  if (!precios) {
    return <div>Cargando cotizador...</div>;
  }

  // --- RENDERIZADO (JSX) ---
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg font-sans">
        {/* --- Logo y Título --- */}
        <img src="/imagenes/logo.jpg" alt="Logo de Rústicos Mendoza" className="mx-auto my-4 w-48" />
        <h1 className="text-3xl font-bold text-center text-gray-800">Presupuesto de Mesadas</h1>

        {/* --- Sección de Colores --- */}
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-700">2. Tipo de Color</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {precios.colores.map((color) => (
                <div 
                    key={color.id} 
                    onClick={() => setSelectedColor(color.id)}
                    // Tailwind CSS para cambiar el estilo si está seleccionado
                    className={`border-2 p-2 rounded-lg cursor-pointer text-center transition ${selectedColor === color.id ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}
                >
                    <img src={color.imagen} alt={color.nombre} className="w-full h-24 object-cover rounded-md mb-2" />
                    <span className="font-medium text-sm">{color.nombre}</span>
                </div>
            ))}
        </div>

        {/* --- Sección de Medidas --- */}
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-700">3. Medidas de la Mesada (en cm)</h2>
        <div className="flex gap-4">
            <input type="number" placeholder="Largo" value={largoMesada} onChange={e => setLargoMesada(e.target.value)} className="w-full p-2 border rounded" />
            <input type="number" placeholder="Ancho" value={anchoMesada} onChange={e => setAnchoMesada(e.target.value)} className="w-full p-2 border rounded" />
        </div>

        {/* --- Sección del Total --- */}
        <div className="mt-10 p-6 bg-blue-50 border-2 border-blue-500 rounded-lg text-center">
            <h3 className="text-xl font-bold text-gray-800">TOTAL ESTIMADO:</h3>
            <p className="text-4xl font-bold text-gray-900 mt-2">
                ${total.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ARS
            </p>
        </div>
    </div>
  );
}