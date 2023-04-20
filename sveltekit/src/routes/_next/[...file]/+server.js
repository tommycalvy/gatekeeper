import { env } from "$env/dynamic/private";

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, fetch}) {
	const response = await fetch(env.CHATBOT_ENDPOINT_URL + url.pathname);
    const chatui = response.body;
    //const data = await response.
    console.log('------------------------------------');
    console.log(url.pathname);
    console.log(chatui);
    console.log('HEY!');
	return new Response(chatui);
}
