import { init } from "svelte/internal";
import { Writable, writable } from "svelte/store";
import { Method, send } from "./conn";
import { error } from "./ui";

export interface Elem {
  ID: number;
  Name: string;
  Image: string;
  Color: number; // integer of hex code
  Guild: string;
  Comment: string;
  Creator: string;
  CreatedOn: number; // unix timestamp (seconds, not ms)
  Parents: number[];

  Complexity: number;
  Difficulty: number;
  UsedIn: number;
  TreeSize: number;

  Air: number; // Big
  Earth: number; // Big
  Fire: number; // Big
  Water: number; // Big
  
  Commenter: string;
  Colorer: string;
  Imager: string;
}

let $elements = new Map<number, Elem>();
export let elements  = writable($elements);
elements.subscribe(e => $elements = e);

let db: IDBDatabase;

export async function initData(gld) {
  db = await new Promise<IDBDatabase>((res) => {
    let req = window.indexedDB.open(gld);
    req.onupgradeneeded = (ev) => {
      var db = (ev.target as IDBOpenDBRequest).result;
      db.createObjectStore("elements", { keyPath: "ID" });
      res(db);
    }

    req.onsuccess = ((ev: Event) => {
      res((ev.target as IDBOpenDBRequest).result);
    })
  });

  // Load elements
  let transaction = db.transaction(["elements"], "readonly");
  let obj = transaction.objectStore("elements");
  let req = obj.getAll();

  return new Promise<void>((resolve) => {
    req.onsuccess = (ev) => {
      let res = (ev.target as IDBRequest).result as Elem[];
      for (let el of res) {
        $elements.set(el.ID, el);
      }
      elements.set($elements);
      resolve();
    }
  })
}

async function saveElems(ids: number[]) {
  let transaction = db.transaction(["elements"], "readwrite");
  let out = new Promise<void>((res) => {
    transaction.oncomplete = () => {
      res();
    }
  })

  let objectStore = transaction.objectStore("elements");
  for (var id in ids) {
    let elem = $elements.get(ids[id]);
    objectStore.put(elem);
  }

  return out;
}

export async function load(ids: number[]) {
  // Check if have
  let need = [];
  for (var val of ids) {
    if (!$elements.has(val)) {
      need.push(val);
    }
  }
  if (need.length == 0) {
    return;
  }
  ids = need;

  let res = await send(Method.MethodElemInfo, {
    "ids": ids,
  })
  if (res.error) {
    error(res.error);
    return;
  }
  
  let toSave: number[] = [];
  for (var k in res.data) {
    let e = JSON.parse(res.data[k]);
    $elements.set(e.ID, e);
    toSave.push(e.ID);
  }
  await saveElems(toSave);
  elements.set($elements);
}

type SidebarValue = {
  elem: number,
  id: number,
}
export let sidebar: Writable<SidebarValue[]> = writable([]);
export let sidebarCnt = writable(0);
export let picked = writable(0);
export let inv: Writable<number[]> = writable([]);