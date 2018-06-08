# Cresta Test

---

## Front End Take-Home Project Requirements:

### PROJECT DESCRIPTION

Real-time messaging pushes the limits of human cognition from the perspective of a human agent. Agents juggle 3+ simultaneous customer interactions and need to focus in on each conversation. Building the right user interfaces and machine learning algorithms can help push the limits of human cognition.

Your take-home project is to build a messaging demo that minimizes the cognitive load required to handle two simultaneous (text\chat) conversations simultaneously. Expect each conversation to be an involved conversation where an agent is conducting a nuanced conversation with a customer. What are the hardest parts of keeping track of multiple simultaneous conversations?

You can use the base chat project from socket.io https://github.com/socketio/socket.io/tree/master/examples/chat

Design the front end application based on principles that will minimize operator cognitive load and build a demo of this design in React. A few questions to get you started:

* How should conversation history be displayed to make it easy to context switch between conversations?
* How should agents jump between typing responses for different conversations?
* What clues can you give the agent to remind them of the context of each conversation?
* How can you draw an agent's attention if a chat is left unattended for too long? 
* How can you warn an agent before someone leaves the conversation?

Imagine being in the seat of a chat agent and imagine what the major bottlenecks in chat throughput.

Here is what we will be looking for when grading your assignment:

* What is the structure and code quality of your application (e.g. React states structure)
* What is your thought process of thinking through the cognitive bottlenecks from a human agent perspective?
* How re-usable is your React code and modules?
* (To a lesser extent) What are the visual design aspects of your demo?

You can take up to a week to get this back to us and feel free to use that entire time if needed.

## My Solution:

---

The hardest part is switching.

Have a queue of people to reply to, automatically switch when a message is sent, or when a person confirms being done.

Make each message it’s own task to take care of upon which you can switch 

Automatic task creation based on messages received or sent

Suggest relevant information auto reply suggestions and lookup.

Show the queue, last message sent and received times, along with how critical it is based on message and time.

Gamification of chat.

Use some sort of 

What clues can you give the agent to remind them of the context of each conversation? 
How can you draw an agent's attention if a chat is left unattended for too long? 
How can you warn an agent before someone leaves the conversation?``