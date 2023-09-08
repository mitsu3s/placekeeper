## PlaceKeeper

Intuitive Map Sharing Application.

## Description

### As Owner

-   Sign in and login with email address verification.
-   Click on the map, pin it, give it a location name and description, and save it. (Move the map by dragging or address search and pin it.)
-   Issue a sharing code.

### As Shared User

-   By entering the sharing code obtained from the Owner from the top page, a map with pinned locations where the Owner has saved will be displayed.
-   Shared maps do not allow the addition or deletion of storage locations and only have read-only permissions.

### Common Feature

-   Search the list of saved locations.
-   Press a name in the list of saved locations moves the map to the corresponding location.
-   If there are two or more saved locations, the route is displayed by pressing the checkbox in the list.

## Requirement

| Language/FrameWork | Version |
| :----------------- | ------: |
| TypeScript         |   5.1.3 |
| Next.js            |  13.4.6 |
| Node.js            |  19.6.0 |
| React              |  18.2.0 |
| MariaDB            | 10.4.27 |
| yarn               | 1.22.19 |

## Usage

### Install Dependencies

```zsh
# Run (in the root directory of the application)
$ yarn install
```

### Add .env file

```zsh
# .env
DATABASE_URL=mysql://user:password@localhost:3306/placekeeper
NEXT_PUBLIC_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
```

### Database Settings

```zsh
# Create user (in MariaDB)
$ create user 'user'@'localhost' identified by 'password';
$ grant all privileges on *.* to 'user'@'localhost';

# Run Prisma Migrate (in the root directory of the application)
$ npx prisma migrate dev

# Run Prisma Generate (in the root directory of the application)
$ npx prisma generate
```

### Launch Applications

```zsh
# Run (in the root directory of the application)
# After execution, connect to http://localhost:3000.
$ yarn build && yarn start
```

## Attention

Running the application requires a description of the mail server in the .env file, which is not included here for security reasons.

Therefore, if you are considering running the application, please contact me at the email address listed on my GitHub.
