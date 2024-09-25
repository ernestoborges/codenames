import { RandomWords } from "../../utils/functions";
import GameBoard from "../molecules/GameBoard";
import { GameTipBar } from "../molecules/GameTipBar";
import GameTeamSection from "./GameTeamSection";

export default function GameTable() {

    const wordList = RandomWords(25);
    let playerList = ['ernesto', 'naessa']
    return <>
        <div className="flex gap-4">
            <div className="flex flex-col gap-4">
                <GameTeamSection />
                <GameTeamSection />
                <div className="flex flex-col gap-4 border-2 border-white p-4 rounded-lg">
                    <span>pessoas na sala</span>
                    <div className="flex flex-col gap-4">
                        {
                            playerList.map((player, i) => <span key={i}>{player}</span>)
                        }
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-4 items-center">
                <GameBoard wordList={wordList} />
                <GameTipBar />
            </div>
        </div>
    </>
}