const socket = io();

document.getElementById(`formProduct`).addEventListener(`sumit`, function (event) {
    event.preventDefault()
    const dataForm = new FormData(EventTarget)
    const data = Object.fromEntries(dataForm.entries())

    socket.emit(`dataProducto`, data)

    event.target.reset()
})

function añadirProductos(producto) {
    const listaProducto = document.getElementById(`productos`)
    const item = document.createElement(`li`)
    item.id = `producto-${producto.id}`
    item.innerHTML = `ID: ${producto.id}, Nombre: ${producto.nombre}, Descripcion: ${producto.descripcion}, Codigo: ${producto.codigo}, Precio: ${producto.precio}, Stock: ${producto.stock} 
                             <button onclick="eliminarProducto(${producto.id})">Eliminar</button>`;
    listaProducto.appendChild(item)
}

function eliminarProducto(id) {
    socket.emit(`eliminarProducto`, {id})
}

socket.on(`productoEliminado`, (data) => {
    const item = document.getElementById(`producto-${data.id}`)
    if (item) {
        item.remove()
    }
})

socket.on(`dataProducto`, (data) => {
    añadirProductos(data)
})