# Factory Droids - Organized Structure

This directory contains all custom droids (AI agents) for the Connect Landing Page API project, organized by domain.

## Directory Structure

```
.factory/droids/
├── backend/          # Backend development agents
├── frontend/         # Frontend development agents  
├── git/              # Git operations agents
├── sdlc/             # SDLC pipeline and quality agents
└── README.md         # This file
```

## Available Droids

### 🔧 Backend Development (`backend/`)
- **backend-developer.md** - Implements Node.js/Express APIs, controllers, routes, schemas

### 🎨 Frontend Development (`frontend/`)
- Currently empty - add frontend-specific droids here
- Examples: react-developer, ui-component-builder, etc.

### 📦 Git Operations (`git/`)
- **git-commit.md** - Stages files and creates meaningful commits
- **git-push.md** - Pushes commits to remote repository

### 🔄 SDLC Pipeline (`sdlc/`)
- **sdlc-pipeline.md** - Orchestrates the full development lifecycle
- **code-reviewer.md** - Reviews code for bugs, security, best practices
- **bug-fixer.md** - Fixes issues identified in code review
- **test-generator.md** - Generates comprehensive test suites

## Using Droids

### Individual Droids
```bash
# Use a specific droid
droid run backend-developer "Create a new user login endpoint"
droid run code-reviewer "Review the auth controller"
droid run git-commit
```

### SDLC Pipeline
```bash
# Run the complete pipeline (dev → review → fix → test)
droid run sdlc-pipeline "Build an API for user notifications"
```

## How Factory Discovers Droids

Factory automatically discovers droids in:
1. **Project droids**: `.factory/droids/` (this directory)
2. **Personal droids**: `~/.factory/droids/`

Droids can be organized in **any folder structure** - Factory scans recursively and finds all `.md` files with proper frontmatter.

## Creating New Droids

1. Create a new `.md` file in the appropriate folder
2. Add frontmatter with `name`, `description`, `model`, and `tools`
3. Write the agent instructions

Example:
```markdown
---
name: api-documenter
description: Generates API documentation from code
model: inherit
tools: Read, Glob, Grep, Create
---

You are an API documentation expert...
```

## Best Practices

- **Organize by domain**: Keep related droids together (backend, frontend, devops, etc.)
- **Use `inherit` model**: Let droids use the parent session's model
- **Minimal tools**: Only include tools the droid actually needs
- **Clear descriptions**: Help users understand when to use each droid
- **Follow patterns**: Look at existing droids for consistent structure

## Adding More Folders

You can create additional folders as needed:
```bash
mkdir devops     # For deployment, Docker, K8s agents
mkdir database   # For migration, schema, query agents  
mkdir testing    # For E2E, load testing, QA agents
mkdir docs       # For documentation generation agents
```

Factory will automatically discover droids in any subdirectory!
