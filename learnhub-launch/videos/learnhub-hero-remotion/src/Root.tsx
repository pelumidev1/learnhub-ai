import "./index.css";
import { Composition } from "remotion";
import { Hero, HERO_LEN } from "./Hero";
import { CakeAd, CAKE_AD_LEN } from "./CakeAd";
import { LessonW1L1, W1L1_LEN } from "./lessons/w1l1/Lesson";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Hero" component={Hero} durationInFrames={HERO_LEN} fps={30} width={1920} height={1080} />
    {/* The Instagram cut: the same film, each scene laid out for a tall frame (see useVertical). */}
    <Composition id="HeroVertical" component={Hero} durationInFrames={HERO_LEN} fps={30} width={1080} height={1920} />
    {/* Bootcamp lesson films: narrated, captioned, 16:9 for the lesson page. */}
    <Composition id="Lesson-W1L1" component={LessonW1L1} durationInFrames={W1L1_LEN} fps={30} width={1920} height={1080} />
    <Composition id="CakeAd" component={CakeAd} durationInFrames={CAKE_AD_LEN} fps={30} width={1080} height={1920} />
  </>
);
