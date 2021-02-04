import ePub, { Book, NavItem, Rendition } from 'epubjs';
import * as React from 'react';

const EPUB_JS_WRAPPER_ID = 'epub-js-wrapper';

/**
 * PROBMLEMS
 *
 * How do we work with the location? It seems the current location can be a string
 * or an object, or something else. Maye we always use a CFI? I'm not sure.
 *
 * We are even struggling to get the initial location out of the rendition. We have no
 * way to know when the location is "ready". Currently we get type errors when trying to
 * access it because the manager is not yet defined.
 *
 * I think we need to decide a single way to store the location. CFI seems to make sense.
 *
 * Another problem: How do we store what kind of client is being used? I guess we don't use generics there.
 *
 * Can we get rid of the client altogether?
 */

const EpubComponent: React.FC<{ entrypoint: string }> = ({ entrypoint }) => {
  const [section, setSection] = React.useState<string | null>(null);
  const [rendition, setRendition] = React.useState<Rendition | null>(null);
  const [book, setBook] = React.useState<Book | null>(null);
  const [sections, setSections] = React.useState<NavItem[] | null>(null);

  function handleNext() {
    // setSection((section) => section + 1);
    rendition?.next();
  }
  function handlePrev() {
    rendition?.prev();
  }

  // initialize the book, render it, and set in state
  // this will be done on initializing the client.
  // also initialize the table of contents once book is ready.
  React.useEffect(() => {
    const book = ePub(entrypoint);
    book.ready.then(() => {
      setBook(book);
      const rend = book.renderTo(EPUB_JS_WRAPPER_ID);
      // wait for the rendition to finish "starting"
      rend.started.then(() => {
        setRendition(rend);
        setSections(book.navigation.toc);
      });
    });
  }, [entrypoint]);

  // when the section (Location) changes, keep the book up to date
  React.useEffect(() => {
    if (section) {
      rendition?.display(section);
    } else {
      setSection(book?.navigation.toc[0].href ?? null);
    }
  }, [section, rendition, book]);

  // set up a listener for location change events
  React.useEffect(() => {
    rendition?.on('relocation', (location: any) => {
      console.log('relocated!', location);
    });
    rendition?.on('locationChanged', (location: any) => {
      console.log('loc changed', location);
    });
  }, [rendition]);

  console.log(book?.packaging.metadata.title);

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button onClick={handlePrev}>Prev</button>
        <label>Table of Contents</label>
        <select onChange={(e) => setSection(e.target.value)}>
          {sections?.map((sect) => (
            <option value={sect.href} key={sect.href}>
              {sect.label}
            </option>
          ))}
        </select>
        <button onClick={handleNext}>Next</button>
      </div>
      <div id={EPUB_JS_WRAPPER_ID} />
    </>
  );
};

export default EpubComponent;
