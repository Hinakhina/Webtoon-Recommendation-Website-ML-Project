This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Database Setup (XAMPP)
1. Open XAMPP and start **MySQL**
2. Open **phpMyAdmin** (`http://localhost/phpmyadmin`)
3. Create a new database: `store_it`
4. Import the SQL file:
   - Click the `store_it` database
   - Go to `Import` tab
   - Choose `database/webtoon_db.sql` from this repo
   - Click `Go`

## To reset user_id after clearing database:
ALTER TABLE users AUTO_INCREMENT = 1;
ALTER TABLE search_history AUTO_INCREMENT = 1;
ALTER TABLE user_genres AUTO_INCREMENT = 1;


## If pip install lightfm is not working:
Install Microsoft Visual C++
pip install lightfm again in the vscode project terminal (in the ml folder)


## Train Model Code:
https://colab.research.google.com/drive/1UOBSMICdV_H0a1Ntv75CN7MKFsQPJPEM?usp=sharing

# Presentation File:
https://www.canva.com/design/DAGpIPJUyZ0/YlogpwCEXFFR7jrcGCM3aA/view?utm_content=DAGpIPJUyZ0&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h88b3c4ceae
