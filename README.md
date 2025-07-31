# Task Manager Projesi 

Kullanıcıların projeler ve görevler oluşturabildiği, rollerle yetkilendirildiği ve gerçek zamanlı bildirimler aldığı tam özellikli bir görev yönetim sistemi.

## Canlı Uygulama

- **Frontend (Next.js + Vercel):** [https://task-manager-three-gules.vercel.app](https://task-manager-three-gules.vercel.app)
- **Backend (Node.js + Express + Render):** [https://task-manager-api.onrender.com](https://task-manager-api.onrender.com)

## Kullanılan Teknolojiler

| Katman         | Teknoloji                                       |
|----------------|-------------------------------------------------|
| Frontend       | Next.js (App Router), TypeScript, Tailwind CSS |
| State          | Redux Toolkit + Redux Persist                   |
| Backend        | Node.js, Express.js                             |
| Gerçek Zamanlı | WebSocket (Socket.IO)                           |
| Veritabanı     | MongoDB + Mongoose                              |
| Güvenlik       | JWT, bcrypt.js                                  |
| Test           | Jest / Supertest                                |

## Mimari Yapı & Proje Dizini

### `task-manager/` (Monorepo)

task-manager/
├── backend/ ← Express + MongoDB API (Render'da)
│ ├── app.js
│ ├── routes/
│ ├── controllers/
│ ├── models/
│ ├── services/
│ ├── middlewares/
│ └── ...
│
└── task-manager-frontend/ ← Next.js UI (Vercel'de)
├── src/
│ ├── app/ ← Sayfalar (login, register, dashboard, projects)
│ ├── redux/ ← Redux store & authSlice
│ ├── components/ ← Task form, modals vb.
│ ├── types/ ← TypeScript arayüzleri
│ ├── lib/ ← Socket tanımı
│ └── ...
├── next.config.ts
└── ...

## Öne Çıkan Özellikler

### Backend Özellikleri
- JWT tabanlı kullanıcı doğrulama
- Rol bazlı yetkilendirme (Admin, Manager, Developer)
- Proje ve görev yönetimi
- Görev geçmişi (log kaydı)
- Gerçek zamanlı görev bildirimi (WebSocket)
- Custom error yapısı ve token middleware’leri
- RESTful API + test altyapısı (Jest & Supertest)

### Frontend Özellikleri
- Next.js (App Router) ile modern sayfa yönetimi
- Redux persist ile oturum saklama
- WebSocket client entegrasyonu (socket.io-client)
- React Toastify ile kullanıcı dostu bildirimler
- Responsive ve sade kullanıcı arayüzü

## Kurulum (Geliştirici Modu)

# 1. Repoyu klonla
git clone https://github.com/frkntnc/task-manager.git
cd task-manager

# 2. Gerekli bağımlılıkları yükle
npm install

# 3. Ortam değişkenlerini ayarla
cp .env.example .env

# .env içeriği örnek:
PORT=5001
MONGO_URI=mongodb://localhost:27017/task-manager-db
JWT_SECRET=supersecretkey

## Başlatma
npm run dev

## Frontend
cd task-manager/task-manager-frontend
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:5001" > .env.local
npm run dev
