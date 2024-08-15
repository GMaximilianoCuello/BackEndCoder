const socket = io();

document.addEventListener('DOMContentLoaded', async (event) => {
    console.log('DOM cargado');
    cargarProductos();

    const cartId = await obtenerCartId();
    if (cartId) {
        mostrarCarrito(cartId);
    }
});

function cargarProductos() {
    console.log('Cargando productos...');
    socket.emit('solicitarProductos');
}

function añadirProductos(producto) {
    const listaProducto = document.getElementById('products');

    if (!listaProducto) {
        console.error('Elemento con id "products" no encontrado.');
        return;
    }
    const item = document.createElement('li');
    item.id = `producto-${producto._id}`;
    item.innerHTML = `ID: ${producto._id}, Nombre: ${producto.nombre}, Descripcion: ${producto.descripcion}, Codigo: ${producto.codigo}, Precio: ${producto.precio}, Stock: ${producto.stock}
            `
    listaProducto.appendChild(item);
}

async function obtenerCartId() {

    try {
        const response = await fetch('/api/carts');
        const carrito = await response.json();

        if (carrito && carrito._id) {
            return carrito._id;

        } else {
            console.error('No se encontró un carrito.');
            return null;
        }

    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        return null;
    }
}

function mostrarCarrito() {
    fetch(`/api/carts/`)
        .then(response => response.json())
        .then(cart => {
            const cartProductsList = document.getElementById('cart-products');
            cartProductsList.innerHTML = '';
            if (cart.products && cart.products.length > 0) {
                cart.products.forEach(p => {
                    const li = document.createElement('li');
                    li.innerText = `Nombre:${p.producto.nombre} - Cantidad: ${p.cantidad}`;
                    cartProductsList.appendChild(li);
                });
            } else {
                cartProductsList.innerHTML = '<li>El carrito está vacío</li>';
            }
        })
        .catch(error => console.error('Error al obtener el carrito:', error));
}

function eliminarProducto(id) {
    socket.emit('eliminarProducto', { id });
}

socket.on('cartUpdated', (cart) => {
    console.log('Carrito actualizado recibido:', cart);
    const cartProductsList = document.getElementById('cart-products');
    cartProductsList.innerHTML = '';
    if (cart.productos && cart.productos.length > 0) {
        cart.productos.forEach(p => {
            const li = document.createElement('li');
            li.innerText = `${p.producto.nombre} - Cantidad: ${p.cantidad}`;
            cartProductsList.appendChild(li);
        });
    } else {
        cartProductsList.innerHTML = '<li>El carrito está vacío</li>';
    }
});



socket.on('productoEliminado', (data) => {
    const item = document.getElementById(`producto-${data.id}`);
    if (item) {
        item.remove();
    }
});

socket.on('dataProducto', (data) => {
    console.log('Productos recibidos:', data);
    data.forEach(añadirProductos);
});


