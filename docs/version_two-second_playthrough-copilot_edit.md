rranshous
Please read the version_two-second_playthrough-feedback.md doc and implement the required changes. thank you!

GitHub Copilot
Based on the feedback in version_two-second_playthrough-feedback.md, I'll implement the needed fixes:

1. First, fix the "Invalid hook call" error in BaseAgentInterface.tsx
BaseAgentInterface.tsx+4-10
2. Fix the 404 error when hitting the Ollama API by updating the modelService.ts
modelService.ts+25-7
3. Implement persistent boss messages in the NotificationsPanel
First, let's update the bossReducer to store the latest message:

bossReducer.ts+18-3
4. Update Toast component to support custom duration:
Toast.tsx+5-3
5. Update NotificationsPanel to display the persistent boss message with yellow highlight:
NotificationsPanel.tsx+25-1
6. Update the Notification type to support custom duration:
notifications.ts+1-0
7. Update the notification reducer to handle the duration parameter:
notificationReducer.ts+6-1
These changes will fix the invalid hook call error, handle the Ollama API 404 issue, make boss messages last longer in toast notifications, and keep the latest boss message persistently visible in the Notifications panel with a yellow highlight.

rranshous
there are build errors:

GitHub Copilot
Let's fix the missing import in the NotificationsPanel.tsx file:

NotificationsPanel.tsx+1-0
This simple fix adds the missing import for the BossMessageType enum from the modelService file, which will resolve the build error.