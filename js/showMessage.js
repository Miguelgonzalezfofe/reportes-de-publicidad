export function showMessage(mensaje, type = "success") {
    Toastify({
        text: mensaje,
        duration: 3500,
        close: true,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: type === 'success'? 'green': 'red',
        },
        onClick: function () { } // Callback after click
    }).showToast();
}