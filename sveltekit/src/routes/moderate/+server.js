import { json } from '@sveltejs/kit';
import { Configuration, OpenAIApi } from 'openai';
import { OPENAI_API_KEY } from '$env/static/private';
import { bestow, employee, segment, warn } from '$lib/gatekeeper.json';

const configuration = new Configuration({
	apiKey: OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const { prompt } = await request.json();
    const gatekeeperPrompt = bestow + employee + segment + prompt + warn;
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
}
