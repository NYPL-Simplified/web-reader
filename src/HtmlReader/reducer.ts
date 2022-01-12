import { ReaderArguments } from '../types';
import {
  getCurrentIndex,
  linkToLocator,
  calcPosition,
  getFromReadingOrder,
  FONT_SIZE_STEP,
  isSameResource,
} from './lib';
import {
  FetchingResourceState,
  HtmlAction,
  HtmlState,
  LoadingIframeState,
  ReadyState,
  NavigatingState,
  RenderingIframeState,
  ResourceFetchErrorState,
  InactiveState,
} from './types';
import { getLocationQuery } from './useLocationQuery';

/**
 * A higher order function that makes it easy to access arguments in the reducer
 * without passing them in to every `dispatch` call.
 */
export default function makeHtmlReducer(
  args: ReaderArguments
): (state: HtmlState, action: HtmlAction) => HtmlState {
  /**
   * If there are no args, it's an inactive hook, or you are pre-first render.
   * just use a function that returns the state in most cases so you don't have
   * to keep checking if args is defined.
   */
  if (!args) return (state: HtmlState, _action: HtmlAction) => state;

  const { manifest, webpubManifestUrl } = args;

  // our actual reducer
  return function reducer(state: HtmlState, action: HtmlAction): HtmlState {
    function goToNextResource(): HtmlState {
      const currentIndex = getCurrentIndex(manifest, state, webpubManifestUrl);
      const nextIndex = currentIndex + 1;
      // if we are at the end, do nothing
      if (nextIndex >= manifest.readingOrder.length) return state;
      const nextResource = manifest.readingOrder[nextIndex];
      const locator = linkToLocator(nextResource, webpubManifestUrl);
      const newState: FetchingResourceState = {
        ...state,
        state: 'FETCHING_RESOURCE',
        location: locator,
        isNavigated: false,
        isIframeLoaded: false,
        resource: undefined,
        resourceFetchError: undefined,
        isFetchingResource: true,
        iframe: null,
      };
      return newState;
    }

    function goToPrevResource(): HtmlState {
      const currentIndex = getCurrentIndex(manifest, state, webpubManifestUrl);
      const prevIndex = currentIndex - 1;
      // if we are at the beginning, do nothing
      if (currentIndex === 0) {
        console.warn('At the beginning');
        return state;
      }
      const prevResource = manifest.readingOrder[prevIndex];
      // send them to the end of the next resource
      const locator = linkToLocator(prevResource, webpubManifestUrl, {
        progression: 1,
      });
      const newState: FetchingResourceState = {
        ...state,
        state: 'FETCHING_RESOURCE',
        location: locator,
        isNavigated: false,
        isIframeLoaded: false,
        resource: undefined,
        resourceFetchError: undefined,
        isFetchingResource: true,
        iframe: null,
      };
      return newState;
    }

    switch (action.type) {
      case 'ARGS_CHANGED': {
        if (!action.args) {
          return inactiveState;
        }
        const location = getLocationQuery() ?? {
          href: args.manifest.readingOrder[0].href,
          locations: {},
        };

        const fetchingResource: FetchingResourceState = {
          ...state,
          state: 'FETCHING_RESOURCE',
          isFetchingResource: true,
          location,
          resourceFetchError: undefined,
          resource: undefined,
          isNavigated: false,
          iframe: null,
          isIframeLoaded: false,
        };
        return fetchingResource;
      }
      case 'RESOURCE_FETCH_SUCCESS': {
        if (state.state === 'INACTIVE') {
          return handleInvalidTransition(state, action);
        }
        const newState: RenderingIframeState = {
          ...state,
          state: 'RENDERING_IFRAME',
          isFetchingResource: false,
          resource: action.resource,
          resourceFetchError: undefined,
          isIframeLoaded: false,
          isNavigated: false,
          iframe: null,
        };
        return newState;
      }
      case 'RESOURCE_FETCH_ERROR': {
        if (state.state !== 'FETCHING_RESOURCE') {
          return handleInvalidTransition(state, action);
        }
        const newState: ResourceFetchErrorState = {
          ...state,
          state: 'RESOURCE_FETCH_ERROR',
          isFetchingResource: false,
          resourceFetchError: action.error,
          resource: undefined,
          isIframeLoaded: false,
          isNavigated: false,
        };
        return newState;
      }

      case 'IFRAME_LOADED': {
        if (state.state !== 'LOADING_IFRAME') {
          return handleInvalidTransition(state, action);
        }
        const { currentPage, totalPages } = calcPosition(
          state.iframe,
          state.isScrolling
        );

        const newState: NavigatingState = {
          ...state,
          state: 'NAVIGATING',
          isIframeLoaded: true,
          isNavigated: false,
          location: {
            ...state.location,
            locations: {
              ...state.location.locations,
              position: currentPage,
              remainingPositions: totalPages - currentPage,
            },
          },
        };
        return newState;
      }

      case 'NAV_NEXT_RESOURCE': {
        return goToNextResource();
      }

      case 'NAV_PREVIOUS_RESOURCE': {
        return goToPrevResource();
      }

      case 'GO_TO_HREF': {
        if (state.state !== 'READY') {
          return handleInvalidTransition(state, action);
        }
        const { link } =
          getFromReadingOrder(action.href, manifest, webpubManifestUrl) ?? {};
        if (!link) {
          console.error(`No readingOrder entry found for href: ${action.href}`);
          return state;
        }
        const linkwithOrigHref = {
          ...link,
          href: action.href,
        };

        const locator = linkToLocator(linkwithOrigHref, webpubManifestUrl);

        const isNewResource = !isSameResource(
          action.href,
          state.location.href,
          webpubManifestUrl
        );

        // we are going to a new resource, so we go back to the
        // FetchingResourceState
        if (isNewResource) {
          const newState: FetchingResourceState = {
            ...state,
            state: 'FETCHING_RESOURCE',
            location: locator,
            isNavigated: false,
            isIframeLoaded: false,
            resource: undefined,
            resourceFetchError: undefined,
            isFetchingResource: true,
            iframe: null,
          };
          return newState;
        }

        // otherwise it is the same resource, just navigate
        const newState: NavigatingState = {
          ...state,
          state: 'NAVIGATING',
          location: locator,
          isNavigated: false,
        };
        return newState;
      }

      case 'GO_TO_LOCATION': {
        if (state.state !== 'READY') {
          return handleInvalidTransition(state, action);
        }
        const isNewResource = !isSameResource(
          action.location.href,
          state.location.href,
          webpubManifestUrl
        );

        // we are going to a new resource, so we go back to the
        // FetchingResourceState
        if (isNewResource) {
          const newState: FetchingResourceState = {
            ...state,
            state: 'FETCHING_RESOURCE',
            location: action.location,
            isNavigated: false,
            isIframeLoaded: false,
            resource: undefined,
            resourceFetchError: undefined,
            isFetchingResource: true,
            iframe: null,
          };
          return newState;
        }

        // otherwise it is the same resource, just navigate
        const newState: NavigatingState = {
          ...state,
          state: 'NAVIGATING',
          location: action.location,
          isNavigated: false,
        };

        return newState;
      }

      case 'WINDOW_RESIZED': {
        if (state.state !== 'READY' && state.state !== 'NAVIGATING') {
          return state;
        }
        /**
         * We just go back to navigating when the window is resized.
         */
        const newState: NavigatingState = {
          ...state,
          state: 'NAVIGATING',
          isNavigated: false,
          location: {
            ...state.location,
            locations: {
              progression: state.location.locations.progression,
            },
          },
        };
        return newState;
      }

      case 'GO_FORWARD': {
        /**
         * We are going to scroll the user forward by one page unit,
         * unless we are at the end of the resource, in which case we
         * need to go to the next resource
         */

        // if the iframe isn't loaded and present, we can't do anything yet
        if (state.state !== 'READY') {
          return handleInvalidTransition(state, action);
        }

        const { progression, totalPages, currentPage } = calcPosition(
          state.iframe,
          state.isScrolling
        );

        // if we are at the last page, go to next resource
        if (currentPage === totalPages) {
          return goToNextResource();
        }

        /**
         * Set the progression so that we scroll the user by
         * one page, but also set the 'position' value
         */
        const percentToScroll = 1 / totalPages;
        const newProgression = progression + percentToScroll;
        const newPosition = currentPage + 1;

        const newState: NavigatingState = {
          ...state,
          state: 'NAVIGATING',
          location: {
            ...state.location,
            locations: {
              progression: newProgression,
              position: newPosition,
              remainingPositions: totalPages - newPosition,
            },
          },
          isNavigated: false,
        };
        return newState;
      }

      case 'GO_BACKWARD': {
        if (state.state !== 'READY') {
          return handleInvalidTransition(state, action);
        }
        const { progression, totalPages, currentPage } = calcPosition(
          state.iframe,
          state.isScrolling
        );

        // if we are at the last page, go to next resource
        if (currentPage === 1) {
          return goToPrevResource();
        }

        /**
         * Set the progression so that we scroll the user back
         * one page, but also set the 'position' value
         */
        const percentToScroll = 1 / totalPages;
        const newProgression = Math.max(progression - percentToScroll, 0);
        const newPosition = Math.max(currentPage - 1, 1);

        const newState: NavigatingState = {
          ...state,
          state: 'NAVIGATING',
          location: {
            ...state.location,
            locations: {
              progression: newProgression,
              position: newPosition,
              remainingPositions: totalPages - newPosition,
            },
          },
          isNavigated: false,
        };
        return newState;
      }

      case 'NAV_COMPLETE': {
        if (state.state !== 'NAVIGATING') {
          return handleInvalidTransition(state, action);
        }
        const { totalPages, currentPage } = calcPosition(
          state.iframe,
          state.isScrolling
        );
        const newState: ReadyState = {
          ...state,
          state: 'READY',
          isNavigated: true,
          location: {
            ...state.location,
            locations: {
              ...state.location.locations,
              position: currentPage,
              remainingPositions: totalPages - currentPage,
            },
          },
        };
        return newState;
      }

      case 'SET_COLOR_MODE':
        return {
          ...state,
          colorMode: action.mode,
        };

      case 'SET_SCROLL': {
        /**
         * - set scroll state
         * - trigger a navigation effect
         * - remove the progression value and only set a position
         *   value so the user snaps to whichever page they were just
         *   reading.
         */
        if (state.state !== 'NAVIGATING') {
          return handleInvalidTransition(state, action);
        }
        const { currentPageFloor, totalPages } = calcPosition(
          state.iframe,
          state.isScrolling
        );
        const newState: NavigatingState = {
          ...state,
          isScrolling: action.isScrolling,
          isNavigated: false,
          location: {
            ...state.location,
            locations: {
              position: currentPageFloor,
              remainingPositions: totalPages - currentPageFloor,
            },
          },
        };
        return newState;
      }

      case 'INCREASE_FONT_SIZE': {
        const newSize = state.fontSize + FONT_SIZE_STEP;
        return {
          ...state,
          fontSize: newSize > 0 ? newSize : 0,
        };
      }

      case 'DECREASE_FONT_SIZE': {
        const newSize = state.fontSize - FONT_SIZE_STEP;
        return {
          ...state,
          fontSize: newSize > 0 ? newSize : 0,
        };
      }

      case 'SET_FONT_FAMILY':
        return {
          ...state,
          fontFamily: action.family,
        };

      case 'SET_IFRAME': {
        if (state.state !== 'RENDERING_IFRAME' || !action.iframe) {
          return handleInvalidTransition(state, action);
        }
        const newState: LoadingIframeState = {
          ...state,
          state: 'LOADING_IFRAME',
          iframe: action.iframe,
        };
        return newState;
      }

      case 'USER_SCROLLED': {
        if (state.state !== 'READY') {
          return handleInvalidTransition(state, action);
        }
        // update the progression, but don't trigger a navigation effect
        // update the y value
        const { progression, currentPage, totalPages } = calcPosition(
          state.iframe,
          state.isScrolling
        );
        const newState: ReadyState = {
          ...state,
          // don't trigger a navigation effect because the user freely scrolled here
          isNavigated: true,
          location: {
            ...state.location,
            locations: {
              progression,
              position: currentPage,
              remainingPositions: totalPages - currentPage,
            },
          },
        };
        return newState;
      }
    }
  };
}

function handleInvalidTransition(state: HtmlState, action: HtmlAction) {
  console.warn('Inavlid state transition attempted', state, action);
  return state;
}

export const inactiveState: InactiveState = {
  colorMode: 'day',
  isScrolling: false,
  fontSize: 100,
  fontFamily: 'sans-serif',
  currentTocUrl: null,
  atStart: false,
  atEnd: false,
  iframe: null,
  isIframeLoaded: false,
  isNavigated: false,
  resource: undefined,
  isFetchingResource: false,
  resourceFetchError: undefined,
  state: 'INACTIVE',
  location: undefined,
};
