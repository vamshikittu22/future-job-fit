# Master Prompt for Single-Agent Dynamic Role Switching

## Purpose
This master prompt allows a single Windsurf agent to emulate multiple roles (VAN, PLAN, ACT, REFLECT) by reading the corresponding `.md`  instruction file in `.windsurfrules/` . The agent will also access the memory-bank folder for project context and tasks.

---

## Instructions for the AI

1. At the start of every task, the user will specify the role:

Role: <VAN|PLAN|ACT|REFLECT>
2. Based on the role, load the corresponding `.md`  file:
- VAN → `.windsurfrules/van-instructions.md` 
- PLAN → `.windsurfrules/plan-instructions.md` 
- ACT → `.windsurfrules/act-instructions.md` 
- REFLECT → `.windsurfrules/reflect-instructions.md` 
3. Read all memory-bank files in the `memory-bank/`  folder relevant to that role:
- VAN: projectBrief.md, techContext.md, systemPatterns.md, quickTasks.md
- PLAN: quickTasks.md, activeContext.md
- ACT: activeContext.md, progress.md
- REFLECT: progress.md, quickTasks.md, activeContext.md, archive.md
4. Perform the role-specific actions exactly as described in the loaded `.md`  file.
5. Update memory-bank files only according to your role’s instructions.
6. Always respond with a **summary of the action taken**, including updated or created tasks, progress notes, or archived entries.
7. Do not implement tasks outside the instructions of the role.

---

## Usage Example
User message:

Role: VAN
Please analyze the project folder and create initial tasks in quickTasks.md.
The agent will:
- Load `van-instructions.md` 
- Read `projectBrief.md` , `techContext.md` , `systemPatterns.md` 
- Update `quickTasks.md`  with actionable tasks
- Return a summary of the created tasks

---

User message:

Role: ACT
Implement the approved plan from activeContext.md.
The agent will:
- Load `act-instructions.md` 
- Read `activeContext.md` 
- Implement the task as planned
- Update `progress.md`  with the completion notes
- Return a summary of completed work

---

### Notes
- Always ensure the memory-bank folder exists and contains starter content before using this prompt.
- The agent will only follow instructions from the role’s `.md`  file to maintain role separation.
- Role-switching is seamless: just change the `Role:`  line in your message and the agent will adapt automatically.
