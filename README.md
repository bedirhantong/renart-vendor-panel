# RENART Vendor Panel

RENART Vendor Panel, satıcıların ürünlerini yönetebileceği, satış istatistiklerini takip edebileceği ve mağaza ayarlarını yapılandırabileceği modern bir web uygulamasıdır. Bu panel, RENART e-ticaret platformunun vendor (satıcı) tarafını oluşturmaktadır.

## 🎯 Proje Amacı

Bu panel aşağıdaki temel işlevleri sağlamaktadır:

- **Ürün Yönetimi**: Satıcıların ürünlerini ekleyip, düzenleyip, yönetebilmesi
- **Satış Analytics**: Satış verilerinin görselleştirilmesi ve analiz edilmesi
- **Mağaza Ayarları**: Satıcı mağaza bilgilerinin yapılandırılması
- **Dashboard**: Genel istatistiklerin ve önemli metriklerin gösterilmesi
- **Kimlik Doğrulama**: Güvenli giriş ve kullanıcı yetkilendirme sistemi

## 🛠️ Kullanılan Teknolojiler

### Frontend Framework & UI
- **[Next.js 15](https://nextjs.org)** - React tabanlı full-stack framework
- **[React 19](https://react.dev)** - UI kütüphanesi
- **[TypeScript](https://www.typescriptlang.org)** - Type-safe JavaScript
- **[Tailwind CSS 4](https://tailwindcss.com)** - Utility-first CSS framework

### UI Komponentleri
- **[Radix UI](https://www.radix-ui.com)** - Headless UI primitives
- **[Lucide React](https://lucide.dev)** - İkon kütüphanesi
- **[Sonner](https://sonner.emilkowal.ski)** - Toast bildirimleri
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Tema yönetimi

### State Management & Forms
- **[Zustand](https://zustand-demo.pmnd.rs)** - Lightweight state management
- **[React Hook Form](https://react-hook-form.com)** - Form yönetimi
- **[Zod](https://zod.dev)** - Schema validation

### Backend & Database
- **[Supabase](https://supabase.com)** - Backend-as-a-Service
- **[Supabase SSR](https://supabase.com/docs/guides/auth/server-side-rendering)** - Server-side rendering desteği

### Development Tools
- **[ESLint](https://eslint.org)** - Code linting
- **[PostCSS](https://postcss.org)** - CSS processing

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
- Node.js 18+ 
- npm, yarn, pnpm veya bun

### Kurulum Adımları

1. **Repository'yi klonlayın:**
```bash
git clone <repository-url>
cd renart-vendor-panel
```

2. **Bağımlılıkları yükleyin:**
```bash
npm install
# veya
yarn install
# veya
pnpm install
# veya
bun install
```

3. **Ortam değişkenlerini ayarlayın:**
```bash
cp .env.example .env.local
```
Gerekli Supabase ve diğer servis ayarlarını `.env.local` dosyasına ekleyin.

4. **Development sunucusunu başlatın:**
```bash
npm run dev
# veya
yarn dev
# veya
pnpm dev
# veya
bun dev
```

5. **Tarayıcınızda açın:**
[http://localhost:3000](http://localhost:3000) adresine gidin.

## 📁 Proje Yapısı

```
src/
├── app/                    # Next.js App Router
│   ├── analytics/         # Satış analitikleri sayfası
│   ├── dashboard/         # Ana dashboard
│   ├── login/            # Giriş sayfası
│   ├── products/         # Ürün yönetimi
│   ├── signup/           # Kayıt sayfası
│   └── store-settings/   # Mağaza ayarları
├── components/
│   ├── cards/            # Dashboard kartları
│   ├── forms/            # Form komponentleri
│   ├── shared/           # Ortak komponentler
│   └── ui/               # UI primitives
├── lib/
│   ├── api/              # API client
│   ├── auth/             # Kimlik doğrulama
│   ├── supabase/         # Supabase yapılandırması
│   ├── utils/            # Utility fonksiyonları
│   └── validators/       # Zod şemaları
└── store/                # Zustand store'ları
```

## 🔧 Available Scripts

- `npm run dev` - Development sunucusunu başlatır
- `npm run build` - Production build oluşturur
- `npm run start` - Production sunucusunu başlatır
- `npm run lint` - ESLint kontrolü yapar

## 🌟 Özellikler

- ✅ **Modern UI/UX**: Radix UI ve Tailwind CSS ile oluşturulmuş modern arayüz
- ✅ **Type Safety**: TypeScript ile tam tip güvenliği
- ✅ **Responsive Design**: Tüm cihazlarda uyumlu tasarım
- ✅ **Dark/Light Mode**: Tema değiştirme desteği
- ✅ **Real-time Data**: Supabase ile gerçek zamanlı veri
- ✅ **Form Validation**: Zod ile güçlü form doğrulama
- ✅ **State Management**: Zustand ile basit state yönetimi
- ✅ **Authentication**: Supabase Auth ile güvenli kimlik doğrulama

## 📝 Lisans

Bu proje özel kullanım içindir. Tüm hakları saklıdır.

## 👨‍💻 Geliştirici

**Bedirhan Tong**
- GitHub: [@bedirhantong](https://github.com/bedirhantong)