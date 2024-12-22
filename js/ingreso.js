import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js'
import { auth, getData, upDateData } from './index.js';
import { showMessage } from './showMessage.js';
let emailUser = '';
onAuthStateChanged(auth, (user) => {
    if (user) {
        emailUser = user.email
        if (!JSON.parse(localStorage.getItem('resultados'))) {
            sincronizarConFirebase(emailUser);
        }
    }
})

// Ejecutar al cargar la página para mostrar los datos guardados
document.addEventListener('DOMContentLoaded', mostrarDatosGuardados);

// Event Listener para guardar datos al enviar el formulario
document.getElementById('formDatos').addEventListener('submit', guardarDatos);

// Función para sincronizar los datos del localStorage con Firebase
async function sincronizarConFirebase(emailUser) {
    let spinner = document.getElementById('spinner');
    spinner.classList.toggle("visually-hidden")

    // Obtener los datos desde localStorage
    let datosLocales = JSON.parse(localStorage.getItem('resultados')) || [];
    const datosFirebase = await getData(emailUser);

    if (datosLocales.length === 0 && !datosFirebase) {
        showMessage("No hay datos para sincronizar");
        return;
    }

    if (datosLocales.length === 0 && datosFirebase) {
        datosLocales = datosFirebase.data().dato
    }

    try {
        // Guardar los datos en Firebase
        await upDateData(emailUser, { dato: datosLocales });

        // Actualizar la última sincronización
        localStorage.setItem('ultimaSincronizacion', Date.now());

        // actualizar resultados en localstorage
        localStorage.setItem('resultados', JSON.stringify(datosLocales));
        mostrarDatosGuardados();
        spinner.classList.toggle("visually-hidden")

        showMessage("Datos sincronizados", "success");
    } catch (error) {
        console.error("Error durante la sincronización:", error);
        showMessage("Error al sincronizar");
    }
}

const btnSincronizar = document.getElementById('btnSincronizar');
btnSincronizar.addEventListener('click', async () => sincronizarConFirebase(emailUser));

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
    datosGuardados.forEach((dato, index) => {
        // Crear una nueva fila (tr)
        const fila = document.createElement('tr');

        // Crear y agregar la primera celda (fecha)
        const celdaFecha = document.createElement('td');
        celdaFecha.textContent = dato.fecha;
        fila.appendChild(celdaFecha);

        // Crear y agregar la segunda celda (ventas)
        const celdaVentas = document.createElement('td');
        celdaVentas.textContent = `$${dato.ventas.toFixed(2)}`;
        fila.appendChild(celdaVentas);

        // Crear y agregar la tercera celda (clientes)
        const celdaClientes = document.createElement('td');
        celdaClientes.textContent = dato.clientes;
        fila.appendChild(celdaClientes);

        // Crear la celda del botón "Eliminar"
        const celdaBoton = document.createElement('td');
        const eliminarBtn = document.createElement('button');
        eliminarBtn.className = 'btn btn-danger';
        eliminarBtn.textContent = 'Eliminar';
        eliminarBtn.addEventListener('click', () => eliminarDato(index));  // Agregar evento de eliminación
        celdaBoton.appendChild(eliminarBtn);  // Agregar el botón a la celda
        fila.appendChild(celdaBoton);  // Agregar la celda a la fila

        // Agregar la fila a la tabla
        tabla.appendChild(fila);
    });
}

// Eliminar un dato específico
function eliminarDato(index) {
    let datos = JSON.parse(localStorage.getItem("resultados")) || [];
    datos.splice(index, 1); // Elimina el dato en la posición "index"
    localStorage.setItem("resultados", JSON.stringify(datos));
    mostrarDatosGuardados(); // Actualiza la tabla
}
