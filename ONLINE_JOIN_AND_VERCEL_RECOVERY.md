# Online Queue Joining and Vercel Recovery

## Public links

- QUEUELESS website: https://queueless-lyart-delta.vercel.app
- Join the demo queue: https://queueless-lyart-delta.vercel.app/join/city-care-clinic
- Vercel project dashboard: https://vercel.com/arthurarmelias-projects/queueless
- GitHub source: https://github.com/ARTHURARMELIA/queueless-

## Join the online demo

1. Open the [QUEUELESS website](https://queueless-lyart-delta.vercel.app) on a phone or computer, then select **Join a queue**. You can also open the direct [demo join link](https://queueless-lyart-delta.vercel.app/join/city-care-clinic).
2. Choose a service.
3. Enter a name and phone number, then leave the WhatsApp updates checkbox selected and continue.
4. On the verification screen, select **Click to Auto-fill Code (123456)**, or enter any six digits. The demo does not send a real verification code.
5. Select **Verify & Get Ticket**. The app creates a demo ticket and opens its queue-tracking page.

The app is a public demo. Verification and WhatsApp notifications are simulated; do not enter sensitive personal or real customer information. Queue data is saved in that browser's local storage, not shared through a production database, so different visitors will not see one synchronized queue. Keep the same browser open to view the demo ticket.

## If the online site stops responding

Vercel hosts the production deployment; there is no computer-side Vercel server to start, and it does not depend on `npm run dev` staying open. First check the [Vercel project dashboard](https://vercel.com/arthurarmelias-projects/queueless):

1. Open **Deployments** and check the latest Production deployment's status.
2. If the deployment failed, open its build logs, fix the reported issue, and deploy a corrected build.
3. To retry the current deployed snapshot, choose **Redeploy** for the latest Production deployment and confirm.
4. Select **Visit** or open the public website link above to verify it is back.

Redeploy retries the existing snapshot; it does not include newer GitHub commits. The project dashboard currently shows **Connect Git Repository** as incomplete. To have pushes update the live site automatically, connect `ARTHURARMELIA/queueless-` in the Vercel project's **Settings > Git** and authorize repository access when prompted.

Alternatively, deploy the latest source manually from PowerShell in the project folder. Install or sign in to the Vercel CLI when prompted, link this local folder to the existing `queueless` Vercel project, then deploy to production:

```powershell
npx vercel login
npx vercel link
npx vercel --prod
```

Follow the CLI prompts and select the existing `queueless` project when linking. Do not put Vercel tokens or other secrets in source files or Git.

## Restart the local development server

If you mean the local preview rather than the hosted website, open PowerShell in the cloned project folder and run:

```powershell
npm install
npm run dev
```

Keep the terminal open and visit http://localhost:3000. Press `Ctrl+C` to stop the local server. This affects only your computer, not the public Vercel deployment.