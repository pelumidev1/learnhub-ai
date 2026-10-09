import "./index.css";
import { Composition, Folder } from "remotion";
import { Hero, HERO_LEN } from "./Hero";
import { CakeAd, CAKE_AD_LEN } from "./CakeAd";
import { LESSONS } from "./lessons";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Hero" component={Hero} durationInFrames={HERO_LEN} fps={30} width={1920} height={1080} />
    {/* The Instagram cut: the same film, each scene laid out for a tall frame (see useVertical). */}
    <Composition id="HeroVertical" component={Hero} durationInFrames={HERO_LEN} fps={30} width={1080} height={1920} />
    {/* Bootcamp lesson films: narrated, captioned, 16:9 for the lesson page. */}
    <Folder name="Lessons">
      {LESSONS.map(([id, l]) => <Composition key={id} id={id} component={l.Film} durationInFrames={l.length} fps={30} width={1920} height={1080} />)}
    </Folder>
    <Composition id="CakeAd" component={CakeAd} durationInFrames={CAKE_AD_LEN} fps={30} width={1080} height={1920} />
  </>
);
