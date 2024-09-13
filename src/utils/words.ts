let wordList = [
    "amor", "abacaxi", "bola", "cachorro", "carro", "desafio", "escola",
    "flor", "gato", "hotel", "idioma", "jacaré", "livro", "mesa", "navio",
    "oceano", "pássaro", "quadro", "relógio", "sol", "telefone", "universidade",
    "vaca", "xaxim", "zebra"
]

function shuffleList(array: string[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export function RandomWords(n: number) {
        
    if (n >= wordList.length){
        return shuffleList([...wordList])
    } 

    return  shuffleList([...wordList]).slice(0, n);
}