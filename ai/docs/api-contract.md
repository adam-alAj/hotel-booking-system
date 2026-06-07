# API Contract - EliteReserve AI Subsystem

## AI Chat Endpoint
**POST** `/api/ai/chat`

### Request Header
- `Authorization`: `Bearer <JWT_TOKEN>` (Include main backend token)

### Request Body
```json
{
  "message": "List hotels in Bethlehem",
  "sessionId": "abc-123"
}
```

### Response Body
```json
{
  "response": "I found 2 hotels in Bethlehem: ...",
  "sources": ["EliteReserve Catalog", "Policies Doc"],
  "isActionRequired": false,
  "actionType": null
}
```

## Health Check
**GET** `/api/ai/health`
- Returns: `200 OK` ("AI Assistant is healthy")

## Feedback
**POST** `/api/ai/feedback`
```json
{
  "messageId": "msg-001",
  "rating": 5,
  "comment": "Very helpful!"
}
```
