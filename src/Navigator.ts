import { Locator } from '@d-i-t-a/reader/dist/model/Locator';
import { Link } from '@d-i-t-a/reader/dist/model/Publication';

/**
 * Defines the Navigator API through an abstract class. This class
 * is meant to be extended by HTMLNavigator or PDFNavigator
 */
export default abstract class Navigator {
  /**
   * This is used to tell react when the internal state of the class
   * is being mutated so that react knows to update.
   */
  abstract readonly _didMutate: () => void;
  didMutate() {
    this._didMutate();
  }

  /**
   * we can't type the init function because it needs to be static:
   * https://github.com/microsoft/TypeScript/issues/34516
   * */

  // static init(options: NavigatorArguments): Promise<Navigator>;

  abstract get currentLocation(): Locator;

  // change location
  abstract goTo(link: Link): Promise<boolean>;
  // abstract goTo(locator: Locator): Promise<boolean>;
  // for navigating one unit, unit depends on the format
  abstract goForward(): Promise<boolean>;
  abstract goBackward(): Promise<boolean>;
  // these do the same thing as forward and back, but depend
  // on reading direction
  abstract goLeft(): Promise<boolean>;
  abstract goRight(): Promise<boolean>;

  // settings
  abstract scroll(): void;
  abstract paginate(): void;
  abstract toggleScroll(): void;
  abstract get isScrolling(): boolean;
}

// used for initializer, but unfortunately can't be typed on the
// interface
export type NavigatorArguments = {
  webpubManifestUrl: string;
  didMutate: () => void;
  initialLocation?: Locator;
};
