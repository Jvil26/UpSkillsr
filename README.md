# UpSkillsr

**UpSkillsr** is a full-stack skill journaling web app that helps users log, reflect on, and accelerate their learning journey. With AI-generated summaries, AWS-backed authentication and media handling, and a sleek frontend, users can easily track skill development over time.

Check it out: https://www.upskillsr.com/

## 🚀 Features

- ✍️ **Skill Journaling**: Log daily or weekly skill progress across custom categories.
- 🤖 **AI-Powered Summaries**: Automatically generate entry summaries and insights using the Anthropic API.
- 🔐 **Secure Auth**: Login and sign-up powered by AWS Cognito with support for OAuth.
- ☁️ **Media Uploads**: Upload images or files to AWS S3 from your journal.
- 📊 **Progress Insights** (Coming Soon): Visual breakdowns of time spent across different skills.
- 🧱 **Fully Responsive UI**: Built with Next.js + Tailwind for a seamless experience on any device.

## 🛠️ Tech Stack

### Frontend

- **Next.js**, **TypeScript**, **React Query**, **Tailwind CSS**
- Hosted on **AWS Amplify**

### Backend

- **Django**, **Django REST Framework**
- **PostgreSQL** (AWS RDS)
- Deployed on **Docker** containers via **AWS EC2**

### Cloud Services

- **AWS Cognito** – Authentication
- **AWS S3** – Media Storage
- **AWS RDS** – PostgreSQL Database
- **Anthropic API** – AI Summary Generation
