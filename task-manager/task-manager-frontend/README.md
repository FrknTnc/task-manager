## Task Management Frontend

Bu proje, kullanıcıların proje ve görev yönetimini yapabildiği bir **Görev Yönetimi Uygulaması**nın frontend tarafını temsil eder. React tabanlıdır ve modern UI/UX prensipleriyle geliştirilmiştir.

### Kullanılan Teknolojiler

* **Next.js (App Router)**
* **TypeScript**
* **Tailwind CSS**
* **Redux Toolkit & Redux Persist**
* **Axios**
* **React Toastify**
* **WebSocket (Socket.io-client)**

### Mimari Yapı & Proje Dizini

src/
├── app/                        → Sayfa yönlendirmeleri (login, register, dashboard, projects)
│   ├── (auth)/login            → Giriş sayfası
│   ├── register                → Kayıt sayfası
│   ├── (dashboard)/dashboard   → Kullanıcı dashboard'u
│   └── projects/[id]           → Projeye ait görev detayları
│
├── components/                → Reusable bileşenler (modal, form vs.)
│   ├── CreateProjectModal.tsx
│   └── TaskForm.tsx
│
├── redux/                     → Global state yönetimi
│   ├── slices/authSlice.ts
│   └── store.ts
│
├── types/                     → TypeScript arayüzleri
│   ├── user.ts
│   ├── project.ts
│   └── task.ts
│
├── lib/                       → Yardımcı fonksiyonlar / socket tanımı
│   └── socket.ts
│
├── globals.css               → Global stiller
└── layout.tsx                → Ortak layout, toast-provider vb.

### Ekstra Özellikler

* JWT tabanlı kimlik doğrulama
* Rol bazlı kullanıcı tipi (Admin, Manager, Developer)
* WebSocket ile gerçek zamanlı görev bildirimi
* Görev geçmişi (Task log)
* Redux persist ile oturum bilgisi saklama
* Hatalar için toast mesaj sistemi (`react-toastify`)
* Responsive ve modern kullanıcı arayüzü

## Kurulum

# 1. Repoyu klonla
git clone https://github.com/frkntnc/task-manager-frontend.git
cd task-manager-frontend

# 2. Gerekli bağımlılıkları yükle
npm install

## Başlatma
npm run dev

