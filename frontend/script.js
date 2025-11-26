// GameScout - Frontend JavaScript
// Funciones para buscar y mostrar precios de videojuegos

/**
 * Función principal para buscar juegos
 * Se ejecuta cuando el usuario hace click en "Buscar Precios"
 */
async function searchGame() {
  const searchInput = document.getElementById("searchInput");
  const gameName = searchInput.value.trim();

  // Validar que el usuario ingresó un término de búsqueda
  if (!gameName) {
    alert("Por favor, ingresa el nombre de un juego");
    return;
  }

  // Mostrar loading
  showLoading(true);

  try {
    // Hacer petición al backend
    const response = await fetch(
      `http://localhost:3000/api/search?game=${encodeURIComponent(gameName)}`
    );

    if (!response.ok) {
      throw new Error("Error en la búsqueda");
    }

    const games = await response.json();

    // Mostrar resultados
    displayResults(games);
  } catch (error) {
    console.error("Error:", error);
    showError(
      "Error al buscar los precios. Verifica que el backend esté funcionando."
    );
  } finally {
    // Ocultar loading
    showLoading(false);
  }
}

/**
 * Muestra u oculta la animación de loading
 * @param {boolean} show - true para mostrar, false para ocultar
 */
function showLoading(show) {
  const loadingElement = document.getElementById("loading");
  if (show) {
    loadingElement.classList.remove("hidden");
  } else {
    loadingElement.classList.add("hidden");
  }
}

/**
 * Muestra los resultados de la búsqueda en la página
 * @param {Array} games - Lista de juegos encontrados
 */
function displayResults(games) {
  const resultsElement = document.getElementById("results");

  // Limpiar resultados anteriores
  resultsElement.innerHTML = "";

  // Verificar si se encontraron juegos
  if (!games || games.length === 0) {
    resultsElement.innerHTML = `
            <div class="game-card">
                <p>No se encontraron juegos. Intenta con otro nombre.</p>
            </div>
        `;
    return;
  }

  // Crear HTML para cada juego encontrado
  games.forEach((game) => {
    const gameElement = createGameElement(game);
    resultsElement.appendChild(gameElement);
  });
}

/**
 * Crea el elemento HTML para mostrar un juego y sus precios
 * @param {Object} game - Objeto con la información del juego
 * @returns {HTMLElement} - Elemento HTML del juego
 */
function createGameElement(game) {
    const gameDiv = document.createElement('div');
    gameDiv.className = 'game-card';

    // Formatear el precio más bajo - manejar undefined
    const cheapestPrice = game.cheapest ? `$${parseFloat(game.cheapest).toFixed(2)}` : "No disponible";
    const gameName = game.external || "Nombre no disponible";

    gameDiv.innerHTML = `
        <div class="game-header">
            <h2 class="game-title">${gameName}</h2>
        </div>
        <div class="price-list">
            <div class="price-item ${game.cheapest ? 'highlight' : ''}">
                <span class="store-name">Precio más bajo:</span>
                <span class="price ${game.cheapest ? 'best-price' : ''}">${cheapestPrice}</span>
            </div>
        </div>
        ${game.cheapest ? '<button class="buy-button" onclick="alert(\'Redirigiendo a la tienda...\')">🛒 Ver Oferta</button>' : ''}
    `;

    return gameDiv;
}

/**
 * Muestra un mensaje de error al usuario
 * @param {string} message - Mensaje de error a mostrar
 */
function showError(message) {
  const resultsElement = document.getElementById("results");
  resultsElement.innerHTML = `
        <div class="game-card">
            <p style="color: red;">${message}</p>
        </div>
    `;
}

// Permitir búsqueda con Enter
document
  .getElementById("searchInput")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      searchGame();
    }
  });

// Mensaje de consola para verificar que el script se cargó
console.log("🎮 GameScout Frontend cargado correctamente");

// Efectos de escritura automática en el placeholder
function animatePlaceholder() {
  const placeholders = [
    "Call of Duty: Modern Warfare...",
    "The Witcher 3: Wild Hunt...",
    "Grand Theft Auto V...",
    "Minecraft...",
    "Cyberpunk 2077...",
    "Elden Ring...",
  ];

  let currentIndex = 0;
  let charIndex = 0;
  const speed = 100;
  const eraseSpeed = 50;

  function type() {
    if (charIndex < placeholders[currentIndex].length) {
      document.getElementById("searchInput").placeholder = placeholders[
        currentIndex
      ].substring(0, charIndex + 1);
      charIndex++;
      setTimeout(type, speed);
    } else {
      setTimeout(erase, 1000);
    }
  }

  function erase() {
    if (charIndex > 0) {
      document.getElementById("searchInput").placeholder = placeholders[
        currentIndex
      ].substring(0, charIndex - 1);
      charIndex--;
      setTimeout(erase, eraseSpeed);
    } else {
      currentIndex = (currentIndex + 1) % placeholders.length;
      setTimeout(type, 500);
    }
  }

  type();
}

// Iniciar animación cuando la página cargue
document.addEventListener("DOMContentLoaded", function () {
  animatePlaceholder();

  // Efecto de aparición suave
  document.querySelector(".container").style.opacity = "0";
  document.querySelector(".container").style.transition = "opacity 0.8s ease";

  setTimeout(() => {
    document.querySelector(".container").style.opacity = "1";
  }, 300);

  console.log("🎮 GameScout Frontend MEJORADO cargado");
  console.log("✨ Ahora con diseño moderno y efectos mejorados");
});
