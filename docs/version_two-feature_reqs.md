# Context

## Game

This work is for a game. It is a satirical simulation of what being a "software developer" may be like in the future.

## MVP

The MVP works great, but is flat. The mechanics are working but the content is static and the narrative missing.

## Version two

The next version will be version two

### Goals

- make content more dynamic
  - generate the AI responses from models.

- add interaction with boss
  - update "notifications" to be more like "messages"
  - have periodic messages from the boss be received.
  - boss will critisize or praise the recent work.
  - Messages from the boss are generated by a model
    - boss messages include references to recent work
    - must give the model the recent work as context with the prompt

- make more work just show up
  - instead of the user pulling more work lets have more work just show up
  - the depth of the queue growing will motivate our workers!

- make completed projects seem less important
  - i like that we keep a list of completed work
  - have it be lesser than the available projects
  - we want the employee to know that the company knows he finished those projects but communicate that they don't really care

- make work harder
  - make the responses the user must copy and paste longer
  - add additional steps to the workflow where a Verification AI which must check the code before the user can certify it
  - make the work more opaque by having the code be generated in an esoteric programming language
  - make the product vision AI agent more ornery, often rejecting requests for lacking "vision" or specificity.

- more emphasis on the certification step
  - make the copy / directions / labeling around certifying the work put a lot of emphasis on the outcome being the users responsibility
  - we want the user to feel compelled by the timer (and piling up work) to press the certify button but we want them to be hesitant because the have no true insight in to the project goals and the implementation details.

- make sure the user completes their work
  - right now they can just click a new project and abandon the current one
  - if the user picks up a new project I want the current one to go back to the projects list but when some sort of highlighting (red?) which shows it is incomplete.
  - do not let the user abandon a project

- Add project times for psychological pressure
  - keep a timer of how long the user has been working on a project
  - show the timer to the user
  - there is no max time limit
  - do not pause the timer if the user swaps to a different project

## Model interactions

- Use local models running on ollama
- give the models enough context on the current project so that they can make participate in the simulation meaningfully
- give the boss interactions enough context that they can realistically comment on the history of the players work as well as the current projects status
- use the models as agents

