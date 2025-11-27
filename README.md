# 心理診断プラットフォーム (Shindan Platform)

心理・性格・カウンセリングを基盤とした診断機能を中心に、決済、チャット、クレジット管理、アフィリエイト、AIレポート生成などを一元的に提供する診断系WEBプラットフォームです。

## 🎯 プロジェクト概要

本サービスは多言語対応や企業向けの会社コード管理機能を備え、信頼性・拡張性の高い構成となっています。

### 開発コンセプト
- **信頼性** - 専門家監修による高品質な診断
- **専門性** - 心理学に基づいた設問設計
- **拡張性** - モジュラーアーキテクチャ
- **ユーザーフレンドリー** - 直感的なUI/UX

## 🛠 技術スタック

### フロントエンド
- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **Zustand** (状態管理)
- **React Query** (データフェッチ)
- **next-intl** (多言語対応)
- **Framer Motion** (アニメーション)

### バックエンド
- **NestJS**
- **Prisma ORM**
- **PostgreSQL**
- **JWT認証**
- **Socket.io** (リアルタイム通信)
- **Swagger** (API文書化)

### 外部サービス
- **Stripe** / **ByPay** (決済)
- **OpenAI API** (AIレポート生成)
- **Wise API** (国際送金)

## 📁 プロジェクト構造

```
shindan-platform/
├── apps/
│   ├── frontend/          # Next.js フロントエンド
│   │   ├── src/
│   │   │   ├── app/       # App Router ページ
│   │   │   ├── components/# UIコンポーネント
│   │   │   ├── lib/       # ユーティリティ
│   │   │   ├── store/     # Zustand ストア
│   │   │   └── styles/    # グローバルスタイル
│   │   └── messages/      # i18n メッセージ
│   │
│   └── backend/           # NestJS バックエンド
│       ├── src/
│       │   ├── auth/      # 認証モジュール
│       │   ├── users/     # ユーザー管理
│       │   ├── diagnosis/ # 診断機能
│       │   ├── chat/      # チャット機能
│       │   ├── payments/  # 決済機能
│       │   ├── credits/   # クレジット管理
│       │   ├── affiliates/# アフィリエイト
│       │   ├── reports/   # AIレポート
│       │   └── companies/ # 企業管理
│       └── prisma/        # DB スキーマ
│
├── packages/
│   └── shared/            # 共有型定義・ユーティリティ
│
└── docs/                  # ドキュメント
```

## 🚀 セットアップ

### 必要条件
- Node.js 18+
- PostgreSQL 15+
- npm または yarn

### インストール

```bash
# リポジトリをクローン
git clone <repository-url>
cd shindan-platform

# 依存関係をインストール
npm install

# 環境変数を設定
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env

# データベースをセットアップ
cd apps/backend
npx prisma generate
npx prisma db push

# 開発サーバーを起動
npm run dev
```

### 環境変数

#### バックエンド (.env)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/shindan_db"
JWT_SECRET=your-secret-key
STRIPE_SECRET_KEY=sk_test_xxx
OPENAI_API_KEY=sk-xxx
```

#### フロントエンド (.env)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

## 📱 主要機能

### 一般ユーザー機能
- ✅ 会員登録・ログイン (Email / SNS)
- ✅ 無料・有料診断の受検
- ✅ 診断結果・AIレポート閲覧
- ✅ 1対1チャット相談
- ✅ クレジット購入・管理
- ✅ マイページ
- ✅ アフィリエイト参加

### 管理者機能
- ✅ 診断ロジック管理
- ✅ 会員・相談員管理
- ✅ 決済・クレジット管理
- ✅ AIレポート再生成
- ✅ アフィリエイト報酬管理

### 運営管理者機能
- ✅ 企業アカウント管理
- ✅ 会社コード発行
- ✅ 権限設定・統制

## 🎨 デザインシステム

### カラーパレット
| 色名 | コード | 用途 |
|-----|-------|-----|
| Calm Beige | `#F3EFE7` | プライマリ背景 |
| Deep Navy | `#1D1F24` | プライマリテキスト |
| Warm Gray | `#8A8A8A` | セカンダリテキスト |
| Sand Brown | `#C5B9A3` | アクセント |
| Success | `#47B881` | 成功状態 |
| Warning | `#F7C948` | 警告状態 |
| Error | `#EC4C47` | エラー状態 |

### タイポグラフィ
- **見出し**: Noto Sans JP / KR / EN
- **レポート**: Playfair Display / Pretendard

## 🌐 多言語対応

- 🇯🇵 日本語 (デフォルト)
- 🇰🇷 韓国語
- 🇬🇧 英語

## 📚 API ドキュメント

開発サーバー起動後、以下でSwagger UIにアクセスできます:
```
http://localhost:4000/api/docs
```

## 🧪 テスト

```bash
# ユニットテスト
npm run test

# E2Eテスト
npm run test:e2e

# カバレッジ
npm run test:cov
```

## 📦 デプロイ

```bash
# プロダクションビルド
npm run build

# 起動
npm run start
```

## 📅 開発ロードマップ

| フェーズ | 期間 | 内容 |
|---------|------|------|
| Step1 | 1ヶ月 | 要件定義・全体設計 |
| Step2 | 3〜4ヶ月 | UI/UX設計・DB設計・API設計 |
| Step3 | 3〜4ヶ月 | フロント/バックエンド開発 |
| Step4 | 5〜7ヶ月 | AI・決済・相談機能開発 |
| Step5 | 6〜8ヶ月 | 結合テスト・品質保証 |
| Step6 | 2〜3ヶ月 | Phase2（AI高度化・アフィリエイト機能） |
| リリース | 2026年4月 | MVPリリース |

## 📄 ライセンス

Private - All rights reserved

## 👥 コントリビューター

開発チーム

---

© 2024 心理診断プラットフォーム. All rights reserved.
