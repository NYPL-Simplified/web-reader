# NYPL Web Reader

This project is a web reader built by NYPL for reading eBooks. It is built using the [Readium Architecture](https://github.com/readium/architecture), and specifically built for Webpubs. Webpub is a spec [defined by the Readium Foundation](https://github.com/readium/webpub-manifest) to provide a common abstraction between many types of web publications. Initially, this project will focus on HTML-based Webpubs and Webpubs that define PDF collections. An HTML-based Webpub can be generated from many types of eBooks, but most commonly ePubs.

There is a full architecture proposal for this project available [here](https://docs.google.com/document/d/1TfmyDfCixNOwD4v50mtuCWC6GfFAkaSR00uUtelfmow/edit?usp=sharing).

The project is bootstrapped with [TSDX](https://tsdx.io). It uses Typescript, React, Jest and Rollup, and features both a Storybook development environment and an example application under `/example`. The example is deployed here: https://nypl-web-reader.vercel.app.

A big thanks to [R2D2BC](https://github.com/d-i-t-a/R2D2BC) for providing the underlying HTML navigator capabilities.

## Demo

- [Example reader app](https://nypl-web-reader.vercel.app)
- [Storybook deployment](https://web-reader-storybook.vercel.app)

## Example

Basic usage within a React app, using the default UI:

```typescript
import WebReader from "nypl/web-reader"

const ReaderPage = ({manifestUrl}) => {
  return (
    <WebReader
      webpubManifest={manifestUrl}
    />
  )
}
```

Passing a content decryptor to the reader for use by the Client. This would be how we render AxisNow content for example:

```typescript
import WebReader from "nypl/web-reader"
import AxisNowDecryptor from "nypl/axisnow-access-control-web"

const ReaderPage = ({manifestUrl}) => {
  const decryptor = new AxisNowDecryptor(...);
  return (
	  <WebReader
      getContent={decryptor.getContent}
      manifestUrl={manifestUrl}
    />
  )
}
```

To support customization, you can piece together your own UI and call the `useWebReader` hook to get access to the reader API.

```typescript
import { useWebReader, ReaderNav, ReaderFooter } from "nypl/web-reader"

const CustomizedReaderPage = ({manifestUrl}) => {
	// takes a manifest, instantiates a Navigator, and
	// returns the Navigator, interaction handlers, and
	// the current state of the reader as an object
	const reader = useWebReader({
	  webpubManifestUrl,
	});

	return (
	  <div>
      {/* eg. keep default header, but change its background */}
      <ReaderNav {...reader} className="bg-blue" /> 

      {/* we can add custom prev/next page buttons */}
      <button onClick={reader.handleNextPage}>Next</button>
      <button onClick={reader.handlePrevPage}>Prev</button>

      {/* you will receive content from the reader to render wherever you want */}
      <reader.Content />
        
      {/* use the default footer */}
      <ReaderFooter {...reader} />
	  </div>
	)
}
```

Finally, to use in a vanilla Javascript app:

```html
  <div id="web-reader" />
  <script>
    const readerDiv = document.getElementById("web-reader");
    renderReader(readerDiv, {
      manifestUrl: xxx,
    });
  </script>
```

# Development
## Architecture

### Overview

We always start with a Webpub Manifest, which gives us metadata and the structure of the publication with links to the content. Depending on the `metadata.conformsTo` field, we know what type of `Navigator` to use to render the publication. The `Navigator`s provide all the functionality we need to interact with the various publication types. 

**Notes:**
- There is one `Navigator` per _media-type_ (PDF, HTML, Image, etc), not per _format_. As in, ePub and Mobi books are different formats that use the same media type (HTML). Audiobooks and PDF collections use different media types. We currently only have plans for HTML and PDF, but other Navigators are welcome and should fit right in.
- We always start from a Webpub Manifest. This means other formats (like ePub) need to be processed before they get to us. This can be done with a Readium Streamer, or some other way. 
  - For example, DRB is pre-generating PDF manifests from web-scraped content.
  - ePubs are generally run through a Streamer, which is a piece that fetches the full compressed ePub, generates a manifest for it, and then serves the individual pieces separately. 
  - AxisNow encrypted ePubs are served uncompressed. We will generate the manifest for them on the client before instantiating the reader.

### Pieces of the architecture:

1. **useWebReader hook**
  - Takes in the Webpub Manifest and instantiates the proper Navigator for it.
  - Instructs the Navigator to render to the appropriate HTML element.
  - Returns the current state to be displayed, and a set of functions to interact with the Navigator.
  - It can also take in an initial state to be used when initializing the Navigator, for example a current page or user settings.
2. **Navigators**
  - Provide a unified interface into a variety of media types. Follows the [Readium Navigator API](https://github.com/readium/architecture/blob/master/navigator/public-api.md)
  - Our HTML Navigator will use [@d-i-t-a/R2D2BC](https://github.com/d-i-t-a/R2D2BC) to render ePubs.
  - Our PDF Navigator will probably use PDF.js internally.
3. **Reader UI Components**
  - Accepts the state and methods returned from the useWebReader hook.
  - Renders the React UI
    - Header, controls, table of contents, etc
  - Exports both a default `WebReader` component, and individual components that the consuming application can use and style themselves: `ReaderNav`, `ReaderFooter`, `PreviousButton`, etc.


This is the folder structure:

```txt
/example            # example app packaged by Parcel
  index.html
  index.tsx         # entrypoint for the demo app
/src
  /HtmlNavigator    # the HTML Navigator used for ePub or any other HTML content
  /PdfNavigator     # a stub for the coming PDF Navigator
  /ui               # the react components for our default UI
    manager.tsx     # the fully-formed default UI
  /utils          
  index.tsx         # exports the main React Component <WebReader />
  Navigator.ts      # the Navigator interface without an implementation
  types.ts          # commonly used types
  useWebReader.tsx  # the React hook providing the main API into the reader
/test
  blah.test.tsx     # tests will go in here
/stories            # stories will go in here
/.storybook         # storybook config
```

## Commands

TSDX scaffolds our library inside `/src`, sets up a [Parcel-based](https://parceljs.org) playground for it inside `/example`, and a storybook app with stories in `/stories`.

Before getting started, be sure to run `npm install`.

The recommended workflow is to either run the storybook app, or the example app:
### Storybook

Run in `/web-reader`:
```bash
npm run start
```

Then in another terminal:

```bash
npm run storybook
```

This loads the stories from `./stories`.

> NOTE: Stories should reference the components as if using the library. This means importing from the root project directory. This has been aliased in the tsconfig and the storybook webpack config as a helper.

### Example

To run the example app:

```bash
cd example
npm i 
npm run start
```

The example imports and live reloads.

### Other Scripts

- `npm run test` - to run Jest in watch mode.
- `npm run size` - to calculate the real cost of the library for consumers (using [size-limit](https://github.com/ai/size-limit)).
- `npm run analyze` - to analyze the library bundle for places we can shrink down.

## Code Quality

Code quality enforcement is set up with `prettier`, `husky`, and `lint-staged`. Run `npm run lint` to lint the code, or have you editor do it. 

## Styling / CSS

We have not yet made a firm decision on styles, but we will probably use css modules for the UI components we ship with the package.

## Continuous Integration

### GitHub Actions

There are two Github Workflows:

- `main` which installs deps w/ cache, lints, tests, and builds on all pushes against a Node and OS matrix
- `size` which comments cost comparison of your library on every pull request using [size-limit](https://github.com/ai/size-limit)

## Optimizations

Please see the main `tsdx` [optimizations docs](https://github.com/palmerhq/tsdx#optimizations). In particular, know that you can take advantage of development-only optimizations:

```js
// ./types/index.d.ts
declare var __DEV__: boolean;

// inside your code...
if (__DEV__) {
  console.log('foo');
}
```

You can also choose to install and use [invariant](https://github.com/palmerhq/tsdx#invariant) and [warning](https://github.com/palmerhq/tsdx#warning) functions.

## Module Formats

CJS, ESModules, and UMD module formats are supported.

The appropriate paths are configured in `package.json` and `dist/index.js` accordingly. Please report if any issues are found.

## Deploying the Example Playground

The Playground is just a simple [Parcel](https://parceljs.org) app, you can deploy it anywhere you would normally deploy that. We have deployed it to Vercel. Here is how you build a standalone version:

```bash
cd example # if not already in the example folder
npm run build # builds to dist
```

## Publishing to NPM

Not done yet, but we will probable use [np](https://github.com/sindresorhus/np) or otherwise integrate it into our Github Workflow.
