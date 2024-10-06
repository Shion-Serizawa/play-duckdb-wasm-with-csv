<script lang="ts">
    import { onMount } from 'svelte';
    import MonacoEditor from '$lib/MonacoEditor.svelte'; // MonacoEditorをインポート
    import { initializeDuckDB, runUserQuery, queryResult, importCSV } from '$lib/duckdbService'; // DuckDBサービスをインポート
  
    let editorInstance;
    let queryResults = { schema: [], rows: [] }; // 初期値を空の配列に設定
  
    // Svelteのストアを購読して結果を取得
    $: queryResults = $queryResult;
  
    onMount(() => {
      initializeDuckDB(); // DuckDBの初期化
    });
  
    function executeQuery() {
      const query = editorInstance.getEditorValue(); // エディタからクエリを取得
      runUserQuery(query); // クエリを実行
    }
  
    // CSVファイルがアップロードされた時の処理
    function handleFileUpload(event) {
      const file = event.target.files[0]; // ファイルを取得
      if (file) {
        importCSV(file); // DuckDBにインポート
      }
    }
  </script>
  
  <h1>DuckDBクエリエディタ</h1>
  
  <MonacoEditor bind:this={editorInstance} />
  <!-- Monaco Editor コンポーネントにバインド -->
  
  <div>
      <h2>CSVファイルをアップロード</h2>
      <input type="file" accept=".csv" on:change={handleFileUpload} />
      <h4>テーブル名はuploaded_csv</h4>
  </div>
  
  <button on:click={executeQuery}>クエリを実行</button>
  <!-- クエリ実行ボタン -->
  
  {#if queryResults.rows && queryResults.rows.length > 0} <!-- rows が存在しているかチェック -->
      <table>
          <thead>
              <tr>
                  {#each queryResults.schema as column}
                      <th>{column}</th> <!-- 動的にカラム名を表示 -->
                  {/each}
              </tr>
          </thead>
          <tbody>
              {#each queryResults.rows as row}
                  <tr>
                      {#each queryResults.schema as column}
                          <td>{row[column]}</td> <!-- 動的にデータを表示 -->
                      {/each}
                  </tr>
              {/each}
          </tbody>
      </table>
  {/if}
  