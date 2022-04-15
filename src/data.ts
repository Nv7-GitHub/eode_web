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

export async function load(ids: number[]) {
  let res = await send(Method.MethodElemInfo, {
    "ids": ids,
  })
  if (res.error) {
    error(res.error);
    return;
  }
  
  for (var k in res.data) {
    let e = JSON.parse(res.data[k]);
    $elements.set(e.ID, e);
  }
  elements.set($elements);
}

