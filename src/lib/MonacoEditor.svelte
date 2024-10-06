<svelte:options accessors={true} />

<script>
	import { onMount } from 'svelte';
	import loader from '@monaco-editor/loader';

	let editorContainer;
	let editor;

	// Svelteコンポーネントの外からアクセス可能にするため、エディタをthisにバインド
	export let getEditorValue;

	onMount(async () => {
		const monaco = await loader.init();

		editor = monaco.editor.create(editorContainer, {
			value: 'SELECT * FROM test;', // 初期クエリ
			language: 'sql', // 言語をSQLに設定
			theme: 'vs-dark', // ダークテーマを適用
			automaticLayout: true, // 自動レイアウト
			minimap: { enabled: false } // ミニマップを非表示
		});

		getEditorValue = () => editor.getValue();

		return () => {
			if (editor) {
				editor.dispose(); // コンポーネントが破棄されたときにエディタを解放
			}
		};
	});
</script>

<div bind:this={editorContainer} style="width: 800px; height: 600px;"></div>
