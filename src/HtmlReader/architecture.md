# `useHTMLReader` Architecture

This file is meant as a reference to document the current state of the `useHTMLReader` hook. It is specifically aimed at developers working with this code.

## Style

For controlling the style of the content, we use [Readium-CSS](https://github.com/readium/readium-css), which is also what R2D2BC used before us. By simply setting css variables, it allows us to control font size, color mode, font family, and more. Thus, to change the color mode, we simply need to change a CSS variable inside the iframe.

Readium-CSS also enables a "paginated" mode, where the full HTML resource is broken into multiple columns that are then rendered side by side in a horizontally scrolling container. Thus, to move to the next page in paginated mode, we simply scroll the user horizontally by one page-width.

## Lifecycle and State

We use `React.useReducer` as the single source of truth for state in this hook. Whenever anything changes, it should go through `useReducer`. If you render with the same state object twice, you should always get the same thing.

Given that there are more than 10 properties in the state object, and each one has multiple possible values, there are seemingly infinite possible states. However, the range of _valid_ states is actually much smaller. These states are:

- `InactiveState`: The hook was not provided any arguments, and thus it is inactive.
- `FetchingResourceState`: We are fetching a resource, and thus are "loading".
- `ResourceFetchErrorState`: We have encountered an error while fetching the resource.
- `RenderingIframeState`: We have the resource, and are now waiting for the iframe to finish rendering so that we have a reference to it. We get this reference via the `ref` property on the `<iframe>` tag. This is a very short state as it only exists during the single render cycle between when the resource finishes fetching and the iframe renders for the first time. Note that rendering the iframe element does not mean the iframe has rendered its children, that is separate.
- `LoadingIframeState`: We have rendered the iframe once, and are now waiting for it to fire off it's own `window.onLoad` function indicating that it has loaded all the html in the resource string we passed it.
- `NavigatingState`: The iframe has finished loading, and now we are waiting for our `useEffect` hook to complete any inter-resource navigation that might be necessary depending on the current `state.location`. For example, scrolling the user to a specific page.
- `ReadyState`: We have now navigated the user to a specific page, and are now finished with our work.

The definitions for these states can be found in `./types.ts`. Note that state transitions should happen in the order listed above, with the exception that it is possible to go backwards occasionally. For example, from the `ReadyState`, we may go back to `FetchingResourceState` if the user switches to a new resource, or we might simply go back to the `NavigatingState` if they navigate to a new location in the same resource.

We provide the text value `state.state` as a string describing the state. This makes it very easy to perform type narrowing. If `state.state === 'READY'`, typescript knows that `state.iframe` and `state.resource`, and more all exist.

### Reducer

It is recommended to look through the `./reducer` file to see how various actions (found defined in `./types.ts`) update the sate.

## Fetching resources

When the state is `FetchingResourceState`, we need to actually go out and fetch the resource referenced in `state.location.href`. We do this in the `useResource` hook. When we transition to a `FetchingResourceState`, that hook will call `getContent` to get the resource. It then will dispatch a `RESOURCE_FETCH_SUCCESS` action, which will transition the state to `RenderingIframeState`.

### Updating the resource

After fetching the resource, there are a couple things we need to do to it before we can render it:

- Set a `<base>` element in the `<head>` with the url of the resource. This tells the iframe where relative urls within the resource are relative to.
- Inject any injectables. For example, we need to add the Readium-CSS stylesheets to the `<head>`.
- Set initial CSS variables like scroll settings and color mode.

Note that we _could_ do all of this in a `useEffect` hook after the resource loads, but then there would be a flash of unstyled content between the first render and when we add our Readium-CSS stylesheet. To avoid this, we simple add it to the document string before it ever gets to the `<iframe>` for rendering.

## Updating the iframe

It is sometimes necessary to reach in to the iframe and update it as the result of some state transition. To do this, we use `React.useEffect`. There are two primary times we need to reach in to the iframe and update it:

1. When user settings change in the state, we need to update the CSS variables. This is a very simple hook in `useUpdateCSS`.
2. When a user navigates within one resource, we need to manually scroll them to the correct location. For example, when a user clicks the "Next Page" button, we update the location state, which triggers a navigation effect. In this effect, we need to reach in to the iframe and set the `scrollLeft` or `scrollTop` values to the location of the next page, depending on if the user is in scrolling or paginated mode. (more below).

### Inter-resource Navigation

This might be the most challenging aspect of the web reader architecture. In the Readium Architecture, a `Locator` indicates a specific location. `locator.href` is the resource, and `locator.locations` is an object containing multiple references to the specific location within the resource. It can contain:

- `progression`: A decimal value representing percent of the way through the resource. This is what we typically use when navigating to scroll positions. We calculate the `progression` of the desired position and scroll the user there.
- `fragment`: A string representing a location. Currently, we only support anchors (eg: `"#some-heading"`). We can scroll the user there by querying the dom for that element and then calling `el.scrollIntoView()`.
- `position`: An integer representation of the location, which I interpret to mean "page number". This is not very portable because the number of pages and size of pages changes when browser size changes or font size changes. Thus, we prefer to use `progression`, but we keep `position` updated in case we wish to display it at some point.

Note on CFIs: In the future, we would like to support CFIs. These are strings representing specific locations in an HTML document. They are portable as well. When you're reading a kindle and it says "location 441/2387", those numbers are the CFI that you are on and the total number of CFIs. More work on this is needed in the future.

## Other effects

1. `useUpdateScroll`: When the user scrolls freely, we wait for them to stop scrolling and then update dispatch an action to update the `state.location.locations.progression`, keeping the location up to date.
1. `useLocationQuery`: We now keep a copy of `state.location` sync'd to the `?location` query param in the URL. This allws users to share or save links to specific locations. So we use an effect to update the query whenever `state.location` changes.
1. `useWindowResize`: When the window resizes, we need to re-scroll the user to the location they are meant to be on. Thus we need to move backwards to the `NavigatingState`.
