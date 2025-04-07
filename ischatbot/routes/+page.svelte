<script>
  // @ts-nocheck
  
  import { writable } from 'svelte/store';
  
  let messages = writable([]);
  let userMessage = writable('');
  let isLoading = writable(false);
  let userName = writable('Joselyn');
  
  /**
   * @param {string} message
   */
  async function sendMessage(message) {
    if (!message || message.trim() === '' || $isLoading) return;
  
    messages.update(msgs => [...msgs, { text: message, sender: 'user' }]);
    userMessage.set('');
    isLoading.set(true);
  
    if (message.toLowerCase().includes("my name is  ")) {
      const extractedName = message.split("my name is ")[1].trim().split(" ")[0];
      userName.set(extractedName);
      messages.update(msgs => [...msgs, { text: `Nice to meet you, ${extractedName}!`, sender: 'bot' }]);
      isLoading.set(false);
      return;
    }
  
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message, user: $userName })
      });
  
      const data = await res.json();
      messages.update(msgs => [...msgs, { text: data.reply || 'No response from AI.', sender: 'bot' }]);
    } catch (error) {
      messages.update(msgs => [...msgs, { text: 'Error connecting to AI. Try again later.', sender: 'bot' }]);
    } finally {
      isLoading.set(false);
    }
  }
</script>

<main class="flex flex-col h-screen p-4 bg-black items-center justify-center">
  <div class="bg-pink-500 p-8 rounded-2xl shadow-lg max-w-lg w-full flex flex-col">
    <h1 class="text-3xl font-bold mb-4 text-center text-white">AI Joselyn Bot</h1>

    {#if $userName}
      <p class="text-center text-gray-100 mb-2">Hello, {$userName}!</p>
    {/if}

    <div class="flex-1 overflow-y-auto space-y-2 mb-4 flex flex-col items-start h-96 p-2 border border-gray-300 rounded-lg bg-pink-200">
      {#each $messages as { text, sender } (text)}
        <div class="p-2 rounded-lg max-w-full break-words {sender === 'user' ? 'ml-auto bg-pink-700 text-white' : 'bg-black text-white'}">
          {text}
        </div>
      {/each}

      {#if $isLoading}
        <div class="p-2 rounded-lg bg-black text-white animate-pulse">Typing...</div>
      {/if}
    </div>

    <div class="flex items-center space-x-2">
      <input
        type="text"
        bind:value={$userMessage}
        placeholder="Type a message..."
        class="flex-1 p-2 border rounded-lg text-black"
        on:keydown={(e) => e.key === 'Enter' && sendMessage($userMessage)}
        disabled={$isLoading}
      />
      <button on:click={() => sendMessage($userMessage)} class="p-2 bg-pink-600 text-white rounded-lg" disabled={$isLoading}>
        {$isLoading ? "Sending..." : "Send"}
      </button>
    </div>
  </div>
</main>
