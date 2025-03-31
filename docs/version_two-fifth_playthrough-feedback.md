# Version Two Fifth Playthrough Feedback

I'm ready for some dynamic responses!

# Feedback

- immediately the more personal responses are awesome
- bug: we're still doing double messages from the boss
- bug: the messages from the boss include [Your Name] tags in the text of the responses.
  - Lets ask the user for their name when the game starts. Make it like the login screen to their work system. Then the give the boss their name.
  - lets name the boss something. hardcode it for now. i want it to always be the same boss.
- improvement: Have the Product Vision AI include comments about the submitted Project Description
  - it's clear the agent is getting info about the project but not clear he's getting what the user submitted
- improvement: the code writer AI always prefaces it's code with `Here's the BrainF*ck implementation:`, lets stop that.
  - for now lets have the code writer AI only output the code, no commentary
- lets not use brainfuck. lets use Haskell.
  - Have the Code AI be verbose and opaque.
  - Have the code include comments but have the actual implementation be so convoluted the user can never understand it.
  - Generate _real_ Haskell code
- improvement: i don't think the user will ever improve the code to where the verifier will _actually_ pass the impl.
  - let the user "certify" even if the verifier fails the verification
- improvement: update the UI so that the abandoned projects are just under active projects
  - right now they end up at the bottom as more and more projects collect
  - i want the user to see them all the time

# Example message from boss
```
Subject: Data Visualization Dashboard - Immediate Action Required Team [Employee Name], Let's be clear: the Data Visualization Dashboard remains critically behind schedule. Zero projects completed, and an average completion time of zero seconds is frankly unacceptable. Deliverables are expected *immediately*. I expect a detailed update outlining your revised timeline and a demonstrable plan for execution by the close of business today. Don't waste my time. – [Your Name] Senior Director, Strategic Initiatives 
```