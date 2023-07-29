# Place Keeper

### 動作環境

-   Next.js 13.4.6
-   Node.js 19.6.0
-   React 18.2.0
-   yarn 1.22.19
-   Prisma 5.0.0
-   NextAuth.js 4.22.1
-   React Leaflet 4.2.1
-   React Leaflet Routing Machine 0.0.5

### yarn のインストール

yarn がインストールされていない場合

```zsh
$ npm install -g yarn

or

$ brew install yarn

```

### 動作確認方法

動作確認に関しては、以下を順に行ってください。(zip ファイルからは動作できません。)

### プロジェクトのクローン

```zsh
$ git clone https://github.com/mitsu3s/placekeeper.git
```

### 依存関係のインストール

```zsh
$ yarn install
```

### env ファイルの作成

両ファイルともアプリケーションのルートディレクトリに置いてください。

.env

```zsh
DATABASE_URL=mysql://user:password@localhost:3306/placekeeper

NEXT_PUBLIC_URL=http://localhost:3000

NEXTAUTH_URL=http://localhost:3000
```

.env.local

```zsh
# メールサーバーの設定（変数の値はzipファイルに同封しているSERVER.mdを参照してください。）

EMAIL_SERVER_USER=
EMAIL_SERVER_PASSWORD=
EMAIL_SERVER_HOST=
EMAIL_SERVER_PORT=
EMAIL_FROM=

SECRET=
```

### データベースの設定

```zsh
# ユーザーの作成（MariaDB内で）

$ create user 'user'@'localhost' identified by 'password';
$ grant all privileges on *.* to 'user'@'localhost';

# PrismaのMigrateを実行（アプリケーションのルートディレクトリで）

$ npx prisma migrate dev

# PrismaのGenerateを実行（アプリケーションのルートディレクトリで）

$ npx prisma generate
```

### アプリケーションの起動

```zsh
# Next.jsのBuildとStart

$ yarn build && yarn start
```
