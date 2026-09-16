cd "/mnt/data/vyom_audit"
npm install
npm run build

npx pm2 start npm --name "vyom-audit-dev" -- run dev


npm run build
npm install
npm run build

cd /opt/app/vyom_audit && npm run build && npx pm2 start npm --name "vyom-audit-prod" -- run dev

cd /opt/app/vyom_audit && npx prisma migrate deploy && npm run build && npx pm2 start npm --name "vyom-audit-prod" -- run dev
npm run dev
cd /opt/app/vyom_audit && npx prisma migrate deploy && npm run build && npx pm2 start npm --name "vyom-audit-prod" -- run dev



npm install -g pnpm     
pnpm install
npx prisma migrate deploy
npx prisma generate
npx pm2 restart vyom-audit-dev




