# AI ORCHESTRATOR - SIMPLIFIED MVP IMPLEMENTATION PLAN

## Overview
This document outlines the technical implementation plan for a simplified Minimum Viable Product (MVP) version of "AI Orchestrator," a satirical simulation game where players manage the flow of information between AI systems in a future software development environment. This streamlined plan focuses on core mechanics while removing complexity to increase the likelihood of successful implementation.

## Core Concept
In AI Orchestrator, players act as human middleware, copying the output from one AI agent and pasting it into another according to a prescribed workflow. The game satirizes a potential future where humans serve as the "glue" between specialized AI systems in software development.

## Technical Stack
- **Frontend**: TypeScript with React
- **State Management**: Redux for global state management
- **Styling**: Tailwind CSS for rapid UI development
- **Build System**: Vite for fast development experience
- **Packaging**: Pure web application (browser-based)
- **Asset Management**: Simple file-based assets with optimization pipeline

## Project Structure
```
src/
├── assets/              # Static assets (images, sounds, etc.)
│   └── images/
├── components/          # Reusable React components
│   ├── common/          # Shared UI components
│   ├── agents/          # AI agent interface components
│   ├── workspace/       # Workspace environment components
│   └── feedback/        # Notification and feedback components
├── state/               # Redux store configuration
│   ├── actions/         # Action creators
│   ├── reducers/        # State reducers
│   ├── selectors/       # Memoized selectors
│   └── store.ts         # Store configuration
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
├── hooks/               # Custom React hooks
├── services/            # Game services and APIs
│   ├── project/         # Project generation and management
│   ├── workflow/        # Workflow processing
│   └── content/         # Content generation
├── constants/           # Game constants and configurations
├── App.tsx              # Root application component
└── main.tsx             # Application entry point
```

## Simplifications for MVP
1. **Reduced AI Agents**: Only two AI agents (Product Vision and Code Writer) instead of three
2. **Fixed Layout**: Non-movable panels instead of draggable windows
3. **Linear Workflow**: Simple linear workflow without branching
4. **Binary Success/Failure**: Simple pass/fail evaluation for projects
5. **Minimal Feedback**: Basic toast notifications and project completion dialog
6. **Static Help**: Simple help screens instead of interactive tutorial
7. **Auto-save Only**: Simple auto-save without manual save slots

## Implementation Documents
The implementation plan is split into several documents for clarity:
1. [Workspace and Agents](AI%20Orchestrator%20-%20Workspace%20and%20Agents.md) - Core UI layout and agent interfaces
2. [Copy-Paste and Workflow](AI%20Orchestrator%20-%20Copy-Paste%20and%20Workflow.md) - Core gameplay mechanics
3. [Projects and Feedback](AI%20Orchestrator%20-%20Projects%20and%20Feedback.md) - Project management and user feedback
4. [Content and Implementation](AI%20Orchestrator%20-%20Content%20and%20Implementation.md) - Content generation and implementation plan