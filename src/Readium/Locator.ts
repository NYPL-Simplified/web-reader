export interface Locator {
  href: string;
  type?: string;
  title?: string;
  locations: Locations;
  text?: LocatorText;
}
export interface LocatorText {
  after?: string;
  before?: string;
  highlight?: string;
}
export interface Locations {
  fragment?: string;
  progression?: number;
  position?: number;
  totalProgression?: number;
  remainingPositions?: number;
  totalRemainingPositions?: number;
}
