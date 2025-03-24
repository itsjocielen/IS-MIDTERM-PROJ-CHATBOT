<script>
  let messages = [];
  let userMessage = '';
  let isLoading = false;
  let suggestions = ['Give me a number.'];

  async function sendMessage(message = userMessage) {
    if (!message.trim() || isLoading) return;

    messages = [...messages, { text: message, sender: 'user' }];
    userMessage = '';
    isLoading = true;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message + " (Keep it brief, max 2 sentences.)" })
      });

      const { reply } = await res.json();

      messages = [...messages, { text: reply, sender: 'bot' }];
    } catch (error) {
      messages = [...messages, { text: 'Error connecting to AI. Try again later.', sender: 'bot' }];
    } finally {
      isLoading = false;
    }
  }
</script>

<main class="flex flex-col h-screen p-4 bg-purple-100 items-center justify-center">
  <div class="bg-purple-200 p-8 rounded-2xl shadow-lg max-w-lg w-full flex flex-col">
    <h1 class="text-3xl font-bold mb-4 text-center text-purple-700">AI Chatbot</h1>

    <!-- Chat Window -->
    <div class="flex-1 overflow-y-auto space-y-2 mb-4 flex flex-col items-start h-96 p-2 border border-purple-400 rounded-lg bg-purple-50">
      {#each messages as { text, sender }}
        <div class="p-2 rounded-lg max-w-full break-words {sender === 'user' ? 'ml-auto bg-purple-500 text-white' : 'bg-purple-300'}">
          {text}
        </div>
      {/each}

      {#if isLoading}
        <div class="p-2 rounded-lg bg-purple-300 animate-pulse">Typing...</div>
      {/if}
    </div>

    <!-- Quick Suggestions -->
    <div class="flex flex-wrap gap-2 mb-4">
      {#each suggestions as suggestion}
        <button on:click={() => sendMessage(suggestion)} class="p-2 bg-purple-300 rounded-lg hover:bg-purple-400">
          {suggestion}
        </button>
      {/each}
    </div>

    <!-- Input Field -->
    <div class="flex items-center space-x-2">
      <input
        type="text"
        bind:value={userMessage}
        placeholder="Type a message..."
        class="flex-1 p-2 border rounded-lg border-purple-500"
        on:keydown={(e) => e.key === 'Enter' && sendMessage()}
        disabled={isLoading}
      />
      <button on:click={sendMessage} class="p-2 bg-purple-600 text-white rounded-lg" disabled={isLoading}>
        {isLoading ? "Sending..." : "Send"}
      </button>
    </div>
  </div>
</main>
