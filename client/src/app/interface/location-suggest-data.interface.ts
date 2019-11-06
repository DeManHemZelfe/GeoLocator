interface Docs {
  docs: Array<object>;
}

export default interface LocationSuggestData {
  highlighting: object;
  response: Docs;
  spellcheck: object;
}
