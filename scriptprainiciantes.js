const restrictedWords = ["box", "coleção"];
let displayedBooks = [];
const apiKey = "AIzaSyCxOrxXLoowMEjJr6OFR5ieA7qFe-1D8xg"; // Substitua "SUA_CHAVE_API" pela sua chave de API
const apiUrl = "https://www.googleapis.com/books/v1/volumes?key=" + apiKey + "&langRestrict=pt&q=";

const booksByGenre = {
    fantasy: [
        "O Hobbit J.R.R. Tolkien",
        "As Crônicas de Nárnia: O Leão, a Feiticeira e o Guarda-Roupa C.S. Lewis",
        "A Guerra dos Tronos George R.R. Martin",
        "Mistborn: O Império Final Brandon Sanderson",
        "Percy Jackson e o Ladrão de Raios Rick Riordan",
        "Senhor dos Anéis: A Sociedade do Anel J.R.R. Tolkien",
        "O Aprendiz Taran Matharu",
        "Cidade dos Ossos Cassandra Clare",
        "Harry Potter e a Pedra Filosofal J.K. Rowling",
        "A Rainha Vermelha Victoria Aveyard"
    ],
    mystery: [
        "Garota Exemplar Gillian Flynn",
        "O Silêncio dos Inocentes Thomas Harris",
        "Sob Águas Escuras Robert Bryndza",
        "Morte no Nilo Agatha Christie",
        "Assassinato no Expresso Oriente Agatha Christie",
        "A Última Festa Lucy Foley",
        "O Colecionador de Ossos Jeffery Deaver", 
        "A paciente silenciosa Alex Michaelides",
        "O Homem de Giz C. J. Tudor",
        "A Mulher na Janela A. J. Finn"
    ],
    romance: [
        "Orgulho e Preconceito Jane Austen",
        "Como eu era antes de você Jojo Moyes",
        "A Culpa é das Estrelas John Green",
        "Cinquenta Tons de Cinza Vol. 1 E.L. James",
        "O Diário de Uma Paixão Nicholas Sparks",
        "Um Dia David Nicholls",
        "O Morro dos Ventos Uivantes Emily Brontë",
        "Anna e o Beijo Francês Stephanie Perkins",
        "Eleanor & Park Rainbow Rowell",
        "Até você ser minha Samantha Hayes"
    ],
    horror: [
        "It a Coisa Stephen King",
        "Psicose Robert Bloch",
        "O Exorcista William Peter Blatty",
        "O Jogo Perigoso Stephen King",
        "O Demonologista Andrew Pyper",
        "A noiva fantasma Yangsze Choo",
        "O Vilarejo Raphael Montes",
        "O cemitério Stephen King",
        "Evangelho de sangue Clive Barker",
        "O Paciente Jasper DeWitt"
    ],
    children: [
        "Pollyanna Moça Eleanor H. Porter",
        "O Pequeno Príncipe - Antoine de Saint-Exupéry",
        "Matilda (Edição Especial) - Roald Dahl",
        "Meu Pé de Laranja Lima José Mauro de Vasconcelos",
        "Malala, a menina que queria ir para a escola Adriana Carranca",
        "Mighty Morphin Power Rangers Vol. 1 - Kyle Higgins",
        "Diário de um Banana 1 - Jeff Kinney",
        "A Árvore Generosa Shel Silverstein",
        "O Jardim Secreto Frances Hodgson Burnett",
        "Quem Soltou o Pum? Blandina Franco"
    ],
    action: [
        "O Código Da Vinci Dan Brown",
        "Uma dobra no tempo Madeleine L'Engle",
        "Jurassic Park Michael Crichton",
        "As Armas da Persuasão Robert B. Cialdini",
        "Os Três Mosqueteiros Alexandre Dumas, pai",
        "A Sangue Frio Truman Capote",
        "A Redoma de Vidro Sylvia Plath",
        "O Último Olimpiano Rick Riordan",
        "Maze Runner: Correr ou Morrer James Dashner",
        "Jogos Vorazes Suzanne Collins"
    ],
    drama: [
        "Auto da Compadecida Ariano Suassuna",
        "A Menina Que Roubava Livros Markus Zusak",
        "O Menino de Pijama Listrado John Boyne",
        "É Assim Que Acaba Colleen Hoover",
        "O Leitor Bernhard Schlink",
        "O Sol é para Todos Harper Lee",
        "O Leitor Bernhard Schlink",
        "A Montanha Mágica Thomas Mann",
        "O Diário de Anne Frank",
        "A Devolvida Donatella Di Pietrantonio"
    ]
};

