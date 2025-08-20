import Header from "~/components/Header/Header";
import Hero from "~/components/Hero/Hero";
import LearnIntro from "~/components/LearnIntro/LearnIntro";
import PracticeIntro from "~/components/PractiseIntro/PracticeIntro";
import Stats from "~/components/Stats/Stats";

const Home = () => {
  return (
    <>
      <Header />
      <Hero />
      <Stats />
      <LearnIntro />
      <PracticeIntro />
    </>
  );
};

export default Home;
