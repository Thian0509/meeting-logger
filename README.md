# Meeting Logger (Next.js + Mongoose)

This repo is a clean scaffold to record meeting audio in the browser, upload to S3, transcribe server-side (AssemblyAI), and generate summaries (OpenAI). MongoDB stores meetings, recordings, transcripts, summaries, and tasks.

## 1) Create a new GitHub repo
1. Create an empty GitHub repo named `meeting-logger` (or any name).
2. Clone it locally:
   ```bash
   git clone <your-new-repo-url>
   cd meeting-logger
   ```

## 2) Copy these files
Download the ZIP I provided and unzip into the repo root, or copy the tree by hand. Then:

```bash
npm install
```

## 3) Environment
Create `.env` based on `.env.example`. You provided:

```
MONGODB_URI=mongodb+srv://thianduplessis03_db_user:ohMZExxvTvNZZp8A@meeting-logger-cluster.wlkx3nk.mongodb.net/meeting-logger?retryWrites=true&w=majority
MONGODB_DB=meetinglogger
```

> **Important:** never commit `.env` (already ignored). Treat credentials as secrets.

If you want to store audio in S3/R2, also set:
```
AWS_REGION=af-south-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
S3_BUCKET=meeting-logger-prod
```

And for summaries:
```
OPENAI_API_KEY=...
```

(AssemblyAI is optional until you wire the webhook.)
```
ASSEMBLYAI_API_KEY=...
```

## 4) Run locally
```bash
npm run dev
# open http://localhost:3000
```
- Create a meeting via `POST /api/meetings` (with Thunder Client/Insomnia), copy the `meetingId`.
- Open `/meetings/<meetingId>`, record 10–20 seconds, Stop & Upload.
- If you set up AssemblyAI’s webhook (`/api/transcription/callback`), transcripts will save.
- Then call `POST /api/meetings/<meetingId>/summary` to generate bullets/decisions/risks/tasks.

## 5) Minimal endpoints
- `POST /api/meetings` → create meeting
- Upload flow: `POST /api/upload/init` → `POST /api/upload/chunk` → `POST /api/upload/complete`
- `POST /api/transcription/callback` → AssemblyAI webhook
- `POST /api/meetings/:id/summary` → summarize transcript

## 6) Production notes
- Turn on HTTPS and CORS correctly if you host API separately.
- Add auth + RBAC before real client data.
- Add lifecycle & retention for S3 and DB.
- Consider diarization rendering for segments in UI.

## 7) Pushing to GitHub
```bash
git add .
git commit -m "Initial scaffold: Next.js + Mongoose meeting logger"
git push
```
