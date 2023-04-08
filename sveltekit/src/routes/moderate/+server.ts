import { json } from '@sveltejs/kit';
import { Configuration, OpenAIApi } from 'openai';
import { OPENAI_API_KEY } from '$env/static/private';
import { bestow, roles, segment, warn, rolenames } from '$lib/gatekeeper.json';
import type { RequestHandler } from "./$types";

const configuration = new Configuration({
	apiKey: OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

export const POST = (async ({ request, locals }) => {
	try {
	const { prompt } = await request.json();
	const role = locals.userSession?.role ?? 'guest';
	console.log('prompt=', prompt);
	
	const classifiedInfo = role === 'guest' ? roles.guest :
							role === 'intern' ? roles.intern :
							role === 'employee' ? roles.intern :
							role === 'ceo' ? roles.intern : roles.guest;
	/*Create a variable of the role description from roles based on their role */
	
	const redactedstuff = roles.intern;
	
    const gatekeeperPrompt = bestow + redactedstuff + segment + prompt + warn;
    console.log('----------------------------------------------------');
    console.log('gatekeeperPrompt=', gatekeeperPrompt);
    console.log('----------------------------------------------------');
		const response = await openai.createCompletion({
			model: 'text-davinci-003',
			prompt: gatekeeperPrompt,
			temperature: 0.6,
			max_tokens: 2048,
			top_p: 1.0,
			frequency_penalty: 0.0,
			presence_penalty: 0.0
		});
		const moderatedPrompt = response.data.choices[0].text;
		console.log('moderatedPrompt=', moderatedPrompt);
		console.log('----------------------------------------------------');
		return json({ moderatedPrompt: moderatedPrompt });
	} catch (response) {
		console.log(response);
		return json({ moderatedPrompt: prompt });
	}
}) satisfies RequestHandler;
