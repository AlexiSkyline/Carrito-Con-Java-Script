//Variables 
const carrito = document.querySelector( '#carrito' );
const contenedorCarrito = document.querySelector( '#lista-carrito tbody' );
const vaciarCarritoBtn = document.querySelector( '#vaciar-carrito' );
const listaCursos = document.querySelector( '#lista-cursos' );
let articulosCarrito = [];

cargarEventLiterners();

function cargarEventLiterners() {
    //Cuando agregas un curso presionando "Agregar al Carrito"
    listaCursos.addEventListener( 'click' , agregarCurso );

    //Elimina curso del carrito
    carrito.addEventListener( 'click', eliminarCurso );

    // Muestra los cursos de localStorage 
    document.addEventListener( 'DOMContentLoaded', () => {
        articulosCarrito = JSON.parse( localStorage.getItem( 'carrito' ) ) || [];
        carritoHTML();
    });
    //Vaciar el carrito
    vaciarCarritoBtn.addEventListener( 'click', () => {
        articulosCarrito = []; //Reseteamos el arreglo
        carritoHTML();//Para eliminar todo el html
    });
}

//Funciones
function agregarCurso(e){
    e.preventDefault();
    if( e.target.classList.contains('agregar-carrito') ){
        const cursoSeleccionado = e.target.parentElement.parentElement;
        leerDatosCurso(cursoSeleccionado);
    }
}
//Elimina un curso del carrito
function eliminarCurso( e ){
    if( e.target.classList.contains( 'borrar-curso' ) ){
        const cursoId = e.target.getAttribute( 'data-id' );

        //Elimina del arreglo por el data id
        articulosCarrito = articulosCarrito.filter( curso => curso.id !== cursoId ); 
        
        carritoHTML();//Iterar sobre el carrito y mostrar su HTML
    }
}



//Lee el contenido del HTML al que le dimos click y extrae la información del curso
function leerDatosCurso( curso ){
    // Crear un Objeto con el contenido del curso actual 
    const infoCurso = {
        imagen: curso.querySelector( 'img' ).src,
        titulo : curso.querySelector( 'h4' ).textContent,
        precio : curso.querySelector( '.precio span' ).textContent,
        id : curso.querySelector( 'a' ).getAttribute( 'data-id' ),
        cantidad : 1
    };
    //Revisa si un elemento ya existe en el carrito
    const exite = articulosCarrito.some( curso => curso.id === infoCurso.id );
    if( exite ){
        //Actualizamos la cantidad
        const cursos = articulosCarrito.map( curso => { 
            if( curso.id === infoCurso.id  ) {
                curso.cantidad++;
                return curso;//Retorna el objeto actualizado
            }else{
                return curso;//Retorna los objetos que no son los duplicados
            }
        } );
        articulosCarrito = [ ...cursos ];
    } else {
        //agregamos el curso al carrito
        //Agrega elementos al areglo del carrito
        articulosCarrito = [ ...articulosCarrito, infoCurso ];
    }
    
    carritoHTML();
}

//Muestra el Carrito de compras en el HTML
function carritoHTML(){
    // Limpiar el html 
    limpiarHTML();

    //Recore el carrido y genera el HTML
    articulosCarrito.forEach( curso => { 
        const { imagen, titulo, precio, cantidad } = curso;
        const row = document.createElement( 'tr' );
        row.innerHTML = `
            <td>
                <img src="${imagen}" width="100">
            </td>
            <th> ${titulo} </th>
            <th> ${precio} </th>
            <th> ${cantidad} </th>

            <td>
                <a href="#" class="borrar-curso" data-id="${curso.id}">X</a>
            </td>
        `;

        //Agrega el html del carrito en el tbody
        contenedorCarrito.appendChild( row );
     });

     //Agregar el carrito de compras al Storage
     sincronizarStorage();
}

function sincronizarStorage(){
    localStorage.setItem( 'carrito', JSON.stringify( articulosCarrito ) );
}

// Elimina los curso del tbody
function limpiarHTML(){
    //Forma lenta de limpiar
    while( contenedorCarrito.firstChild ){
        contenedorCarrito.removeChild( contenedorCarrito.firstChild );
    }
}