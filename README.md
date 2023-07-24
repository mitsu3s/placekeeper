# Place Keeper

### 動作環境

-   Node.js 19.6.0
-   yarn 1.22.19

### yarn のインストール

yarn がインストールされていない場合

```zsh
$ npm install -g yarn

or

$ brew install yarn

```

### 動作確認方法

動作確認に関しては、以下を順に行ってください。

### プロジェクトのクローン

```zsh
$ git clone https://github.com/mitsu3s/placekeeper.git
```

### 依存関係のインストール

```zsh
$ yarn install
```

### env ファイルの作成

.env

```zsh
DATABASE_URL=mysql://user:password@localhost:3306/placekeeper

NEXT_PUBLIC_URL=http://localhost:3000

NEXTAUTH_URL=http://localhost:3000
```

.env.local

```zsh
# メールサーバーの設定（変数の値は別途ファイルに記載します。）

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
$ GRANT ALL PRIVILEGES ON *.* TO 'user'@'localhost';

# PrismaのMigrateを実行

$ npx prisma migrate dev

# PrismaのGenerateを実行

$ npx prisma generate
```

### アプリケーションの起動

```zsh
# Next.jsのBuildとStart

$ yarn build && yarn start
```
