import { useRouter } from "next/router";
import SafeTransaction from "./transaction";
import Plugins from "./plugin";

function Home() {
  const router = useRouter();

  const handleClick = (e: any, href) => {
    e.preventDefault();
    router.push(href);
  };

  return (
    <div className="bg-[#0B0B0B] w-full h-full">
      {/* <SafeTransaction /> */}
      <Plugins />
    </div>
  );
}

export default Home;
