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

type NavigatorOptions = {
  initialLocation: Locator;
};

interface Navigator {
  init(options: NavigatorOptions): Promise<Navigator>;
  currentLocation: Locator;

  // change location
  goTo(link: Link): Promise<boolean>;
  goTo(locator: Locator): Promise<boolean>;
  goForward(): Promise<boolean>;
  goBackward(): Promise<boolean>;
}

export interface VisualNavigator extends Navigator {
  readingProgression: ReadingPosition;

  // change location
  goLeft(): Promise<boolean>;
  goRight(): Promise<boolean>;
}
