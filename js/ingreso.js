// Ejecutar al cargar la página para mostrar los datos guardados
document.addEventListener('DOMContentLoaded', mostrarDatosGuardados);

// Event Listener para guardar datos al enviar el formulario
document.getElementById('formDatos').addEventListener('submit', guardarDatos);

// Función para guardar datos en localStorage
function guardarDatos(event) {
    event.preventDefault(); // Evita que la página se recargue al enviar el formulario

    // Obtener valores del formulario
    const fecha = document.getElementById('fecha').value;
    const ventas = parseFloat(document.getElementById('ventas').value);
    const clientes = parseInt(document.getElementById('clientes').value);

    // Validar datos
    if (!fecha || isNaN(ventas) || isNaN(clientes)) {
        alert("Por favor, complete todos los campos correctamente.");
        return;
    }

    // Crear un objeto con los datos
    const nuevoDato = { fecha, ventas, clientes };

    // Obtener datos existentes o inicializar el array
    const datosGuardados = JSON.parse(localStorage.getItem('resultados')) || [];

    // Agregar el nuevo dato
    datosGuardados.push(nuevoDato);

    // Guardar en localStorage
    localStorage.setItem('resultados', JSON.stringify(datosGuardados));

    // Mostrar datos actualizados
    mostrarDatosGuardados();

    // Limpiar el formulario
    document.getElementById('formDatos').reset();
}

// Función para mostrar los datos guardados en la tabla
function mostrarDatosGuardados() {
    const tabla = document.getElementById('tablaDatos');
    const datosGuardados = JSON.parse(localStorage.getItem('resultados')) || [];

    // Limpiar la tabla
    tabla.innerHTML = '';

    // Agregar filas con los datos
    datosGuardados.forEach(dato => {
        const fila = `
            <tr>
                <td>${dato.fecha}</td>
                <td>$${dato.ventas.toFixed(2)}</td>
                <td>${dato.clientes}</td>
            </tr>
        `;
        tabla.insertAdjacentHTML('beforeend', fila);
    });
}
