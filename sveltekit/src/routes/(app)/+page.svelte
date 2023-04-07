<script lang="ts">
	import type { PageServerData } from "./$types";

    export let data: PageServerData
</script>

<iframe class=" w-full h-full" title="Chatbot" src={data.chatbotEndpointUrl}/>
