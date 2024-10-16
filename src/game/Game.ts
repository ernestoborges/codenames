import { RandomWords, shuffleList } from '../utils/functions';
import { Log } from './Log';
import { Player } from './Player';

export class Game {
    private log: Log
    turn: number
    phase: number
    clue: {
        word: string
        number: number
        remaining: number
    }
    board: {
        word: string
        color: number
        position: number
        tips: string[]
        hidden: boolean
    }[]
    teamsScore: {
        team1: number
        team2: number
    }
    winner: number

    // constructor(room: GameRoom) {
    constructor(log) {
        this.turn = 1
        this.clue = { word: '', number: 0, remaining: 0 }
        this.teamsScore = {
            team1: 0,
            team2: 0
        }
        this.board = []
        this.log = log
    }

    flipCard(player: Player, position: number) {

        const team = player.team;
        const card = this.board[position];
        card.hidden = false;
        const opponentTeam = team === 1 ? 2 : 1

        const logEvent = {
            player: {
                role: player.role,
                team: player.team,
                username: player.username,
            },
            flip: {
                word: card.word,
                color: card.color
            }
        }
        this.log.addActionLog(logEvent)

        switch (card.color) {
            case 0: // gray card
                this.endTurn();
                break;
            case 1: // blue card
            case 2: // red card
                {
                    this.clue.remaining--
                    if (team === card.color) { // own team card
                        this.teamsScore[team === 1 ? 'team1' : 'team2']--
                        if (this.teamsScore[team === 1 ? 'team1' : 'team2'] <= 0) {
                            this.gameOver(team)
                        } else if (this.clue.number >= 0 && this.clue.remaining <= 0) {
                            this.endTurn();
                        }
                    } else {  // opponent's card
                        this.teamsScore[opponentTeam === 1 ? 'team1' : 'team2']--
                        if (this.teamsScore[opponentTeam === 1 ? 'team1' : 'team2'] <= 0) {
                            this.gameOver(opponentTeam)
                        } else {
                            this.endTurn();
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

    gameOver(winner: 1 | 2) {
        this.winner = winner;
        this.log.addSystemLog({ event: 'gameOver', winner })
    }

    endTurn() {
        this.turn = this.turn === 1 ? 2 : 1;
        this.phase = 1;
        this.clue = { word: '', number: 0, remaining: 0 };
        this.log.addSystemLog({ event: 'endTurn' })
    }

    startGame() {
        const words = RandomWords(25);
        const firstTeam = Math.random() < 0.5 ? 1 : 2;
        const nCardsTeam1 = firstTeam === 1 ? 9 : 8;
        const nCardsTeam2 = firstTeam === 1 ? 8 : 9;

        const cores = [3, ...Array(nCardsTeam1).fill(1), ...Array(nCardsTeam2).fill(2), ...Array(7).fill(0)];
        const coresEmbaralhadas = shuffleList(cores);

        const cards = words.map((word, i) => ({
            word,
            color: coresEmbaralhadas[i],
            position: i,
            tips: [],
            hidden: true
        }));


        this.turn = firstTeam
        this.phase = 1
        this.clue = { word: '', number: 0, remaining: 0 }
        this.teamsScore = {
            team1: nCardsTeam1,
            team2: nCardsTeam2
        }
        this.board = cards
        this.winner = 0

        this.log.addSystemLog({ event: 'gameStart' })
    }

    restartGame() {
        this.log.addSystemLog({ event: 'gameReset' })
        this.startGame()
    }
}

