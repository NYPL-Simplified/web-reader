/**
 * Defines the Navigator API
    - Set Reading Order & Resources
    - Get Current Location
    - Go Forward
    - Go Backward
    - Go To Location
    - Set View Settings
    - Location Changed Event
    - Error Event
    - Open External URL Event
 */

import { Locator, ReadingPosition } from '@d-i-t-a/reader/dist/model/Locator';
import { Link } from '@d-i-t-a/reader/dist/model/Publication';
import { GetContent } from './types';

// used for initializer, but unfortunately can't be typed on the
// interface
export type NavigatorArguments = {
  webpubManifestUrl: string;
  getContent?: GetContent;
  initialLocation?: Locator;
};

interface Navigator {
  /**
   * we can't type the init function because it needs to be static:
   * https://github.com/microsoft/TypeScript/issues/34516
   * */

  // init(options: NavigatorOptions): Promise<Navigator>;

  currentLocation: Promise<Locator>;

  // change location
  goTo(link: Link): Promise<boolean>;
  goTo(locator: Locator): Promise<boolean>;
  goForward(): Promise<boolean>;
  goBackward(): Promise<boolean>;
}

export interface VisualNavigator extends Navigator {
  readingProgression: ReadingPosition;

  // change location
  // these do the same thing as forward and back, but depend
  // on reading direction
  goLeft(): Promise<boolean>;
  goRight(): Promise<boolean>;
}
