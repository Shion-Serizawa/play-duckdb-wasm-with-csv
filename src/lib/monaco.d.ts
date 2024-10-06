declare module 'monaco-editor' {
    const monaco: any;
    export default monaco;
  }
  
  declare module '@monaco-editor/loader' {
    const loader: {
      init: () => Promise<typeof import('monaco-editor')>;
    };
    export default loader;
  }
  