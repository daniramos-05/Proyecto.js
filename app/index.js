document.addEventListener("DOMContentLoaded", function () {
  const cartButton = document.getElementById("cart-button");
  const cartMenu = document.getElementById("cart-menu");
  const closeModalButtons = document.querySelectorAll(".close");

  cartButton.addEventListener("click", function () {
    cartMenu.style.display = "block";
  });

  closeModalButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      cartMenu.style.display = "none";
    });
  });

  const contenedorRopa = document.querySelector(".contenedor-ropa");
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotalPrice = document.getElementById("cart-total-price");
  let totalCarrito = 0;

  function actualizarTotalCarrito() {
    totalCarrito = 0;
    const itemsEnCarrito = cartItemsContainer.querySelectorAll(".cart-item");
    itemsEnCarrito.forEach(function (item) {
      const precio = parseFloat(
        item.querySelector(".precio").textContent.slice(1)
      );
      totalCarrito += precio;
    });
    cartTotalPrice.textContent = totalCarrito.toFixed(2);
  }

  function agregarAlCarrito(nombre, precio, imagenUrl) {
    let productoExistente = null;
    const itemsEnCarrito = cartItemsContainer.querySelectorAll(".cart-item");
    itemsEnCarrito.forEach(function (item) {
      const idProducto = item.dataset.id;
      if (idProducto === nombre) {
        productoExistente = item;
      }
    });

    if (productoExistente) {
      // Si el producto ya está en el carrito, aumenta la cantidad
      const cantidadElemento = productoExistente.querySelector(".cantidad");
      const cantidad = parseInt(cantidadElemento.textContent) + 1;
      cantidadElemento.textContent = cantidad;
    } else {
      // Si el producto no está en el carrito, agrega un nuevo elemento
      const productoTarjeta = document.createElement("li");
      productoTarjeta.classList.add("cart-item");
      productoTarjeta.dataset.id = nombre;

      const imagen = document.createElement("img");
      imagen.src = imagenUrl;
      imagen.alt = nombre;
      productoTarjeta.appendChild(imagen);

      const nombreProducto = document.createElement("span");
      nombreProducto.classList.add("nombre");
      nombreProducto.textContent = nombre;
      productoTarjeta.appendChild(nombreProducto);

      const precioProducto = document.createElement("span");
      precioProducto.classList.add("precio");
      precioProducto.textContent = `$${precio.toFixed(2)}`;
      productoTarjeta.appendChild(precioProducto);

      const cantidadProducto = document.createElement("span");
      cantidadProducto.classList.add("cantidad");
      cantidadProducto.textContent = "1";
      productoTarjeta.appendChild(cantidadProducto);

      const botonEliminar = document.createElement("button");
      botonEliminar.textContent = "X";
      botonEliminar.classList.add("eliminar-item");
      botonEliminar.addEventListener("click", function () {
        cartItemsContainer.removeChild(productoTarjeta);
        actualizarTotalCarrito();
      });
      productoTarjeta.appendChild(botonEliminar);

      cartItemsContainer.appendChild(productoTarjeta);
    }

    // Actualizar el total del carrito después de agregar un producto
    actualizarTotalCarrito();
  }

  function actualizarTotalCarrito() {
    let totalCarrito = 0;
    const itemsEnCarrito = cartItemsContainer.querySelectorAll(".cart-item");
    itemsEnCarrito.forEach(function (item) {
      const precio = parseFloat(
        item.querySelector(".precio").textContent.slice(1)
      );
      const cantidad = parseInt(item.querySelector(".cantidad").textContent);
      totalCarrito += precio * cantidad;
    });
    cartTotalPrice.textContent = totalCarrito.toFixed(2);
  }

  function filtrarProductos(categoria) {
    const productos = document.querySelectorAll(".ropa");
    productos.forEach(function (producto) {
      const categoriaProducto = producto.dataset.categoria;
      if (categoria === "todo" || categoriaProducto === categoria) {
        producto.classList.remove("oculto");
      } else {
        producto.classList.add("oculto");
      }
    });
  }
  const iconoCalzado = document.getElementById("icono-calzado");
  iconoCalzado.addEventListener("click", function () {
    filtrarProductos("calzado");
  });
  const iconoAccesorios = document.getElementById("icono-accesorios");
  iconoAccesorios.addEventListener("click", function () {
    filtrarProductos("accesorios");
  });
  const iconoRemeras = document.getElementById("icono-remeras");
  iconoRemeras.addEventListener("click", function () {
    filtrarProductos("remeras");
  });
  const iconoTodoStock = document.getElementById("icono-todo");
  iconoTodoStock.addEventListener("click", function () {
    filtrarProductos("todo");
  });

  const botonesComprar = document.querySelectorAll(".ropa button");
  botonesComprar.forEach(function (boton) {
    boton.addEventListener("click", function () {
      const producto = this.parentNode;
      const nombre = producto.querySelector("h3").textContent;
      const precio = parseFloat(
        producto.querySelector("h4").textContent.slice(1)
      );
      const imagenUrl = producto.querySelector(".img-ropa").src;

      agregarAlCarrito(nombre, precio, imagenUrl);
      actualizarTotalCarrito();
    });
  });

  const cartModal = document.getElementById("cart-modal");
  const checkoutButton = document.getElementById("checkout-button");
  checkoutButton.addEventListener("click", function () {
    if (cartItemsContainer.children.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "No puedes comprar nada porque no hay productos en el carrito.",
        footer: '<a href="#"></a>',
      });
    } else {
      Swal.fire({
        title: "¿Estás seguro?",
        text: "No podrás revertir esto",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, comprar",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "¡Comprado!",
            text: "Tu compra ha sido realizada con éxito",
            icon: "success",
          });

          cartItemsContainer.innerHTML = "";
          totalCarrito = 0;
          cartTotalPrice.textContent = totalCarrito.toFixed(2);
        }
      });
    }
  });

  const openCartButton = document.getElementById("cart-button");
  openCartButton.addEventListener("click", function () {
    actualizarTotalCarrito();
  });
});

function guardarCarritoEnLocalStorage() {
  localStorage.setItem(
    "carrito",
    JSON.stringify(Array.from(cartItemsContainer.children))
  );
}

function cargarCarritoDesdeLocalStorage() {
  const carritoGuardado = JSON.parse(localStorage.getItem("carrito"));
  if (carritoGuardado) {
    carritoGuardado.forEach((item) => cartItemsContainer.appendChild(item));
    actualizarTotalCarrito();
  }
}

document.addEventListener("DOMContentLoaded", cargarCarritoDesdeLocalStorage);

function agregarAlCarrito(nombre, precio, imagenUrl) {
  guardarCarritoEnLocalStorage();
}

function actualizarTotalCarrito() {
  guardarCarritoEnLocalStorage();
}

function limpiarCarrito() {
  cartItemsContainer.innerHTML = "";
  totalCarrito = 0;
  cartTotalPrice.textContent = totalCarrito.toFixed(2);
  guardarCarritoEnLocalStorage();
}
try {
  const producto = this.parentNode;
  const nombre = producto.querySelector("h3").textContent;
  const precio = parseFloat(producto.querySelector("h4").textContent.slice(1));
  const imagenUrl = producto.querySelector(".img-ropa").src;

  agregarAlCarrito(nombre, precio, imagenUrl);
  actualizarTotalCarrito();
} catch (error) {
  console.error("Ocurrió un error:", error);
}
