# Suhas Bhairav Cohere Chat

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=111)
![OpenRouter](https://img.shields.io/badge/OpenRouter-Cohere%20North%20Mini%20Code-172554)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)
![Made by Suhas Bhairav](https://img.shields.io/badge/Made%20by-Suhas%20Bhairav-0f172a)

A polished, mobile responsive, fully streaming chatbot powered by OpenRouter and `cohere/north-mini-code:free`. The interface is designed like a modern chat app with fixed viewport layout, internal message scrolling, streaming assistant responses, prompt suggestions, and clean mobile behavior.

Created by [Suhas Bhairav](https://suhasbhairav.com).

## Features

- Fully streaming OpenRouter responses
- Uses `cohere/north-mini-code:free`
- ChatGPT-style responsive chat UI
- Scrollable chat area that keeps the card fixed in place
- Stop button for active streams
- Auto-growing input box
- Mobile-first layout with polished desktop spacing
- Server-side API route at `app/api/chat/route.js`
- Logs reasoning token usage when OpenRouter includes it in the final stream chunk

## Tech Stack

- [Next.js](https://nextjs.org)
- [React](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [OpenRouter SDK](https://www.npmjs.com/package/@openrouter/sdk)

## Getting Started

Install dependencies:

```bash
npm install
```

Create an environment file:

```bash
cp .env.example .env.local
```

Add your OpenRouter key:

```bash
OPENROUTER_API_KEY=your_openrouter_api_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## OpenRouter Model

This template calls:

```txt
cohere/north-mini-code:free
```

The API route streams plain text back to the browser, making it simple for the client to append chunks as they arrive.

## API Route

The chat endpoint lives at:

```txt
app/api/chat/route.js
```

It accepts:

```json
{
  "messages": [
    {
      "role": "user",
      "content": "How many r's are in the word strawberry?"
    }
  ]
}
```

The OpenRouter SDK request uses the current SDK shape:

```js
await openRouter.chat.send({
  chatRequest: {
    model: "cohere/north-mini-code:free",
    messages,
    stream: true,
  },
});
```

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Author

[Suhas Bhairav](https://suhasbhairav.com)

## License

MIT License. See [LICENSE](./LICENSE).
