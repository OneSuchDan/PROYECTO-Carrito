//variables
const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const listaLibros = document.querySelector('#lista-libros');
const buscarLibros = document.querySelector('#busqueda');
const busquedaContenedor = document.querySelectorAll("#lista-libros .row")
let articulosCarrito = [];
let busquedaContainer = [];
let numeroBusquedas = 0

cargarEventListeners();
function cargarEventListeners() {
    //Cuando agregas curso presionando "agregar al carrito"
    listaLibros.addEventListener('click', agregarCurso);

    //Elimina cursos del carrito
    carrito.addEventListener('click', eliminarCurso);

    //Vaciar el carrito
    vaciarCarritoBtn.addEventListener('click', () => {
        articulosCarrito = [];
        limpiarHTML(); //Eliminamos todo el HTML
    })
    saveHTMLCursosLocalStorage(listaLibros);
    busquedaContainer.push(listaLibros)
    //Busqueda de curso
    buscarLibros.addEventListener('keydown', busquedaCurso);

}

//funciones
function agregarCurso(e) {
    e.preventDefault();
    if (e.target.classList.contains('agregar-carrito')) {
        const cursoSeleccionado = e.target.parentElement.parentElement;
        // console.log(e.target.parentElement.parentElement);
        leerDatosCurso(cursoSeleccionado);
    }

}

//Eliminar curso del carrito
function eliminarCurso(e) {
    // console.log(e.target.classList);
    if (e.target.classList.contains('borrar-curso')) {
        const cursoId = e.target.getAttribute('data-id');

        //Eliminar del arreglo de articulos carrido por el data-id
        articulosCarrito = articulosCarrito.filter(curso => curso.id !== cursoId)
        carritoHTML(); //Iterar sobre el carrito y mostrar su html

    }

}

// lee el contenido del html que le dimos click y extrae informacion del curso
function leerDatosCurso(curso) {
    // console.log(curso);

    //Crear un objeto con el contenido del curso actual
    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precio: curso.querySelector('.precio span').textContent,
        id: curso.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    }

    //Revisa si un elemento ya existe en el carrito
    const existe = articulosCarrito.some(curso => curso.id === infoCurso.id);
    if (existe) {
        //actualizamos cantidad
        const cursos = articulosCarrito.map(curso => {
            if (curso.id === infoCurso.id) {
                curso.cantidad++;
                return curso; //Retorna el objeto actualizado
            } else {
                return curso; //retorna los objetos que no son los duplicados
            }
        });
        articulosCarrito = [...cursos];

    } else {
        //Agregamos el curso al carrito
        articulosCarrito = [...articulosCarrito, infoCurso];
    }

    console.log(articulosCarrito);
    carritoHTML();


}
// Muestra el carrito de compras en el HTML
function carritoHTML() {

    //Limpiar HTML
    limpiarHTML();
    //Recorre el carrito y genera el HTML

    articulosCarrito.forEach(curso => {
        const { imagen, titulo, precio, cantidad, id } = curso;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${imagen}" width = "100"></td>
            <td>${titulo}</td>
            <td>${precio}</td>
            <td>${cantidad}</td>
            <td>
                <a href="#" class="borrar-curso" data-id="${id}">X</a>
            <td>
        `
        //Agrega html del carrito en tbody
        contenedorCarrito.appendChild(row);
    })
}

//Elimina los cursos del tbody

function limpiarHTML() {
    //Forma lenta 
    // contenedorCarrito.innerHTML = '';
    while (contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
}

function limpiarListaHTML() {
    while (listaLibros.firstChild) {
        listaLibros.removeChild(listaLibros.firstChild);
    }
}

function busquedaCurso(e) {
    
const valor = e.target.value.trim()


if (e.key === 'Enter') {
    numeroBusquedas++
        if (valor == '') {
            restoreHTMLCursosLocalStorage();
        }
        else {
            numeroBusquedas === 1?busquedaContainer=[...listaLibros.childNodes]:""
            limpiarListaHTML()
            const titulo = document.createElement("h1")
            titulo.id = "encabezado"
            titulo.className = "encabezado"
            titulo.textContent = `Resultados de busqueda "${e.target.value}"`
            listaLibros.append(titulo);
            busquedaContainer.filter(
                e=>e.hasChildNodes()&&e.textContent.toUpperCase().includes(valor.toUpperCase())
            ).forEach(value=>{
                let iteradorCard = value.querySelectorAll("div .info-card")
                iteradorCard.forEach(e=>{
                    if(e.textContent.toUpperCase().includes(valor.toUpperCase())){
                        console.log("encontrado")
                        let findedCourse = document.createElement("div");
                        findedCourse.className = "four columns";
                        findedCourse.innerHTML = e.parentElement.innerHTML;
                        listaLibros.append(findedCourse);
                    }
                });
            })



        }

    }
     

}
function saveHTMLCursosLocalStorage(element) {
    if (element) {
        localStorage.setItem("buscando", element.innerHTML)
    }
}
function restoreHTMLCursosLocalStorage() {
    const savedHTML = localStorage.getItem("buscando");
    const element = listaLibros;
    if (savedHTML && element) {
        element.innerHTML = savedHTML;
    }
}