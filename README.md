# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/af7b975b-72a4-4d49-a1bf-35f584ad00e0

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/af7b975b-72a4-4d49-a1bf-35f584ad00e0) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/af7b975b-72a4-4d49-a1bf-35f584ad00e0) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## AI Resume Enhancement

This project features a production-ready AI Resume Enhancement system that connects to real AI models (OpenAI, Gemini, and Groq).

### Setup API Keys

To use the AI features, you need to set up environment variables in a `.env` file at the root of your project:

1. Create a `.env` file (you can use `.env.example` as a template).
2. Add your API keys:
   - `VITE_OPENAI_API_KEY`: Your OpenAI API key (for GPT-4o-mini).
   - `VITE_GEMINI_API_KEY`: Your Google Gemini API key (for Gemini 1.5 Flash).
   - `VITE_GROQ_API_KEY`: Your Groq API key (for free Llama models).
3. Choose your provider by setting `VITE_AI_PROVIDER` to `openai`, `gemini`, or `groq`.

### Features
- **Multi-Variant Generation**: Every enhancement request returns 3-5 high-quality variations based on your chosen strategy.
- **Quick Presets**: Choose from ATS Optimized, Concise Professional, or Maximum Impact.
- **Custom Strategy**: Fine-tune the tone (Formal, Modern, Concise, etc.) and highlight areas (Technical, Leadership, etc.).
- **Token Efficiency**: The system uses highly optimized prompts and cost-effective models like `gpt-4o-mini` and `gemini-1.5-flash` to maximize performance while minimizing costs.
