import { useRouter } from "next/router";
import SafeTransaction from "./transaction";
import Plugins from "./plugin";
import Safe from "./safe";

function Home() {
  const router = useRouter();

  const handleClick = (e: any, href) => {
    e.preventDefault();
    router.push(href);
  };

  return (
    <div className="w-full h-full">
      <SafeTransaction />
      {/* <Plugins /> */}
      {/* <Safe /> */}
    </div>
  );
}

export default Home;
