# Place Keeper

Map Sharing Application.

## Overview

Place Keeper is a convenient map-sharing application that allows users to pin locations on a map and share them with others using a unique code.  
Owners can save and manage locations, while shared users can view them in a read-only format.

### For Owners

-   **Secure Authentication:** Sign up and log in with email verification.
-   **Pin & Save Locations:** Click on the map to place a pin, assign a location name, add a description, and save it.
-   **Flexible Map Navigation:** Move the map by dragging or searching for an address before placing a pin.
-   **Easy Sharing:** Generate a unique sharing code to allow others to view your saved locations.

### For Shared Users

-   **Access Shared Maps:** Enter the sharing code provided by the Owner to view the pinned locations.
-   **Read-Only Mode:** Shared users can view locations but cannot add, edit, or delete them.

### Common Features

-   **Search Functionality:** Quickly find saved locations using a search bar.
-   **Interactive Map Navigation:** Clicking a location in the list moves the map to the corresponding pin.
-   **Route Display:** If multiple locations are saved, select them via checkboxes to display a route between them.

## Requirement

| Language/FrameWork |  Version |
| :----------------- | -------: |
| TypeScript         |    5.4.3 |
| Next.js            |   13.5.8 |
| Node.js            | 20.17.16 |
| React              |  18.3.18 |
| MariaDB            |  10.4.28 |
| yarn               |  1.22.19 |

## Usage

### Install Dependencies

```zsh
# Run (In App)
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
# Create User (In MariaDB)
$ create user 'user'@'localhost' identified by 'password';
$ grant all privileges on *.* to 'user'@'localhost';

# Run Prisma Migrate (In App)
$ npx prisma migrate dev

# Run Prisma Generate (In App)
$ npx prisma generate
```

### Launch Applications

```zsh
# Run (In App)
# After execution, connect to http://localhost:3000.
$ yarn build && yarn start
```

## Attention

Running the application locally requires a description of the mail server in the .env file, which is not included here for security reasons.

Therefore, if you are considering running the application or have any problems, please contact me at the email address listed on my GitHub. (It may take a few days to contact you. Please understand.)
