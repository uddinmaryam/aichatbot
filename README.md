# Mini ChatGPT Clone

A minimal ChatGPT-style chat interface built using **HTML, CSS, and JavaScript**.  
It runs completely in the browser and stores messages in `localStorage`, so your chat history stays even after refresh.

## Features
- Chat UI with user + AI message bubbles
- Fake AI reply system (rule-based for now)
- Typing indicator animation
- Saves chat history locally
- `/clear` command to reset chat

## How to Run
1. Download project
2. Open `index.html` in your browser  
No server or installation required.

## Files
index.html- Structure
style.css - styling and layout
app.js- chat logic + message handling

## How it Works
- Each message is stored in an array
- Array is saved to `localStorage`
- On refresh, chat is reloaded from saved history
- AI responses are generated using simple JavaScript condition checks

## Future Improvements (To Learn More)
- Connect to real OpenAI API for real AI responses
- Add theme toggle (Dark / Light)
- Add edit/delete message options
- Add export/import chat history

## Author
Maryam Uddin

# aichatbot
