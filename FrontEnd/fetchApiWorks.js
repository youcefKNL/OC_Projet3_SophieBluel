// export { fetchApiWorks };

const api = "http://localhost:5678/api/";
// Differentes routes:      /works    /categories    /users/login    /works/{id}

// Fetcher api

//Fetch la route Works
async function fetchApiWorks() {
  try {
    await fetch(api + "works")
      .then((res) => res.json())
      .then((data) => console.log(data));
  } catch (error) {
    console.log(`Erreur chargement Fonction fetchApiWorks:  ${error}`);
  }
}

// fetchApiWorks();
