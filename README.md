This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started
# Webtoon Recommendation Website

## 📁 Clone Repository

Clone the repository from GitHub:

```
https://github.com/Hinakhina/Webtoon-Recommendation-Website-ML-Project
```

You may use any preferred method (recommended: [GitHub Desktop](https://desktop.github.com/download/)).

### If Using GitHub Desktop:

1. Click **Code > Local > HTTPS > Open with GitHub Desktop**
2. Clone to an empty folder.

---

## ⚙️ Install Requirements

### 1. Download & Install:

* [Node.js](https://nodejs.org/en/download)
* [XAMPP](https://www.apachefriends.org/)

### 2. Database Setup (XAMPP):

1. Run XAMPP as administrator.
2. Start **Apache** and **MySQL**.
3. Open **phpMyAdmin** (`http://localhost/phpmyadmin`).
4. Create a database named:

```
webtoon_db
```

5. Import SQL file:

   * Click `webtoon_db`
   * Go to `Import` tab
   * Select `database/webtoon_db.sql`
   * Click `Go`

### Optional: Reset Auto Increment

```
ALTER TABLE users AUTO_INCREMENT = 1;
ALTER TABLE search_history AUTO_INCREMENT = 1;
ALTER TABLE user_genres AUTO_INCREMENT = 1;
```

---

## 🛠 Run the Project

1. Open the **main project folder** in Visual Studio Code.
2. Open terminal and run:

```
pip install -r requirements.txt     # (or manually install Python dependencies)
npm install
npm run dev
```

### Troubleshooting:

* **MySQL shutdown unexpectedly**: Try this guide:

  * [https://www.youtube.com/watch?v=B6PVXmj\_QLM](https://www.youtube.com/watch?v=B6PVXmj_QLM)
  * [https://10web.io/blog/mysql-shutdown-unexpectedly-error/](https://10web.io/blog/mysql-shutdown-unexpectedly-error/)

* **LightFM error "Microsoft Visual C++ required**: Try installing Microsoft Visual C++:

  * [https://blog.csdn.net/hjx020/article/details/111472686](https://blog.csdn.net/hjx020/article/details/111472686)
  * [https://www.youtube.com/watch?v=rcI1\_e38BWs](https://www.youtube.com/watch?v=rcI1_e38BWs)

---

## 🌐 Accessing the Website

Open:

```
http://localhost:3000
```

(Use Ctrl+Click in terminal or browser)

---

## 📝 User Flow

1. From **Login Page**, click the `register` link.
2. On the **Register Page**, input:

   * Username
   * Password
   * Confirm Password
3. Proceed to **Questionnaire Page**, select 3 favorite genres.
4. Redirected to **Main Page** with 10 recommendations.

* **Existing users** can log in directly.
* Recommendations change based on search:

  * **< 3 searches**: Content-based
  * **≥ 3 searches**: Hybrid model

---

## ❌ Close the Server

To stop the server in VS Code terminal:

```
Ctrl + C (or spam until it stops)
```

---

## 📊 Additional Resources

* **Train Model Code (Colab):**
  [Open in Google Colab](https://colab.research.google.com/drive/1UOBSMICdV_H0a1Ntv75CN7MKFsQPJPEM?usp=sharing)

* **Presentation File:**
  [View on Canva](https://www.canva.com/design/DAGpIPJUyZ0/YlogpwCEXFFR7jrcGCM3aA/view?utm_content=DAGpIPJUyZ0&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h88b3c4ceae)


## Learn More
You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
