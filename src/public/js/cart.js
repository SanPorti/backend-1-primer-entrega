const addBtns = document.querySelectorAll(".add-btn");

//Logica para  agregar el producto al carrito desde el boton "Agregar al carrito"
addBtns.forEach((button) => {
    button.addEventListener("click", (event) => {
        const idProduct = event.target.getAttribute("data-id");
        const cartId = localStorage.getItem("cartId");
        if(!cartId){
            fetch("/api/carts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((response) => response.json())
                .then(async (cart) => {
                    const idCart = cart.payload._id;
                    localStorage.setItem("cartId", idCart);

                    fetch(`/api/carts/${idCart}/product/${idProduct}`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",

                        },
                    })
                        .then((response) => response.json())
                        .then(() => {

                            Swal.fire({
                                toast: true,
                                position: "top-end",
                                showConfirmButton: false,
                                timer: 2000,
                                timerProgressBar: true,
                                title: "Se ha agregado el producto al carrito",
                                icon: "success",
                            });
                        });
                });
        } else {

            fetch(`/api/carts/${cartId}/product/${idProduct}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",

                },
            })
                .then((response) => response.json())
                .then(() => {

                    Swal.fire({
                        toast: true,
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 2000,
                        timerProgressBar: true,
                        title: "Se ha agregado el producto al carrito",
                        icon: "success",
                    });
                });
        }

    });
}); 

const removeBtns = document.querySelectorAll(".remove-btn");

removeBtns.forEach((button) => {
    button.addEventListener("click", (event) => {
        const productId = event.target.getAttribute("data-id");
        const cartId = localStorage.getItem("cartId");

        if (cartId) {
            fetch(`/api/carts/${cartId}/products/${productId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {
                if (response.ok) {
                    // Eliminar el producto del DOM
                    const card = event.target.closest(".card");
                    card.remove();
                    
                    Swal.fire({
                        toast: true,
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 2000,
                        timerProgressBar: true,
                        title: "Producto eliminado del carrito",
                        icon: "success",
                    });
                } else {
                    Swal.fire({
                        toast: true,
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 2000,
                        timerProgressBar: true,
                        title: "Error al eliminar el producto",
                        icon: "error",
                    });
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
        } else {
            Swal.fire({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                title: "No hay carrito disponible",
                icon: "warning",
            });
        }
    });
});
