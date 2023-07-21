## 動作確認方法

動作確認に関しては、以下を順に行ってください。

### env ファイルの作成

.env

```
DATABASE_URL="mysql://user:password@localhost:3306/placekeeper"
NEXTAUTH_URL="http://localhost:3000"
```

.env.local

```
# メールサーバーの設定（変数の値は別途ファイルに記載します。）

EMAIL_SERVER_USER=
EMAIL_SERVER_PASSWORD=
EMAIL_SERVER_HOST==
EMAIL_SERVER_PORT==
EMAIL_FROM=

SECRET=
```

### データベースの設定

```
<!-- ユーザーの作成（MariaDB内で）-->

$ create user 'user'@'localhost' identified by 'password';
$ GRANT ALL PRIVILEGES ON *.* TO 'user'@'localhost';

<!-- PrismaのMigrateを実行 -->

$ npx prisma migrate dev

<!-- PrismaのGenerateを実行 -->

$ npx prisma generate
```

### アプリケーションの起動

```
<!-- Next.jsのBuildとStart -->

$ yarn build && yarn start
```
