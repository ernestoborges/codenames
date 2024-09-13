'use client'
import GameCard from "@/components/atoms/GameCard";
import GameBoard from "@/components/molecules/GameBoard";
import GameTable from "@/components/organism/GameTable";
import useSocket from "@/hooks/useSocket";
import { RandomWords } from "@/utils/words";

export default function CodenamesMain(){

    // const socket = useSocket();
   
    return <>
        {/* <Lobby /> */}
        <GameTable />
    </>
}