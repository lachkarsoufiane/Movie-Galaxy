// Definir los enlaces necesarios
const API_KEY = "#";
// const lang = "es-ES";
const BASE_URL = "https://api.themoviedb.org/3";
const API_URL =
  BASE_URL + "/discover/movie?sort_by=popularity.desc&page=1&" + API_KEY;
const IMG_URL = "https://image.tmdb.org/t/p/w500";
const searchURL = BASE_URL + "/search/movie?" + API_KEY;
const buscarURL = BASE_URL + "/movie/";

// Definir los elementos necesarios
const main = document.getElementById("main");
const filter = document.getElementById("filter");
const tagsEl = document.getElementById("tags");
const contenidor = document.getElementById("contenidorSug");
const favorite = document.querySelectorAll("favorite");
const buscar = document.getElementById("buscar");

var pageFavorite = false;

// Diccionario de generos
const genres = [
  {
    id: 28,
    name: "Action",
  },
  {
    id: 12,
    name: "Adventure",
  },
  {
    id: 16,
    name: "Animation",
  },
  {
    id: 35,
    name: "Comedy",
  },
  {
    id: 80,
    name: "Crime",
  },
  {
    id: 99,
    name: "Documentary",
  },
  {
    id: 18,
    name: "Drama",
  },
  {
    id: 10751,
    name: "Family",
  },
  {
    id: 14,
    name: "Fantasy",
  },
  {
    id: 36,
    name: "History",
  },
  {
    id: 27,
    name: "Horror",
  },
  {
    id: 10402,
    name: "Music",
  },
  {
    id: 9648,
    name: "Mystery",
  },
  {
    id: 10749,
    name: "Romance",
  },
  {
    id: 878,
    name: "Science Fiction",
  },
  {
    id: 10770,
    name: "TV Movie",
  },
  {
    id: 53,
    name: "Thriller",
  },
  {
    id: 10752,
    name: "War",
  },
  {
    id: 37,
    name: "Western",
  },
];

//
function getAllMovies() {
  getMovies(API_URL);
}

// Obtener todos los movies
function getMovies(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log(data.results);
      if (!data.results.length == 0) {
        showMovies(data.results);
      } else {
        main.innerHTML = "<p class='no-resultados'>no hay resultados</p>";
      }
    });
}

/**
 * 
 * 
 * @param {String} url El url-api de buscar con el id de la pelicula 
 * @param {Boolean} more Este parametro sirve para que el metodo showMovie() sabe cuando queremos sobre escrebir la pelicula (en pagina buscar) o listar mas de un pelicula (en pagina favoritas)
 */
function getMovie(url, more) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      showMovie(data, more);
    });
}


/**
 * Obtener las peliculas favoritas
 */
function getFavMovies() {
  // obtener los ids de las peliculas favortas desde localstorage, usando el metodo (getFavorites()) 
  var moviesID = getFavorites();
  // Informamos que estamos en la pagina favoritas
  pageFavorite = true;pageFavorite
  // Si hay movies almacenados en el localstorage los pasaremos al metodo getMovie(url/movie/id...)
  if (moviesID.length !== 0) {
    moviesID.forEach((id) => {
      getMovie(buscarURL + id + "?" + API_KEY, true);
    });
    // si no hay peliculas en el localstorage, mostramos un mensaje
  } else {
    main.innerHTML =
      "<div class='no-favorites'><h1>Nada que ver aqui</h1><a href='index.html'> vuelva a la pagina principal</a><a href='buscar.html'>Pagina de búsqueda</a></div>";
  }
}



/**
 * Metodo (showMovie) en singular, recive solo los datos de una pelicula y lo muestra en la div main
 * 
 * @param {Array} data los datos de la pelicula
 * @param {Boolean} more si queremos mostrar mas de una pelicula por la pagina
 */
function showMovie(data, more) {
  // si solo queremos mostrar una pelicula, borramos el contenido del main
  if (!more) {
    clearMain();
  }
  // definimos los datos de la pelicula
  const {
    title,
    poster_path,
    vote_average,
    overview,
    original_language,
    release_date,
    id,
  } = data;
  // creamos el contenidor dela pelicula
  const movieEl = document.createElement("div");
  // lo añadimos la classe movie (para añadir estilo)
  movieEl.classList.add("movie");
  // lo rellinamos con los datos
  movieEl.innerHTML = `
  <img src="${
    poster_path ? IMG_URL + poster_path : "http://via.placeholder.com/1080x1580"
  }" alt="${title}">
   <div class="info">
       <h2 class="title">${title}</h2>
       <p class="fecha">${release_date}</p>
       <p class="overview">
           ${overview}
       </p>
       <p class="lenguaje">${original_language}</p>
       <p class="puntuacion" style="background-color: ${getColor(
         vote_average
       )}">${vote_average}</p>
       <button id="${id}" class="favorite ${
    estaFavorite(id) ? "my-favorite" : ""
  }" onclick="addToFavorites(${id})"><i class="fa fa-heart"></i></button>
   </div>
`;
// Para cambiar el color del corazon cuando lo pulsamos, he usado una metodo (estaFavorite(id)) que comprueba si la pelicula esta en localstorage, 
// en el caso de si, ponemos la class (my-favorite)
// Y tambien he añadido un evento (onclick) que pasa el id del movie al metodo (addToFavorites(id)) que lo añade o lo elimina del localstorage.

// eliminamos el listado de busqueda
  if (!more) {
    contenidor.innerHTML = "";
  }
  // y añadimos el contenidor dela pelicula que hemos creado a la div main
  main.appendChild(movieEl);
}

/**
 * Metodo (showMovieS()). similar que la anterior pero mustra todas las peliculas
 * 
 * 
 * @param {*} data 
 * 
 */
function showMovies(data) {
  clearMain();
  data.forEach((movie) => {
    const {
      title,
      poster_path,
      vote_average,
      overview,
      genre_ids,
      original_language,
      release_date,
      id,
    } = movie;
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    movieEl.innerHTML = `
  
               <img src="${
                 poster_path
                   ? IMG_URL + poster_path
                   : "http://via.placeholder.com/1080x1580"
               }" alt="${title}">
                <div class="info">
                    <h2 class="title">${title}</h2>
                    <p class="fecha">${release_date}</p>
                    <p class="overview">
                        ${overview}
                    </p>
                    <p class="genero">${getGenero(genre_ids)}</p>
                    <p class="lenguaje">${original_language}</p>
                    <p class="puntuacion" style="background-color: ${getColor(
                      vote_average
                    )}">${vote_average}</p>
                    <button id="${id}" class="favorite ${
      estaFavorite(id) ? "my-favorite" : ""
    }" onclick="addToFavorites(${id})"><i class="fa fa-heart"></i></button>
                </div>
          
          `;
    main.appendChild(movieEl);
  });
}


// Mostrar listado de buscar en la pagina (Buscar)  
function getSearch(url) {
  // Boramos los listados 
  contenidor.innerHTML = "";
  // Obtenermos los resultados
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log(data.results);
      var datos = data.results;
      // Si hay datos o Peliculas que tiene el titulo contiene la palabra introducida por la input de buscar
      if (datos.length !== 0) {
        // Recorremos los datos de peliculas
        datos.forEach((movie) => {
          // cogemos los datos que necisitamos
          const { id, title, release_date } = movie;
          // creamos una nueva div para cada resultado
          const suggestions = document.createElement("div");
          suggestions.classList.add("sug");
          // convertimos el (release_date) para que parece solo el año de publicacion
          var date = release_date.split("-");
          suggestions.innerHTML = `
          <div class="list" onclick="getMovie(
            buscarURL + ${id} + '?' + API_KEY
          )" >${title}<span> (${date[0]})</span></div>
          `;
          contenidor.appendChild(suggestions);
        });

      // si no hay resultados, mostramos este mensaje 
      } else {
        contenidor.innerHTML = `<p class="no-resultados black" >no hay resultados</p>`;
      }
    });
}


// Añadir el listener al campu de filter
if (!!filter) {
  filter.addEventListener("keyup", (e) => {
    var aBuscar = filter.value;
    // Si el usuario ha introducido 3 o mas caracteres, usamos el motodo getMovies() para mostrar los resultados
    if (aBuscar.length >= 3) {
      getMovies(searchURL + "&query=" + aBuscar);
    // si no mostramos los peliculas de la pagina principal
    } else {
      getMovies(API_URL);
    }
  });
}

// Añadir el listener al campu de buscar en la pagina (Buscar)
if (!!buscar) {
  buscar.addEventListener("keyup", (e) => {
    var aBuscar = buscar.value;
    if (aBuscar.length >= 3) {
      getSearch(searchURL + "&query=" + aBuscar);
    } else {
      contenidor.innerHTML = "";
    }
  });
}

// Funcion que obtene la puntuacion del pelicula y devuelva un color
function getColor(vote) {
  if (vote >= 8) {
    return "green";
  } else if (vote >= 5) {
    return "orange";
  } else {
    return "red";
  }
}

/**
 * Metodo que recibe el id del genero, y utiliza el diccionario de generos para devolver cadena
 * 
 * @param {Intiger} generos el id del genero
 * @returns el genero como cadena
 */
function getGenero(generos) {
  var resultadoGenero = "";
  generos.forEach((genero) => {
    genres.forEach((g) => {
      if (genero == g.id) {
        if (resultadoGenero != "") {
          resultadoGenero += " | " + g.name;
        } else {
          resultadoGenero = g.name;
        }
      }
    });
  });
  return resultadoGenero;
}


// Favoritos
/**
 * devolver los ids de 
 * 
 * @returns un array con los ids de las peliculas favoritas almacenados en localstorage
 */
const getFavorites = () => {
  let favs = [];
  if (localStorage["favorites"] != undefined) {
    favs = localStorage["favorites"].split(",");
  }
  return favs;
};

// Comprobar si el id dela pelicula esta en la storage
/**
 * 
 * @param {Integer} id el id de la pelicula que queremos comprobar  
 * @returns true si existe, false si no
 */
const estaFavorite = (id) => {
  let favs = getFavorites();
  let esta = false;
  // Buscar por el id
  if (favs.length > 0) {
    favs.forEach((fav) => {
      if (fav == id) {
        esta = true;
      }
    });
  }

  return esta;
};

/**
 * Metodo que añade la pelicula al localstorage (favoritas) si no existe, o la elimina si existe
 * 
 * @param {Integer} id id de la pelicula
 */
const addToFavorites = (id) => {
  // Obtener los ids almacinados en localStorage
  let favs = getFavorites();
  if (favs.indexOf(id) < 0) {
    // Si la pelicula no existe en el localStorage, la añadimos
    if (!estaFavorite(id)) {
      favs.push(id);
      document.getElementById(id).className = "favorite my-favorite";
      localStorage["favorites"] = favs.toString();
      // Si ya existe la borramos usand el metodo (deleteFromFavorites(id))
    } else {
        deleteFromFavorites(id);
        // si estamos en la pagina de favoritos, cuando quitamos el corazon, recargamos la pagina para que la pelicula se elimina.
      if (pageFavorite) {
        location.reload();
      }
    }
  }
};

/**
 * Borrar la pelicula de favoritas
 * 
 * @param {Integer} id id del movie 
 */
const deleteFromFavorites = (id) => {
  let favs = getFavorites();
  favs = favs.filter(function (value, index, arr) {
    return value != id;
  });
  favs.length === 0
    ? delete localStorage["favorites"]
    : (localStorage["favorites"] = favs.toString());
  document.getElementById(id).className = "favorite";
};


/**
 * Metodo para limpiar el main
 */
const clearMain = () => {
  main.innerHTML = "";
};



