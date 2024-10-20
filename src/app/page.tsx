import Lobby from "../components/templates/Lobby";
import { TokenProvider } from "../context/token";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <TokenProvider>
        <Lobby />
      </TokenProvider>
    </main>
  );
}
