document.addEventListener("DOMContentLoaded", () =>{


    //Variable para guardar los datos que necesito del fetch y acceder a ellos por fuera. Inicialmente está vacía.
    let peliculasFetch = [];


    //Función que contiene el fetch para obtener los datos sin mostrarlos
function obtenerJson(){
    fetch("https://japceibal.github.io/japflix_api/movies-data.json")
    .then (response =>{
        if (!response.ok){
            throw new Error("Problema con respuesta del fetch")
        }
        return response.json();
    })

    .then(data =>{

        //Mostrar la data en consola
        console.log(data);

        //Recorrer el data y traer datos de cada película
        data.forEach(pelicula =>{
            
            //Variable que crea objeto/array con los datos que necesito. Cada uno tiene una key y una value a la cual acceder luego.
            let datosPeliculas = {
                title : pelicula.title,
                genres: pelicula.genres,
                tagline: pelicula.tagline,
                overview: pelicula.overview,
                vote_average: pelicula.vote_average,
                soloAnio: (pelicula.release_date).slice(0, 4),
                runtime: pelicula.runtime,
                budget: pelicula.budget,
                revenue: pelicula.revenue
            };

            //push para agregar datos de las películas accesibles por fuera del fetch
            peliculasFetch.push(datosPeliculas);
        })
    })

    .catch(error =>{
        console.error("Error:", error);
    })

}

//Reproducir función del fetch
obtenerJson();

//Constante para guardar el botón buscar
const botonBuscar = document.getElementById("btnBuscar");

//Variable que aloja el contenedor del listado
let divLista = document.getElementById("lista");



//Alojar el input donde el usuario escribe en una variable
let inputBuscar = document.getElementById("inputBuscar")

//Función para mostrar puntuaciones. Toma el argumento voteAverage que más adelante será el vote.average para cada película
function mostrarEstrellas(voteAverage){

    //Creamos variable que alojará la puntuación de estrellas que devuelva el for. Empieza vacía.
    let estrellasHtml = "";

    // Creamos variable que hace redondeo matemático sobre el voteAverage de cada película.
    //Lo divide en 2 porque los puntajes del vote.average están del 1 al 10
    let estrellasLlenas = Math.round(voteAverage / 2); 

    //Arranca poniendo el índice en 1, mientras i se mantenga menor o igual a 5 va sumando al índice para recorrer toda la lista de estrellas
        for(let i=1; i<=5; i++){
            //Si el índice es menor o igual al total de estrellasLlenas (la puntuación del vote.average) agrega una estrella llena a estrellasHtml
            if(i <= estrellasLlenas){
                estrellasHtml += `<span class="fa fa-star checked"></span>`;
            }
            //Sino agrega una estrella vacía
            else{
                estrellasHtml += `<span class="fa fa-star"></span>`
            }
        }

    //Al finalizar el bucle for me devuelve el código de las estrellas según la puntuación
    return estrellasHtml;
}

    // Variables que alojan elementos del html para usar en el Offcanvas
    let offcanvasTitulo = document.getElementById("offcanvasTitulo");
    let offcanvasOverview = document.getElementById("offcanvasOverview");
    let offcanvasGenres = document.getElementById("offcanvasGenres");

    //Tomo el div (offcanvasPelicula) que contiene todo el bloque de html donde va el OffCanvas.
    //con new bootstrap.Offcanvas estoy creando el elemento Offcanvas que contendrá toda la info de la película
    let offcanvasPelicula = new bootstrap.Offcanvas(document.getElementById("offcanvasPelicula"));

    //Función para lo que quiero mostrar en el OffCanvas que toma como argumento una película
    function mostrarOffcanvasPelicula(pelicula) {
        //Variable que contiene el título de la película
        offcanvasTitulo.textContent = pelicula.title;
        //Variable que contiene el título de la película
        offcanvasOverview.textContent = pelicula.overview;

        // Tomar la lista de géneros y limpiarla
        offcanvasGenres.innerHTML = "";
        //For para recorrer cada género de la película e ir agregando un elemento li por cada uno
        pelicula.genres.forEach(genere => {
            let li = document.createElement('li');
            //Accedo al name del genre y se lo asigno al nuevo li
            li.textContent = genere.name;
            //Sumo el li al contenedor de genres en el offCanvas
            offcanvasGenres.appendChild(li);
        });

        //Botón More
        //Variable que contiene el div dentro del more
        let moreContenido = document.getElementById("contenidoMore")

        //innerHtml para añadirle al contenedor los datos
        moreContenido.innerHTML += `<p style="margin-bottom: 0.5em; padding: 0em 1em">Year: ${pelicula.soloAnio}</p>
        <p style="margin-bottom: 0.5em; padding: 0em 1em">Runtime: ${pelicula.runtime} mins</p>
        <p style="margin-bottom: 0.5em; padding: 0em 1em">Budget: ${pelicula.budget}</p>
        <p style="margin-bottom: 0.5em; padding: 0em 1em">Revenue: ${pelicula.revenue}</p>`

        // Mostrar el Offcanvas
        offcanvasPelicula.show();
    }


//Función que luego utilizaremos para que devuelva todas las películas solo si hace clic en buscar y el input está vacío
//(para usarla tendré que llamar al evento click en el DOM)
function soloBuscar(){

    // Limpiamos el contenido anterior para que arranque vacío cada vez que hacemos una búsqueda
    divLista.innerHTML = "";


    //Foreach que recorre las películas y las agrega al html con sus datos correspondientes
    peliculasFetch.forEach(pelicula => {
        //Creo una variable para crear un ítem del tipo li (ítem de lista) al cual luego hacerle click por cada película
        let peliculaItem = document.createElement("li")

        //A este li le añado el html con los datos correspondientes
        peliculaItem.innerHTML += `<p>${pelicula.title}</p>
        <p>${pelicula.tagline}</p>
        <p>${mostrarEstrellas(pelicula.vote_average)}</p>`;

        //Le añado estilos a este nuevo li
        peliculaItem.classList.add('list-group-item', 'bg-dark', 'text-white');

        //Creo un evento en el DOM del tipo click para permitir hacer clic en la película y abrir el offCanvas
        peliculaItem.addEventListener('click', () => {
            //Reproduzco la función para mostrar los detalles de la película que se piden en el OffCanvas
            mostrarOffcanvasPelicula(pelicula);
        });

        //Agrego a mi html inicial el item cliquable para abrir el offCanvas de la película
        divLista.appendChild(peliculaItem);
    })   

}


//Cuando solo hace clic en buscar
botonBuscar.addEventListener("click", () =>{
    //Variable global para este bloque que aloja el valor que puso el usuario en el input
    //A lo que ponga el usuario lo convierto todo a lowercase y lo recorto
    let valorUsuario = inputBuscar.value.toLowerCase().trim()

    //Si el usuario presiona solo buscar, llama a la función para mostrar todo
    if (valorUsuario === ""){
        soloBuscar();
    }
    else {
        //Creo una variable que aloje las películas filtradas.
        //Llamo a mi lista de películas y las filtro una por una (para que me devuelva el array con las películas correspondientes al filter)
        let peliculasFiltradas = peliculasFetch.filter(pelicula =>{
            //Creo variable que aloje los géneros en un string en lowercase para poder filtrarlos
            //Además le añado map para que mapee todos los géneros y tome específicamente el nombre
            let generosString = pelicula.genres.map(g => g.name).join(', ').toLowerCase();

            //Si la película contiene en parte el valor que puso el usuario en su title, genres, tagline u overview que lo agregue al array.
            return pelicula.title.toLowerCase().includes(valorUsuario) || generosString.includes(valorUsuario)
            || pelicula.tagline.toLowerCase().includes(valorUsuario) || pelicula.overview.toLowerCase().includes(valorUsuario)});
            
        //Volvemos a limpiar el html por si el usuario ya había buscado
        divLista.innerHTML = "";

        //Recorremos las peliculasFiltradas y para cada una mostramos en el html sus datos
        peliculasFiltradas.forEach(pelicula => {
            //Agrego lo del li para poder hacerles click en cada caso también a las películas filtradas
            let peliculaItem = document.createElement("li");
                peliculaItem.innerHTML = `<p>${pelicula.title}</p>
                <p>${pelicula.tagline}</p>
                <p>${mostrarEstrellas(pelicula.vote_average)}</p>`;
                
                peliculaItem.classList.add('list-group-item', 'bg-dark', 'text-white');

                // Evento para abrir el Offcanvas con los detalles de la película
                peliculaItem.addEventListener('click', () => {
                    mostrarOffcanvasPelicula(pelicula);
                });

                divLista.appendChild(peliculaItem);
            });   
    }
})

});





