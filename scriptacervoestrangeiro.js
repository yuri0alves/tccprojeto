 // Armazenar todos os livros retornados pela última busca
 let allBooks = [];

 function recommendBooks() {
     const searchAuthor = document.getElementById("searchAuthor").value.trim() || document.getElementById("customAuthor").value.trim();
     const searchGenre = document.getElementById("searchGenre").value.trim();
     const searchLanguage = "pt"; // Consulta apenas em português
     const recommendationQuantity = document.getElementById("recommendationQuantity").value;

     if (searchAuthor === "" && document.getElementById("searchAuthor").selectedIndex === 0) {
         alert("Por favor, selecione um autor ou digite o nome do autor.");
         return;
     }

     if (searchGenre === "") {
         alert("Por favor, selecione um gênero.");
         return;
     }

     const apiKey = "AIzaSyCxOrxXLoowMEjJr6OFR5ieA7qFe-1D8xg";

     let searchTerm = '';

     if (searchAuthor !== '') {
         searchTerm = `inauthor:${searchAuthor}`;
     } else if (searchGenre !== '') {
         searchTerm = `subject:${searchGenre}`;
     } else {
         searchTerm = 'language:portuguese'; // Buscar apenas livros em português
     }

     const url = `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&langRestrict=${searchLanguage}&orderBy=relevance&maxResults=40&key=${apiKey}`;

     console.log("URL de busca:", url); // Adicionando log da URL de busca

     fetch(url)
         .then(response => response.json())
         .then(data => {
             console.log("Dados retornados:", data); // Adicionando log dos dados retornados pela API
             allBooks = data.items || [];
             document.getElementById("results").innerHTML = "";
             displayRandomResults(recommendationQuantity);
         })
         .catch(error => console.error("Erro ao buscar livros:", error));
 }

 function displayRandomResults(quantity) {
     const uniqueBooks = new Set(); // Conjunto para armazenar livros únicos

     // Iterar até encontrarmos a quantidade desejada de livros únicos
     while (uniqueBooks.size < quantity && allBooks.length > 0) {
         const randomIndex = Math.floor(Math.random() * allBooks.length);
         const book = allBooks.splice(randomIndex, 1)[0];

         const title = book.volumeInfo.title.toLowerCase();
         const authors = book.volumeInfo.authors ? book.volumeInfo.authors.join(", ") : "Autor desconhecido";
         const description = book.volumeInfo.description || "Descrição não disponível";
         const thumbnail = book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail ? book.volumeInfo.imageLinks.thumbnail : "Sem imagem disponível";
         const pageCount = book.volumeInfo.pageCount || "Número de páginas não disponível";

         // Excluindo títulos que contenham "conto" e "box" e o nome do autor
         if (!title.includes("conto") && !title.includes("box") && !title.includes("vol") && !title.includes("the ") && !title.includes("book") && !title.includes("+")  && !title.includes("clash of kings") && !title.includes("a song of ice and fire") &&  !title.includes("7 livros") &&!authors.toLowerCase().includes("Ingles")) {
             const bookHTML = `<div>
                                 <h2>${title}</h2>
                                 <p>Autor(es): ${authors}</p>
                                 <img src="${thumbnail}" alt="Capa do livro">
                                 <p>${description}</p>
                                 <p>Número de páginas: ${pageCount}</p>
                                 <button onclick="searchMoreBooksByAuthor('${authors}')">Mais desse autor</button>
                             </div>`;

             uniqueBooks.add(bookHTML);
         }
     }

     // Exibir os resultados na página
     document.getElementById("results").innerHTML = [...uniqueBooks].join('');
 }

 function searchMoreBooksByAuthor(authorName) {
     const searchTerm = `inauthor:${authorName}`;
     const searchLanguage = "pt"; // Consulta apenas em português
     const apiKey = "AIzaSyCxOrxXLoowMEjJr6OFR5ieA7qFe-1D8xg";
     const url = `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&langRestrict=${searchLanguage}&orderBy=relevance&maxResults=10&key=${apiKey}`;

     fetch(url)
         .then(response => response.json())
         .then(data => {
             const authorBooks = data.items || [];
             const authorBooksHTML = authorBooks.map(book => {
                 const title = book.volumeInfo.title;
                 const description = book.volumeInfo.description || "Descrição não disponível";
                 const thumbnail = book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail ? book.volumeInfo.imageLinks.thumbnail : "Sem imagem disponível";
                 const pageCount = book.volumeInfo.pageCount || "Número de páginas não disponível";
                 return `<div>
                             <h3>${title}</h3>
                             <img src="${thumbnail}" alt="Capa do livro">
                             <p>${description}</p>
                             <p>Número de páginas: ${pageCount}</p>
                         </div>`;
             }).join('');

             document.getElementById("results").innerHTML = authorBooksHTML;
         })
         .catch(error => console.error("Erro ao buscar mais livros do autor:", error));
 }

 function searchAuthor() {
     const customAuthor = document.getElementById("customAuthor").value.trim();
     if (customAuthor === "") {
         alert("Digite ou selecione um autor.");
     } else {
         document.getElementById("searchAuthor").value = customAuthor;
         recommendBooks();
     }
 }