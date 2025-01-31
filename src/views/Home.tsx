import HeroImage from "@/assets/heroImage.png";
import AppleClip from "@/assets/apple-art.svg";

function Home() {
  return (
    <section id="home" className="w-full p-32 flex flex-col gap-8 h-screen">
      <div className="flex gap-4 w-full">
        <div className="p-4 w-full">
            <img src={AppleClip} className="-rotate-12 relative -bottom-16 -left-16"/>
            <span className="uppercase text-[102px] leading-[90px]">my name <br/>is <span className="font-bold">james <br/> yunana...</span></span>
        </div>
        <div className="w-full">
          <img src={HeroImage} />
        </div>
      </div>
    </section>
  );
}

export default Home;
