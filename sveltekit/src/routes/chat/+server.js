import { CHATBOT_ENDPOINT_URL } from "$env/static/private";

/** @type {import('./$types').RequestHandler} */
export async function GET({ fetch}) {
	const response = await fetch(CHATBOT_ENDPOINT_URL);
    const chatui = response.body;
    //const data = await response.
    console.log('------------------------------------');
    console.log(chatui);
	return new Response(chatui);
}
