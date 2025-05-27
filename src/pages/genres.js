const genres = [
  "Action", "Adventure", "Comedy", "Drama", "Fantasy", 
  "Horror", "Slice of Life", "Romance", "Sci-Fi", "Thriller", 
  "Superhero", "Historical", "Sports", "Supernatural", "Graphic Novel",
  "Informative", "Heartwarming"
];

const genreContainer = document.getElementById("genres");
const submitBtn = document.getElementById("submitBtn");
let selectedGenres = [];

// create button
genres.forEach(genre => {
  const btn = document.createElement("button");
  btn.innerText = genre;
  btn.classList.add("genre-btn");
  btn.addEventListener("click", () => toggleGenre(genre, btn));
  genreContainer.appendChild(btn);
});

function toggleGenre(genre, button) {
  const index = selectedGenres.indexOf(genre);

  if (index > -1) {
    // for deselection
    selectedGenres.splice(index, 1);
    button.classList.remove("selected");
  } else if (selectedGenres.length < 3) {
    // selection
    selectedGenres.push(genre);
    button.classList.add("selected");
  }

  // update submit button
  if (selectedGenres.length === 3) {
    submitBtn.disabled = false;
    submitBtn.classList.add("active");
  } else {
    submitBtn.disabled = true;
    submitBtn.classList.remove("active");
  }
}

// You can later attach this to fetch/post
submitBtn.addEventListener("click", () => {
  alert("You selected: " + selectedGenres.join(", "));
  // Send to backend or ML model here
  window.location.href = "../html/homepage.html";

});


