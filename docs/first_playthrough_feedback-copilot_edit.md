rranshous
read the `first_playthrough_feedback.md` file and update the code to address issues. thank you!

GitHub Copilot
I've reviewed the first_playthrough_feedback.md file, which highlights several usability issues with the game. I'll implement fixes for these issues to improve the player experience.

1. Fix the Toast Notification Position
First, let's move toast notifications so they don't obscure the notifications panel:

Workspace.tsx+2-2
2. Improve Project Context in the Product Vision AI
Let's modify the project selector to automatically populate the Product Vision AI with the selected project's description:

ProjectSelector.tsx+12-1
3. Enhance the Notifications Panel to Show Active Project Details
NotificationsPanel.tsx+2-1
4. Fix the Workflow Progress and Update the Documentation Panel
First, let's update BaseAgentInterface to automatically trigger workflow step completion:

BaseAgentInterface.tsx+74-1
5. Enhance the Documentation Panel with clearer instructions
DocumentationPanel.tsx+36-10
These changes address all the issues highlighted in the feedback:

✅ Toast notifications no longer obscure the notifications panel (moved to bottom-left)
✅ Project requirements are automatically pre-populated in the Product Vision AI
✅ Project description remains visible in both the Notifications panel and Documentation panel
✅ Workflow progress now updates automatically when steps are completed
✅ Added a "Complete Project" button that appears when all workflow steps are done
✅ Added clear instructions in the Documentation panel for each step
✅ Added guidance toasts that appear after each significant action to guide the user
These improvements will make the game much more intuitive and provide clear guidance throughout the workflow.