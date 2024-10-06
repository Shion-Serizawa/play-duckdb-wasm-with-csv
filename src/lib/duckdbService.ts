import * as duckdb from "@duckdb/duckdb-wasm";
import { writable } from "svelte/store";

let db: duckdb.AsyncDuckDB | null = null;

export interface QueryResultRow {
    id: number;
    name: string;
}

// Svelteのストアを使ってリアクティブに管理する
export const queryResult = writable<QueryResultRow[]>([]);

// DuckDBの初期化
export async function initializeDuckDB(): Promise<void> {
    try {
        const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();

        const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);
        const worker_url = URL.createObjectURL(
            new Blob([`importScripts("${bundle.mainWorker!}");`], {
                type: "text/javascript",
            }),
        );

        const worker = new Worker(worker_url);
        const logger = new duckdb.ConsoleLogger();
        db = new duckdb.AsyncDuckDB(logger, worker);
        await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
        URL.revokeObjectURL(worker_url);

        console.log("DuckDBの初期化が完了しました。");
        await runSampleQuery();
    } catch (error) {
        console.error("DuckDBの初期化中にエラーが発生しました:", error);
    }
}

// ユーザーが入力したSQLクエリを実行する
export async function runUserQuery(query: string): Promise<void> {
    if (!db) {
        console.error("DuckDBが初期化されていません。");
        return;
    }
    const conn = await db.connect();
    try {
        const result = await conn.query(query);
        displayQueryResult(result);
    } catch (error) {
        console.error("クエリの実行中にエラーが発生しました:", error);
    } finally {
        await conn.close();
    }
}

// サンプルクエリの実行
export async function runSampleQuery(): Promise<void> {
    if (!db) {
        console.error("DuckDBが初期化されていません。");
        return;
    }
    const conn = await db.connect();
    await conn.query(`CREATE TABLE test (id INT, name VARCHAR);`);
    await conn.query(`INSERT INTO test VALUES (1, 'Alice'), (2, 'Bob');`);
    const result = await conn.query(`SELECT * FROM test;`);

    displayQueryResult(result);
    await conn.close();
}

// クエリ結果の表示
function displayQueryResult(result: any): void {
    const idValues = result.batches[0].data.children[0].values;
    const nameValues = result.batches[0].data.children[1].values;
    const offsets = result.batches[0].data.children[1].valueOffsets;

    const rows: QueryResultRow[] = [];

    for (let i = 0; i < idValues.length; i++) {
        const id = idValues[i];

        // 名前のバイト列を文字列に変換
        const nameArray = nameValues.slice(offsets[i], offsets[i + 1]);
        const name = String.fromCharCode(...nameArray);

        rows.push({ id, name });
    }

    // Svelteのストアにデータをセット
    queryResult.set(rows);
}

export async function importCSV(file: File): Promise<void> {
    if (!db || db == null) {
        console.error("DuckDBが初期化されていません。");
        return;
    }
    const reader = new FileReader();

    reader.onload = async function () {
        const csvData = reader.result as string;
        const conn = await db.connect();

        try {
            // CSVデータを仮想ファイルとして登録
            await db.registerFileText("uploaded_csv", csvData);

            // 登録されたCSVデータをテーブルにインポート
            await conn.query(
                `CREATE TABLE uploaded_csv AS SELECT * FROM read_csv_auto('uploaded_csv');`,
            );
            console.log("CSVファイルがインポートされました");
        } catch (error) {
            console.error("CSVインポート中にエラーが発生しました:", error);
        } finally {
            await conn.close();
        }
    };

    reader.readAsText(file);
}
