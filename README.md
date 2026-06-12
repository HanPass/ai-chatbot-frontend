# AI Chatbot Frontend

Frontend Angular du chatbot IA avec conversations persistées côté backend.

## Architecture

- `ChatComponent` affiche la page de chat, les messages, l'état loading et les erreurs.
- `ChatComponent` affiche aussi une sidebar de conversations.
- `ChatService` appelle uniquement le backend Spring Boot.
- Les DTOs frontend sont dans `src/app/models`.

Le frontend n'appelle jamais directement l'API IA.

## Endpoints utilisés

- `POST /api/chat` : envoyer un message.
- `GET /api/conversations` : lister les conversations.
- `GET /api/conversations/{id}/messages` : charger une conversation.
- `DELETE /api/conversations/{id}` : supprimer une conversation.

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
Angular -> Spring Boot -> PostgreSQL -> LLM -> PostgreSQL -> Angular
```

## Points d'extension

- Ajouter le streaming côté UI avec SSE ou WebSocket.
- Ajouter un affichage Markdown pour les réponses techniques.
- Ajouter une configuration d'environnement si l'URL backend change hors proxy local.
