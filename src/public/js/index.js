const socket = io();

socket.on("products", (data) => {
    const productsContainer = document.getElementById('products-container');
    productsContainer.innerHTML = '';

    data.products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('card');
        productCard.innerHTML = `
            <p>${product.id}</p>
            <h2>${product.title}</h2>
            <p>${product.description}</p>
            <p><strong>Código:</strong> ${product.code}</p>
            <p><strong>Precio:</strong> ${product.price}</p>
            <p><strong>Status:</strong> ${product.status=true}</p>
            <p><strong>Stock:</strong> ${product.stock}</p>
            <p><strong>Categoría:</strong> ${product.category}</p>
        `;
        productsContainer.appendChild(productCard);
    });
    document.getElementById('product-form').addEventListener('submit', (event) => {
        console.log("formulario enviado");
        event.preventDefault(); // Prevenir el comportamiento predeterminado del formulario
    
        const newProduct = {
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            code: document.getElementById('code').value,
            price: parseFloat(document.getElementById('price').value),
            stock: parseInt(document.getElementById('stock').value),
            category: document.getElementById('category').value,
        };
    
        socket.emit('addProduct', newProduct); // Emitir el nuevo producto al servidor
        // Limpiar el formulario
        document.getElementById('product-form').reset();
    });
});