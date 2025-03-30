# AI Orchestrator

AI Orchestrator is a satirical simulation game where players manage the flow of information between AI systems in a future software development environment. Players act as human middleware, copying and pasting outputs between specialized AI agents to complete software development projects.

## 🎮 Overview

In this game, you'll:
- Manage projects through a simplified workflow
- Interact with specialized AI agents (Product Vision AI and Code Writer AI)
- Transfer information between agents using a copy-paste system
- Complete development projects to progress

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- npm or yarn

### Installation

1. Clone this repository
   ```bash
   git clone https://github.com/yourusername/ai_orchestration_game.git
   cd ai_orchestration_game
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## 🎯 How to Play

1. **Start a project**: Choose a project from the project selector panel
2. **Define requirements**: Use the Product Vision AI to generate specifications
3. **Copy specifications**: Use the Copy button to copy the output
4. **Implement code**: Paste the specifications into the Code Writer AI and generate code
5. **Complete project**: Follow the workflow steps to finish the project

## 🎛️ Game Interface

- **AI Agent Panels**: Interact with specialized AI agents
  - **Product Vision AI**: Generates specifications from requirements
  - **Code Writer AI**: Generates code from specifications
- **Documentation Panel**: Shows current workflow step and instructions
- **Project Selection Panel**: Browse and select available projects
- **Notifications Panel**: Displays game notifications and events

## 🔄 Core Mechanics

### Copy-Paste System
Transfer information between AI agents using the copy and paste buttons. The system enforces workflow rules, only allowing valid transfers between compatible agents.

### Workflow System
Each project follows a linear workflow:
1. Requirements Specification (Product Vision AI)
2. Code Implementation (Code Writer AI)

## 👨‍💻 Technical Details

This project is built using:
- React with TypeScript
- Redux Toolkit for state management
- Tailwind CSS for styling
- Vite for build tooling

## 🛠️ Future Enhancements

- Additional AI agents with specialized roles
- More complex workflow paths
- User customization of workspace
- Performance metrics and scoring system
- Save/load game functionality

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- This game is a satirical look at the potential future of AI in software development
- Inspired by discussions about the evolving role of humans in AI-augmented workflows