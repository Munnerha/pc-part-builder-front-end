## User Stories

- As a guest, I want to browse builds and parts.
- As a user, I want to sign up, sign in and sign out.
- As a user, I want to create, edit and delete my builds.
- As a user, I want to add, swap and remove parts in my build.
- As a user, I want to see my build's total price.
- As a user, I want a warning when my parts don't fit together (socket, RAM, GPU length, cooler height).
- As an admin, I want to delete any user or build.

![ERD]({1B153974-31F7-416E-9601-1A8A14398266}.png)

![Wireframe](image.png)

## Routes / Endpoints

### Back End (`/api`)

#### Auth
| Method | Endpoint | Access |
|---|---|---|
| POST | `/register` | Everyone |
| POST | `/login` | Everyone |

#### Components
| Method | Endpoint | Access |
|---|---|---|
| GET | `/components` | Everyone |

#### Builds
| Method | Endpoint | Access |
|---|---|---|
| GET | `/builds` | Everyone |
| GET | `/builds/{build_id}` | Everyone |
| POST | `/builds` | Signed in |
| PUT | `/builds/{build_id}` | Owner |
| DELETE | `/builds/{build_id}` | Owner or admin |

#### Build Components
| Method | Endpoint | Access |
|---|---|---|
| POST | `/builds/{build_id}/build_components` | Owner |
| PUT | `/build_components/{build_component_id}` | Owner |
| DELETE | `/build_components/{build_component_id}` | Owner |

#### Users
| Method | Endpoint | Access |
|---|---|---|
| GET | `/users` | Admin |
| DELETE | `/users/{user_id}` | Admin |

### Front End

| Path | Page |
|---|---|
| `/` | Landing |
| `/sign-up` | Sign up |
| `/sign-in` | Sign in |
| `/builds` | All builds |
| `/builds/new` | New build |
| `/builds/:buildId` | Build details |
| `/builds/:buildId/edit` | Edit build |
| `/builds/:buildId/choose/:category` | Pick a part |
| `/components` | Parts catalog |
| `/users` | Users (admin) |

markdown
## Component Hierarchy

```
App
├── NavBar
├── Landing
├── SignUpForm
├── SignInForm
├── BuildList
├── BuildDetails
├── BuildForm
├── PartList
└── UserList
```