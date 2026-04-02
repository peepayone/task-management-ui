# 任務管理系統（Task Management System）

本專案為一個全端任務管理系統，使用 **React** 搭配 **ASP.NET Core Web API** 開發。

---

## 🚀 功能介紹

### 專案管理
- 建立 / 編輯 / 刪除專案（支援 cascade delete）

### 任務管理
- 建立 / 編輯 / 刪除任務
- 狀態篩選 / 指派人篩選
- 排序功能
- 自動更新

### 留言系統
- 新增留言
- 刪除留言（僅限本人）

### 使用體驗
- 自動選取新資料
- Loading / disabled 防止重複操作
- Overlay 操作介面

---

## 🛠 技術架構

前端：
- React（Hooks）
- Vite
- Bootstrap

後端：
- ASP.NET Core Web API
- Entity Framework Core

資料庫：
- SQL Server

---

## ⚡ 啟動方式

後端：
1. Visual Studio 開啟
2. 設定連線字串
3. 執行

前端：
cd frontend
npm install
npm run dev

---

## 🔐 環境變數

VITE_API_BASE_URL=http://localhost:5000/api

---

## 🧪 Demo 流程

1. 選 project → task 更新
2. 建 task → 自動選取
3. 編輯 task
4. 新增 comment
5. 刪除 comment（本人）
6. filter / sort
7. 刪除 task
8. 建 project → 自動切換

---

## 🎯 設計重點

- RESTful API 設計
- 分層架構（Controller / Service / DTO）
- React 狀態管理
- 一致命名規則
- Overlay 提升 UX
