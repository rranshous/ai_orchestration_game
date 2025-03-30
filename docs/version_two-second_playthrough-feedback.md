# Context

Second playthrough, hopefully the missing features are there

# Feedback

## Not working
- When I hit "Generate Specification" I see an error
  - See the "Invalid hook call." message in console output section
- Boss messages coincide with an error (looks like it cant' fetch from the model)
  - See the 404 in the console output section
  - How is fetching from 

## Working
- timers for projects are working well, good job!
- new project assignment is working!

## Upgrades
- Right now the messages from the boss time out quickly, before I can read them. Keep the latest message from the boss in the Notifications panel in the same way the active project message is. Make the notification from the boss yellow to highlight it.

## Research
- I have confirmed that the local ollama service is configured to allow CORS


# Console Output (from the browser)

```
[vite] connecting... client:229:9
[vite] connected. client:325:21
Download the React DevTools for a better development experience: https://reactjs.org/link/react-devtools chunk-VRHMX22Y.js:21580:25
GET
http://localhost:5173/favicon.svg
[HTTP/1.1 404 Not Found 0ms]

Error processing agent: Error: Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.
    React 2
    Redux 2
    handleProcess BaseAgentInterface.tsx:62
    handleProcessEvent BaseAgentInterface.tsx:32
    onClick ProductVisionInterface.tsx:47
    React 23
    <anonymous> main.tsx:8
BaseAgentInterface.tsx:75:15
XHRPOST
http://localhost:11434/api/generate
[HTTP/1.1 404 Not Found 115ms]

XHRPOST
http://localhost:11434/api/generate
[HTTP/1.1 404 Not Found 112ms]

Boss message generation error: Error: API error: 404
    callModel modelService.ts:108
    generateBossMessage modelService.ts:72
    sendBossMessage bossReducer.ts:80
    middleware2 Redux
    createImmutableStateInvariantMiddleware Immutable
    Redux 2
    startBossMessages bossReducer.ts:37
    middleware2 Redux
    createImmutableStateInvariantMiddleware Immutable
    createActionCreatorInvariantMiddleware Redux
    App App.tsx:28
    React 8
    workLoop scheduler.development.js:266
    flushWork scheduler.development.js:239
    performWorkUntilDeadline scheduler.development.js:533
    js scheduler.development.js:571
    js scheduler.development.js:633
    __require chunk-UXIASGQL.js:8
    js index.js:6
    __require chunk-UXIASGQL.js:8
    React 2
    __require chunk-UXIASGQL.js:8
    js React
    __require chunk-UXIASGQL.js:8
    js React
    __require chunk-UXIASGQL.js:8
    <anonymous> react-dom_client.js:38
modelService.ts:52:15
Boss message generation error: Error: API error: 404
    callModel modelService.ts:108
    generateBossMessage modelService.ts:72
    sendBossMessage bossReducer.ts:80
    middleware2 Redux
    createImmutableStateInvariantMiddleware Immutable
    Redux 2
    startBossMessages bossReducer.ts:37
    middleware2 Redux
    createImmutableStateInvariantMiddleware Immutable
    createActionCreatorInvariantMiddleware Redux
    App App.tsx:28
    React 7
    workLoop scheduler.development.js:266
    flushWork scheduler.development.js:239
    performWorkUntilDeadline scheduler.development.js:533
    js scheduler.development.js:571
    js scheduler.development.js:633
    __require chunk-UXIASGQL.js:8
    js index.js:6
    __require chunk-UXIASGQL.js:8
    React 2
    __require chunk-UXIASGQL.js:8
    js React
    __require chunk-UXIASGQL.js:8
    js React
    __require chunk-UXIASGQL.js:8
    <anonymous> react-dom_client.js:38
modelService.ts:52:15

  ```