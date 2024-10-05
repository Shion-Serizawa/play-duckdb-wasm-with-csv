<script lang="ts">
	import { initializeDuckDB, queryResult } from '$lib/duckdbService';
	import { onMount } from 'svelte';
	
	// クエリ結果をストアから取得
	let queryResults = [];

	// ストアの購読
	$: queryResults = $queryResult;

	// DuckDBを初期化
	onMount(() => {
		initializeDuckDB();
	});
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<button on:click={initializeDuckDB}> DuckDBを再初期化する </button>

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
