# ❤️ Donation & Charity Management Portal

A full-stack web application designed to connect **Donors** with **NGOs**, enabling transparent donation requests, partial contributions, automated expiry handling, pickup scheduling, and real-time dashboards.

This project simulates a real-world charity workflow and demonstrates production-level backend logic, role-based access, and clean UI dashboards.

---

## 📌 Project Overview

The Donation & Charity Management Portal bridges the gap between donors and NGOs by providing a centralized platform to:

- Create and manage donation requests
- Allow partial and multiple donor contributions
- Automatically handle expired donation requests
- Track donation status from request to completion
- Display real-time dashboards and leaderboards

---

## 🎯 Key Objectives

- Ensure **transparent donation tracking**
- Support **partial contributions**
- Automate **donation expiry**
- Provide **role-based dashboards**
- Improve accountability between donors and NGOs

---

## 👥 User Roles

### 🧑‍💼 Donor
- View available donation requests
- Contribute partially or fully
- Schedule pickup time
- Track contribution status
- View personal contribution dashboard
- Appear on leaderboard

### 🏢 NGO
- Create donation requests
- Track donor contributions
- Mark donations as completed after pickup
- View expired, pending, confirmed, and completed donations
- Visual analytics dashboard

### 🛠️ Admin (Optional)
- Manage users and system-level controls

---

## ⚙️ Features Implemented

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access (Donor / NGO / Admin)

### 📦 Donation Workflow
- Donation request creation by NGO
- Partial contribution support
- Auto-confirm when fully contributed
- Pickup scheduling
- NGO marks donation as completed

### ⏰ Automated Expiry Handling
- Cron job checks pickup date & time
- Automatically marks unused donations as **EXPIRED**
- Expired donations are hidden from donor view

### 📊 Dashboards & Charts
- Donor dashboard (Pending vs Completed contributions)
- NGO dashboard (Pending / Confirmed / Completed / Expired)
- Interactive charts using Chart.js

### 🏆 Leaderboard
- Ranks donors based on total contributions
- Encourages participation and engagement

---

## 🧠 Business Logic Highlights

- **Transaction-safe contributions**
- **Row-level locking** to avoid race conditions
- **Server-side expiry enforcement**
- **Real-time UI updates**
- **Consistent status flow**:
