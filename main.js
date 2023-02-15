const API_KEY = "api_key=914a2c08ae7cd071c54f919321806503";
const lang = "es-ES";
const BASE_URL = "https://api.themoviedb.org/3";
const API_URL = BASE_URL + "/discover/movie?sort_by=popularity.desc&" + API_KEY;
const IMG_URL = "https://image.tmdb.org/t/p/w500";
const searchURL = BASE_URL + "/search/movie?" + API_KEY;

const main = document.getElementById("main");
const form = document.getElementById("form");
const filter = document.getElementById("filter");
const tagsEl = document.getElementById("tags");
const suggestions = document.getElementById("suggestions");
const favorite = document.querySelectorAll("favorite");

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

// Pagina principal
function todosMovies() {
  getMovies(API_URL);
}
// Pagina favoritas
function favMovies() {
  getMovies(API_URL, true);
}

// Obtener todos los movies
function getMovies(url, fav) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log(data.results);
      showMovies(data.results, fav);
    });
}

function getSearch(url) {
  var resultado;
  // lastUrl = url;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log(data.results);
      if (data.results.length !== 0) {
        showMovies(data.results);
      } else {
        main.innerHTML = `<h1 class="no-results">No Results Found</h1>`;
      }
    });
  return resultado;
}

function showMovies(data, fav) {
  main.innerHTML = "";

  data.forEach((movie) => {
    if (fav) {
      // alert(movie.id);
      if (estaFavorite(movie.id)) {
        // alert("hello");
        addElements(movie);
      }
    } else {
      addElements(movie);
    }
  });
}

function addElements(movie) {
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
}

// mostrar search
filter.addEventListener("keyup", (e) => {
  const aBuscar = filter.value;

  if (aBuscar.length >= 3) {
    getMovies(searchURL + "&query=" + aBuscar);
  } else {
    getMovies(API_URL);
  }
});

function getColor(vote) {
  if (vote >= 8) {
    return "green";
  } else if (vote >= 5) {
    return "orange";
  } else {
    return "red";
  }
}

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

const getFavorites = () => {
  let favs = [];
  if (localStorage["favorites"] != undefined) {
    favs = localStorage["favorites"].split(",");
  }
  return favs;
};

// Comprobar si el id del movie esta en la storage
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

const addToFavorites = (id) => {
  let favs = getFavorites();
  if (favs.indexOf(id) < 0) {
    if (!estaFavorite(id)) {
      favs.push(id);
      document.getElementById(id).className = "favorite my-favorite";
      localStorage["favorites"] = favs.toString();
    } else {
      deleteFromFavorites(id);
    }
  }
};

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
