declare module 'wink-lemmatizer' {
  function noun(word: string): string;
  function verb(word: string): string;
  function adjective(word: string): string;
  const lemmatizer: {
    noun: typeof noun;
    verb: typeof verb;
    adjective: typeof adjective;
  };
  export default lemmatizer;
}
