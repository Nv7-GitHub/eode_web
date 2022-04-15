import { Mutex } from "async-mutex";

// Auth
export async function login(): Promise<string> {
  // Check if cached
  if (window.localStorage.getItem("id")) {
    return window.localStorage.getItem("id");
  }

  // Check if already there
  if (window.location.hash) {
    const parsedHash = new URLSearchParams(window.location.hash.slice(1, window.location.hash.length));
    let tok = parsedHash.get("access_token");
    let typ = parsedHash.get("token_type");
    let res = await fetch('https://discord.com/api/users/@me', {
			headers: {
				authorization: `${typ} ${tok}`,
			},
		});
    let val = await res.json();
    let id = val["id"];
    window.localStorage.setItem("id", id);
    window.location.hash = "";
    return val["id"];
  }

  // Get url
  let url = new URL("https://discord.com/api/oauth2/authorize");
  // Set params
  url.searchParams.set("client_id", "964274065508556800");
  url.searchParams.set("response_type", "token");
  url.searchParams.set("client_secret", "dRDvGpuHZAgH6u-F5_UHakTxZgLewhe4");
  url.searchParams.set("scope", "identify");
  url.searchParams.set("redirect_uri", "http://localhost:8000/"); // TODO: Make real url based on prod
  window.location.assign(url.toString());
}

var conn: WebSocket;
const mutex = new Mutex();

export async function connect(id: string): Promise<void> {
  conn = new WebSocket("wss://http.nv7haven.com/eode");
  return new Promise<void>((res) => {
    conn.onopen = () => {
      conn.send(id);
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