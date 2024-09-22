import { Socket, Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { RandomWords, shuffleList } from '../utils/words';
import { generateToken, verifyToken } from '../utils/token';
import { Player } from './Player';


export class Game {
    turn: number
    phase: number
    clue: {
        word: string
        number: number
    }
    board: any[]
    teamsScore: {
        team1: number
        team2: number
    }
    winner: number

    constructor() {
        this.turn = 1
        this.clue = { word: '', number: 0 }
        this.teamsScore = {
            team1: 0,
            team2: 0
        }
        this.board = []
    }

    flipCard(team: number, position: number) {

        const card = this.board[position];
        card.hidden = false;
        const opponentTeam = team === 1 ? 2 : 1

        switch (card.color) {
            case 0: // gray card
                {
                    this.turn = opponentTeam;
                    this.phase = 1;
                    this.clue = { word: '', number: 0 };
                }
                break;
            case 1: // blue card
            case 2: // red card
                {
                    this.clue.number--
                    if (team === card.color) { // own team card
                        this.teamsScore[team === 1 ? 'team1' : 'team2']--
                        if (this.teamsScore[team === 1 ? 'team1' : 'team2'] <= 0) {
                            this.gameOver(team)
                        } else if (this.clue.number <= 0) {
                            this.turn = opponentTeam;
                            this.phase = 1;
                            this.clue = { word: '', number: 0 };
                        }
                    } else {  // opponent's card
                        this.teamsScore[opponentTeam === 1 ? 'team1' : 'team2']--
                        if (this.teamsScore[opponentTeam === 1 ? 'team1' : 'team2'] <= 0) {
                            this.gameOver(opponentTeam)
                        } else {
                            this.turn = opponentTeam;
                            this.phase = 1;
                            this.clue = { word: '', number: 0 };
                        }
                    }
                }
                break;
            case 3: // black card
                this.gameOver(opponentTeam)
                break;
        };
    }

    getOperativeCards() {
        const opperativeCards = this.board.map(card => {
            const { color, ...rest } = card;
            return card.hidden ? rest : card;
        });

        return opperativeCards
    }

    getCard(position: number) {
        return this.board.find(card => card.position === position)
    }

    gameOver(winner: number) {
        this.winner = winner;
    }

    startGame() {
        const words = RandomWords(25);
        const timeInicial = Math.random() < 0.5 ? 1 : 2;
        const timeIniciais = timeInicial === 1 ? 9 : 8;
        const timeOpostos = timeInicial === 1 ? 8 : 9;

        const cores = [3, ...Array(timeIniciais).fill(timeInicial), ...Array(timeOpostos).fill(timeInicial === 1 ? 2 : 1), ...Array(7).fill(0)];
        const coresEmbaralhadas = shuffleList(cores);

        const cards = words.map((word, i) => ({
            word,
            color: coresEmbaralhadas[i],
            position: i,
            tips: [],
            hidden: true
        }));


        this.turn = timeInicial
        this.phase = 1
        this.clue = { word: '', number: 5 }
        this.teamsScore = {
            team1: timeInicial === 1 ? 9 : 8,
            team2: timeInicial === 1 ? 8 : 9
        }
        this.board = cards
        this.winner = 0
    }

    restartGame() {
        this.startGame()
    }
}

