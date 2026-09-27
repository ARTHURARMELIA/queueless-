# QUEUELESS Links and Local Setup

## Project links

- GitHub repository: https://github.com/ARTHURARMELIA/queueless-
- Production website: https://queueless-lyart-delta.vercel.app
- Vercel project dashboard: https://vercel.com/arthurarmelias-projects/queueless
- Local development app: http://localhost:3000 (available while the dev server is running)

The production URL is public. The localhost address works only on the computer running the dev server.
The Vercel project is not connected to GitHub for automatic deployments yet, so pushing to `main` will not update the live site automatically.

## App pages

Start the dev server, then open any of these local addresses. For production, replace `http://localhost:3000` with `https://queueless-lyart-delta.vercel.app`:

- Home: http://localhost:3000/
- How it works: http://localhost:3000/how-it-works
- Business information: http://localhost:3000/business
- Business login: http://localhost:3000/business/login
- Business dashboard: http://localhost:3000/business/dashboard
- Analytics: http://localhost:3000/business/analytics
- Queue management: http://localhost:3000/business/queue
- QR codes: http://localhost:3000/business/qr
- Services: http://localhost:3000/business/services
- Staff: http://localhost:3000/business/staff
- Settings: http://localhost:3000/business/settings
- Customer join page: `http://localhost:3000/join/{businessSlug}`
- Customer queue status: `http://localhost:3000/queue/{secureQueueToken}`

Replace `{businessSlug}` or `{secureQueueToken}` with a value provided by the app.

## Run on Windows

Install Git and Node.js first. Node.js 20 LTS is recommended; Next.js 14 requires Node.js 18.17 or newer. npm is included with Node.js.

Open PowerShell and run:

```powershell
git clone https://github.com/ARTHURARMELIA/queueless-.git
cd queueless-
npm install
npm run dev
```

Leave that terminal open and visit http://localhost:3000. To stop the server, press `Ctrl+C` in the terminal. If port 3000 is already in use, Next.js will print the alternate local URL it selected.

To run it later, open PowerShell in the cloned project folder and run:

```powershell
npm run dev
```

In VS Code, the same server can be started with **Terminal > Run Task > Start Next.js Dev Server**.

## GitHub access

The repository is public, so cloning it does not require sign-in. To push changes, your GitHub account must have write access and Git must be authenticated. In a cloned project, `origin` is already configured:

```powershell
git pull origin main
git add .
git commit -m "Describe your change"
git push origin main
```

## Optional integrations

The demo runs without external credentials. For Supabase, WhatsApp, or another OTP provider, copy the example environment file and replace its placeholders with your own values:

```powershell
Copy-Item .env.example .env.local
```

Keep `.env.local` private and do not commit real credentials.