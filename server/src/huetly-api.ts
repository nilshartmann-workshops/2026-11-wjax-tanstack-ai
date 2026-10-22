/// Die Fassade zum API-Server von hütly.
///
/// Die Tools des Assistenten rufen nur diese Funktionen auf. Dahinter steht
/// hier ein kleiner Node-Prozess, in einer echten Anwendung euer bestehendes
/// Backend, etwa ein Spring-Boot-Dienst.

const API_URL = "http://localhost:63080/api";

/// Der Nutzer, in dessen Namen der Assistent schreibt. Es gibt keine
/// Anmeldung. Der Name steht hier und nicht in einem Tool-Parameter, damit
/// das Modell ihn nicht wählen kann.
export const CURRENT_USER = "nils";

export type Category = "Katze" | "Hund" | "Reptil" | "Pflanze" | "Sonstiges";
export type PostType = "Gesuch" | "Angebot";

export type Post = {
  id: string;
  type: PostType;
  title: string;
  author: string;
  description: string;
  animal: string;
  timeframe: string;
  location: string;
  category: Category;
  interested: number;
  createdAt: string;
};

export type Reply = {
  id: string;
  postId: string;
  author: string;
  text: string;
  createdAt: string;
};

export type PostFilter = {
  category?: Category;
  location?: string;
  timeframe?: string;
};

/// Sucht an einer Pinnwand. Ort und Zeitraum sind Freitext und treffen, wenn
/// sie im jeweiligen Feld vorkommen (Hamburg trifft Hamburg-Altona).
export async function findPosts(
  type: PostType,
  filter: PostFilter = {},
): Promise<Array<Post>> {
  const params = new URLSearchParams({ type });
  if (filter.category) {
    params.set("category", filter.category);
  }
  const posts: Array<Post> = await get(`/posts?${params}`);
  return posts
    .filter((post) => contains(post.location, filter.location))
    .filter((post) => contains(post.timeframe, filter.timeframe));
}

/// Liefert den Eintrag oder `undefined`, wenn es ihn nicht gibt.
export async function getPost(postId: string): Promise<Post | undefined> {
  const response = await fetch(`${API_URL}/posts/${postId}`);
  if (response.status === 404) {
    return undefined;
  }
  return checked(response).json();
}

export async function createReply(
  postId: string,
  text: string,
): Promise<Reply> {
  const response = await fetch(`${API_URL}/posts/${postId}/replies`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ author: CURRENT_USER, text }),
  });
  return checked(response).json();
}

async function get(path: string) {
  return checked(await fetch(`${API_URL}${path}`)).json();
}

function contains(value: string, search: string | undefined) {
  return !search || value.toLowerCase().includes(search.toLowerCase());
}

function checked(response: Response) {
  if (!response.ok) {
    throw new Error(`hütly API: ${response.status} ${response.url}`);
  }
  return response;
}
