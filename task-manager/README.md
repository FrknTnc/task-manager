# Task Manager Backend
Görev, proje ve kullanıcı yönetimini JWT tabanlı güvenlik ve rol bazlı yetkilendirme ile gerçekleştiren RESTful bir Node.js API uygulamasıdır. WebSocket ile anlık bildirimler ve görev güncellemeleri desteklenmektedir.

## Kullanılan Teknolojiler

| Katman         | Teknoloji                                   |
|----------------|---------------------------------------------|
| Sunucu         | Node.js, Express.js                         |
| Gerçek Zamanlı | Socket.IO                                   |
| Veritabanı     | MongoDB, Mongoose                           |
| Güvenlik       | JWT, bcrypt.js, dotenv                      |
| Middleware     | Custom Error, Token Auth, Role Auth         |
| Test           | Jest / Supertest                            |

## Proje Dizini ve Mimari Yapı

task-manager/
├── app.js # Uygulama giriş noktası
├── .env # Ortam değişkenleri
├── config/
│ └── db.js # Veritabanı bağlantısı
├── controllers/ # HTTP logic (request → response)
│ ├── authController.js
│ ├── projectController.js
│ ├── taskController.js
│ └── userController.js
├── services/ # İş mantığı 
│ ├── authService.js
│ ├── projectService.js
│ ├── taskService.js
│ └── userService.js
├── middlewares/ # JWT doğrulama, rol kontrolü vs.
│ ├── authenticateToken.js
│ ├── authorizeRoles.js
├── models/ # Mongoose şema tanımları
│ ├── User.js
│ ├── Project.js
│ ├── Task.js
│ └── TaskLog.js
├── routes/ # Route tanımlamaları
│ ├── authRoutes.js
│ ├── projectRoutes.js
│ ├── taskRoutes.js
│ └── userRoutes.js
├── utils/
│ └── customError.js # Hata yönetimi sınıfı
└── README.md

## Ekstra Özellikler

- **Rol Bazlı Yetkilendirme:** Admin, Manager, Developer
- **Görev Geçmişi (Loglama):** Görev değişiklikleri `TaskLog` modeliyle saklanır
- **WebSocket Bildirimleri:** Görev oluşturma ve güncellemeleri anlık yayınlanır
- **CustomError:** Daha okunabilir ve kontrol edilebilir hata fırlatma yapısı
- **Socket-ready Backend:** `req.io.emit()` desteğiyle modüler bildirim altyapısı
- **Modüler Servis Katmanı:** Controller → Service → Model akışı ile ayrık yapı
- **Otomatik Testler:** Jest ve Supertest ile hazırlanmış API testi altyapısı mevcuttur.
- **Genişletilebilirlik:** Test, Docker, Swagger gibi entegrasyonlara hazır

## Kurulum

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

