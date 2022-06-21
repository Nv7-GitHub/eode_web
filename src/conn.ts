import { Mutex } from "async-mutex";
import { error } from "./ui";

var conn: WebSocket;
const mutex = new Mutex();

export async function connect(): Promise<void> {
  conn = new WebSocket("wss://http.nv7haven.com/eode");
  return new Promise<void>((res) => {
    conn.onopen = async () => {
      let url = JSON.parse(await new Promise<string>((resolve) => {
        conn.onmessage = (event) => {
          resolve(event.data);
        }
      })) as Response;
      conn.onmessage = null;
      if (url.error) {
        error(url.error);
        return;
      }
      let win = window.open(url.data["url"]);

      // Wait for login
      await new Promise<void>((resolve) => {
        conn.onmessage = (_) => {
          resolve();
        }
      })
      conn.onmessage = null;
      win.close();
      res();
    }
  })
}

// Data structures
interface Message {
  method: number;
  params: Record<string, any>;
}

export interface Response {
  error?: string;
  data?: Record<string, any>;
}

export enum Method {
  MethodGuild = 0,
  MethodElem,
  MethodCombo,
  MethodElemInfo,
  MethodInv,
  MethodCategory
}

export async function send(method: Method, params: Record<string, any>): Promise<Response> {
  let msg: Message = {
    method: method,
    params: params
  }
  let out = new Promise<Response>(async (res) => {
    let release = await mutex.acquire();
    conn.onmessage = (e) => {
      let data = JSON.parse(e.data);
      release();
      res(data);
    }
  })
  conn.send(JSON.stringify(msg));
  return out;
}