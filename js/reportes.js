// Función principal que se ejecuta al presionar el botón "Generar Reportes"
document.getElementById('generarReporteBtn').addEventListener('click', generarReportes);

// Función para generar reportes de períodos seleccionados
function generarReportes() {
    // Obtener las fechas seleccionadas del formulario
    const fechaInicioAnterior = document.getElementById('fechaInicioAnterior').value;
    const fechaFinAnterior = document.getElementById('fechaFinAnterior').value;
    const fechaInicioActual = document.getElementById('fechaInicioActual').value;
    const fechaFinActual = document.getElementById('fechaFinActual').value;

    // Validar que todas las fechas estén completas
    if (!fechaInicioAnterior || !fechaFinAnterior || !fechaInicioActual || !fechaFinActual) {
        alert("Por favor, complete todas las fechas.");
        return;
    }

    // Obtener los datos del localStorage
    const datosGuardados = JSON.parse(localStorage.getItem('resultados')) || [];

    // Filtrar los datos por período
    const periodoAnterior = filtrarDatosPorFecha(datosGuardados, fechaInicioAnterior, fechaFinAnterior);
    const periodoActual = filtrarDatosPorFecha(datosGuardados, fechaInicioActual, fechaFinActual);

    // Calcular totales para cada período
    const totalesAnterior = calcularTotales(periodoAnterior);
    const totalesActual = calcularTotales(periodoActual);

    // Mostrar resultados en las tablas
    mostrarResultados('tablaAnterior', totalesAnterior);
    mostrarResultados('tablaActual', totalesActual);
    mostrarComparacion('tablaComparacion', totalesAnterior, totalesActual);
}

// Filtrar datos por un rango de fechas
function filtrarDatosPorFecha(datos, inicio, fin) {
    return datos.filter(dato => dato.fecha >= inicio && dato.fecha <= fin);
}

// Calcular totales de ventas y clientes
function calcularTotales(datos) {
    let ventas = 0, clientes = 0;
    datos.forEach(dato => {
        ventas += dato.ventas || 0;
        clientes += dato.clientes || 0;
    });
    return { ventas, clientes };
}

// Mostrar resultados en la tabla específica
function mostrarResultados(tablaId, totales) {
    document.getElementById(tablaId).innerHTML = `
        <tr>
            <td>Ventas Totales</td>
            <td>$${totales.ventas.toFixed(2)}</td>
        </tr>
        <tr>
            <td>Clientes Totales</td>
            <td>${totales.clientes}</td>
        </tr>
    `;
}

// Mostrar la comparación entre dos períodos con diferencia porcentual
function mostrarComparacion(tablaId, anterior, actual) {
    const diferenciaVentas = actual.ventas - anterior.ventas;
    const diferenciaClientes = actual.clientes - anterior.clientes;

    const porcentajeVentas = calcularPorcentaje(diferenciaVentas, anterior.ventas);
    const porcentajeClientes = calcularPorcentaje(diferenciaClientes, anterior.clientes);

    document.getElementById(tablaId).innerHTML = `
        <tr>
            <td>Ventas</td>
            <td class="${diferenciaVentas >= 0 ? 'text-success' : 'text-danger'}">
                ${diferenciaVentas.toFixed(2)} (${porcentajeVentas}%)
            </td>
        </tr>
        <tr>
            <td>Clientes</td>
            <td class="${diferenciaClientes >= 0 ? 'text-success' : 'text-danger'}">
                ${diferenciaClientes} (${porcentajeClientes}%)
            </td>
        </tr>
    `;
}

// Calcular el porcentaje de diferencia
function calcularPorcentaje(diferencia, totalAnterior) {
    if (totalAnterior === 0) return diferencia > 0 ? 100 : -100;
    return ((diferencia / totalAnterior) * 100).toFixed(2);
}
