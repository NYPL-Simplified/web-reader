type AnyFormat = 'e' | 'p';

type TheReturn<TStr> = {
  str: TStr;
};

type GetReturn<T extends AnyFormat> = T extends 'e'
  ? TheReturn<'epub'>
  : TheReturn<'pdf'>;

function doIt(format: 'p'): TheReturn<'pdf'>;
function doIt(format: 'e'): TheReturn<'epub'>;
function doIt(format: 'e' | 'p'): TheReturn<'epub'> | TheReturn<'pdf'> {
  if (format === 'e') return { str: 'pdf' };
  return { str: 'pdf' };
}

const epub: TheReturn<'epub'> = doIt('e');
const str: 'epub' = epub.str;

const some: AnyFormat = 'p';
const ret: TheReturn<'pdf'> = doIt('p');
