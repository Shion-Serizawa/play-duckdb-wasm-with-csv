import * as monaco from 'monaco-editor';

export function createEditor(container: HTMLElement, value: string = 'SELECT * FROM test;', language: string = 'sql') {
  return monaco.editor.create(container, {
    value,
    language,
    theme: 'vs-dark',
    automaticLayout: true
  });
}

export function getEditorValue(editor: monaco.editor.IStandaloneCodeEditor): string {
  return editor.getValue();
}
