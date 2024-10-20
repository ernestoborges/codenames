let wordList = [
    "abelha", "abismo", "abraço", "absoluto", "academia", "acidente", "ação", "adaga", "adivinha",
    "adrenalina", "adulto", "aeromoça", "afeto", "água", "agulha", "ajuda", "alface", "alimento",
    "almofada", "altura", "amigo", "amor", "andar", "anel", "anjo", "ano", "antena", "anúncio",
    "aparelho", "aperto", "aposta", "aprendiz", "árvore", "asa", "assassino", "atitude", "ator",
    "atração", "audição", "aula", "aurora", "autor", "avião", "avó", "azul", "bala", "banco",
    "bandeira", "barco", "barriga", "batata", "bateria", "beijo", "beleza", "bicho", "bicicleta",
    "bilhete", "biologia", "bispo", "bloco", "boato", "boca", "bola", "bolsa", "bombeiro",
    "boneca", "borboleta", "branco", "brasa", "brilho", "brincadeira", "broche", "bruxa", "bueiro",
    "bússola", "cabelo", "cabra", "cachorro", "cadeira", "caderno", "café", "caixa", "calça",
    "camelo", "caminhão", "campo", "canal", "canoa", "capa", "capitão", "caracol", "carne",
    "carro", "carta", "casamento", "casca", "cavalo", "celular", "céu", "chapéu", "chave",
    "chefe", "cheiro", "chocolate", "chuva", "círculo", "cidade", "cinema", "círculo", "cobertor",
    "cobra", "coelho", "colher", "colina", "colônia", "comida", "computador", "concha", "concreto",
    "conjunto", "coração", "corda", "corpo", "corredor", "corrente", "coruja", "corte", "costura",
    "couro", "covil", "criança", "crime", "cristal", "cruz", "cura", "dado", "dança", "dedo",
    "defesa", "dente", "desafio", "desenho", "deserto", "diamante", "dinheiro", "dinossauro",
    "disco", "distância", "doce", "dragão", "duelo", "escola", "escrita", "escudo", "esfinge",
    "esmalte", "espaço", "espelho", "espeto", "esposa", "esporte", "espuma", "estação", "estrada",
    "estrela", "estudante", "eterno", "explosão", "faca", "fada", "fantasma", "farol", "fato",
    "favo", "fênix", "ferramenta", "ferro", "festa", "ficha", "figura", "filme", "fita", "floresta",
    "fogo", "foguete", "folha", "fonte", "força", "formiga", "fortaleza", "fósforo", "frango",
    "fruta", "galo", "galáxia", "galo", "gato", "gelo", "geladeira", "gênio", "girassol", "globo",
    "golfinho", "golpe", "gorro", "gota", "grama", "gramado", "grão", "gravata", "guerra",
    "guia", "guincho", "guitarra", "hambúrguer", "harpa", "herói", "história", "horta", "hospital",
    "hotel", "ídolo", "ilha", "ímã", "impacto", "inimigo", "inseto", "instante", "instrumento",
    "internet", "irmão", "janela", "jarro", "jardim", "jogo", "joia", "juiz", "labirinto",
    "lago", "lança", "lanterna", "lápis", "lar", "lareira", "leão", "leite", "letra", "limão",
    "língua", "livro", "lobo", "lua", "luta", "macaco", "mãe", "maestro", "máquina", "mar",
    "martelo", "mascara", "médico", "melancia", "memória", "mesa", "meteoro", "milho", "minhoca",
    "montanha", "morango", "motor", "moto", "muralha", "música", "nave", "neve", "ninho",
    "noite", "número", "objeto", "oceano", "oficina", "olho", "orelha", "ouro", "ovo", "pá",
    "padrão", "palácio", "palavra", "panda", "panela", "papel", "parque", "passagem", "passarinho",
    "passo", "pastel", "patinete", "patrão", "pedra", "peixe", "pêndulo", "pente", "penteado",
    "pérola", "piano", "pico", "pilar", "piloto", "pincel", "pino", "pipoca", "pirata",
    "plano", "planeta", "planta", "plástico", "porta", "porão", "porco", "posição", "poste",
    "pote", "poção", "prego", "prêmio", "príncipe", "prisão", "professor", "programa", "pulga",
    "pulso", "quadrado", "quadro", "quarto", "quebra", "queijo", "queda", "queda", "quintal",
    "raio", "raiz", "raposa", "rascunho", "rato", "receita", "relógio", "rio", "risada", "rocha",
    "roda", "rolo", "rosa", "roupa", "sabão", "sabedoria", "saco", "sala", "salada", "saleiro",
    "salto", "sapato", "sapo", "satélite", "segredo", "selo", "sinal", "símbolo", "sino", "sistema",
    "sol", "soldado", "som", "sonho", "sopa", "sorriso", "sombra", "sorte", "submarino", "suco",
    "taco", "talher", "tampa", "tapete", "tartaruga", "telefone", "telescópio", "templo", "tempo",
    "tenda", "tigre", "tinta", "título", "toca", "tomate", "torrada", "torre", "touro", "trabalho",
    "tradição", "traje", "trem", "triângulo", "tronco", "troféu", "túnel", "unha", "urso",
    "uva", "vacina", "vagão", "valente", "valsa", "vampiro", "vapor", "vaso", "vela", "velho",
    "vento", "verdade", "vestido", "viagem", "vídeo", "vila", "vinho", "violão", "visão", "viva",
    "vôo", "vulcão", "xícara", "ziguezague"
];


export function shuffleList(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export function RandomWords(n: number) {

    if (n >= wordList.length) {
        return shuffleList([...wordList])
    }

    return shuffleList([...wordList]).slice(0, n);
}

export function randomNumberExclude(excludedNumbers: number[], min: number, max: number) {
    let randomNumber;
    do {
        randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (excludedNumbers.includes(randomNumber));

    return randomNumber;
}