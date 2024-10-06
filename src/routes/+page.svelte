<script lang="ts">
    import { onMount } from 'svelte';
    import MonacoEditor from '$lib/MonacoEditor.svelte'; // MonacoEditorをインポート
    import { initializeDuckDB, runUserQuery, queryResult } from '$lib/duckdbService'; // DuckDBサービスをインポート
    import { writable } from 'svelte/store';
  
    let editorInstance;
    let queryResults = [];
  
    $: queryResults = $queryResult;
  
    onMount(() => {
      initializeDuckDB(); // DuckDBの初期化
    });
  
    function executeQuery() {
      const query = editorInstance.getEditorValue();  // エディタからクエリを取得
      runUserQuery(query);             // クエリを実行
    }
  </script>
  
  <h1>DuckDBクエリエディタ</h1>
  
  <MonacoEditor bind:this={editorInstance} /> <!-- Monaco Editor コンポーネントにバインド -->
  
  <button on:click={executeQuery}>クエリを実行</button> <!-- クエリ実行ボタン -->
  
  {#if queryResults.length > 0}
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        {#each queryResults as row}
          <tr>
            <td>{row.id}</td>
            <td>{row.name}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
  