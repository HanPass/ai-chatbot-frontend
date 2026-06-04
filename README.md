# AI Chatbot Frontend

Frontend Angular du MVP chatbot IA.

## Architecture

- `ChatComponent` affiche la page de chat, les messages, l'état loading et les erreurs.
- `ChatService` appelle uniquement le backend Spring Boot sur `POST /api/chat`.
- Les DTOs frontend sont dans `src/app/models`.

Le frontend n'appelle jamais directement l'API IA.

## Lancer le frontend

```bash
npm install
npm start
```

Le serveur Angular démarre sur `http://localhost:4200`.

Le fichier `proxy.conf.json` redirige `/api` vers le backend :

```json
{
  "/api": {
    "target": "http://localhost:8080",
    "secure": false,
    "changeOrigin": true
  }
}
```

## Flux testé

```text
Angular textarea -> POST /api/chat -> Spring Boot -> LLM -> réponse affichée
```

## Points d'extension

- Ajouter le streaming côté UI avec SSE ou WebSocket.
- Ajouter un historique local ou persistant.
- Ajouter un affichage Markdown pour les réponses techniques.
- Ajouter une configuration d'environnement si l'URL backend change hors proxy local.