document.getElementById("searchForm").addEventListener("submit", function(event) {
    event.preventDefault();
    var genre = document.getElementById("genreSelect").value;
    if (genre === "") {
        alert("Por favor, selecione um gênero antes de buscar.");
    } else {
        var selectedGenreBooks = booksByGenre[genre].filter(book => !restrictedWords.some(word => book.toLowerCase().includes(word)));
        displayBookOptions(selectedGenreBooks);
    }
});

function displayBookOptions(books) {
    var resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    var bookSelect = document.createElement("select");
    bookSelect.setAttribute("id", "bookSelect");
    bookSelect.innerHTML = "<option value='' disabled selected>Selecione um livro</option>";

    books.forEach(book => {
        if (!displayedBooks.includes(book)) {
            var option = document.createElement("option");
            option.value = book;
            option.textContent = book;
            bookSelect.appendChild(option);
        }
    });

    bookSelect.addEventListener("change", function() {
        var selectedBookISBN = this.value;
        fetchBookDetails(selectedBookISBN);
    });

    resultsDiv.appendChild(bookSelect);
}

function fetchBookDetails(bookISBN) {
    if (!bookISBN) {
        console.log("ISBN inválido.");
        return;
    }

    fetch(apiUrl + encodeURIComponent(bookISBN))
        .then(response => response.json())
        .then(data => {
            // Verifica se há itens retornados
            if (data.items && data.items.length > 0) {
                const book = data.items[0].volumeInfo;
                const title = book.title;
                const authors = book.authors ? book.authors.join(', ') : 'Autor desconhecido';
                const description = book.description ? book.description : 'Descrição indisponível';
                const coverUrl = book.imageLinks && book.imageLinks.thumbnail ? book.imageLinks.thumbnail : 'Capa indisponível';
                const pageCount = book.pageCount ? book.pageCount : 'Número de páginas indisponível';

                // Exibe os detalhes na página HTML
                var detailsDiv = document.createElement("div");
                detailsDiv.innerHTML = `
                    <h2>${title}</h2>
                    <p>Autor(es): ${authors}</p>
                    <img src="${coverUrl}" alt="Capa do livro">
                    <p>Descrição: ${description}</p>
                    <p>Número de páginas: ${pageCount}</p>
                    <button class="moreBooksButton">Mais desse autor</button>
                `;
                document.getElementById("results").appendChild(detailsDiv);

                // Adiciona o evento de clique para o botão "Mais desse autor"
                detailsDiv.querySelector(".moreBooksButton").addEventListener("click", function() {
                    var authorName = authors.split(",")[0].trim();
                    searchMoreBooksByAuthor(authorName);
                });
            } else {
                console.log("Livro não encontrado.");
            }
        })
        .catch(error => console.error("Erro ao buscar detalhes do livro:", error));
}

function searchMoreBooksByAuthor(authorName) {
    if (!authorName) {
        console.log("Nome do autor inválido.");
        return;
    }

    fetch(apiUrl + "inauthor:" + encodeURIComponent(authorName))
        .then(response => response.json())
        .then(data => {
            // Verifica se há itens retornados
            if (data.items && data.items.length > 0) {
                const authorBooks = data.items.filter(item => !displayedBooks.includes(item.volumeInfo.title)).slice(0, 3).map(item => {
                    const bookInfo = item.volumeInfo;
                    const title = bookInfo.title ? bookInfo.title : 'Título desconhecido';
                    const description = bookInfo.description ? bookInfo.description : 'Descrição indisponível';
                    const pageCount = bookInfo.pageCount ? bookInfo.pageCount : 'Número de páginas indisponível';
                    const coverUrl = bookInfo.imageLinks && bookInfo.imageLinks.thumbnail ? bookInfo.imageLinks.thumbnail : 'Capa indisponível';
                    return { title, description, pageCount, coverUrl };
                });

                // Exibe os detalhes dos livros do autor na página HTML
                var moreBooksDiv = document.createElement("div");
                moreBooksDiv.innerHTML = "<h3>Outros livros do autor:</h3>";
                authorBooks.forEach(book => {
                    var bookDetails = document.createElement("div");
                    bookDetails.innerHTML = `
                        <h4>${book.title}</h4>
                        <img src="${book.coverUrl}" alt="Capa do livro">
                        <p>Descrição: ${book.description}</p>
                        <p>Número de páginas: ${book.pageCount}</p>
                    `;
                    moreBooksDiv.appendChild(bookDetails);
                    displayedBooks.push(book.title);
                });

                document.getElementById("results").appendChild(moreBooksDiv);
            } else {
                console.log("Nenhum livro encontrado para este autor.");
            }
        })
        .catch(error => console.error("Erro ao buscar mais livros do autor:", error));
}