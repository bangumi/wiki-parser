export const GlobalPrefixError = "missing prefix '{{Infobox' at the start";
export const GlobalSuffixError = "missing suffix '}}' at the end";
export const ArrayNoCloseError = "array should be closed by '}'";
export const ArrayItemWrappedError = "array item should be wrapped by '[]'";
export const ExpectingNewFieldError = "missing '|' to start a new field";
export const ExpectingSignEqualError = "missing '=' to separate field name and value";

export class WikiSyntaxError extends Error {
  lino: number;
  line: string | null;

  constructor(lino: number, line: string | null, message: string) {
    super(toErrorString(lino, line, message));
    this.line = line;
    this.lino = lino;
  }
}

function toErrorString(lino: number, line: string | null, msg: string): string {
  if (line === null) {
    return `WikiSyntaxError: ${msg}, line ${lino}`;
  }

  return `WikiSyntaxError: ${msg}, line ${lino}: ${JSON.stringify(line)}`;
}
