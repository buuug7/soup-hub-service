# database

## create database

```mysql
create database `soup_hub` default charset utf8mb4 collate utf8mb4_unicode_ci;
```

## database schema

### tables

- user

  - id
  - name
  - email
  - password
  - rememberToken
  - github
  - createdAt
  - updatedAt

- soup

  - id
  - userId
  - content
  - more
  - active
  - deletedAt
  - createdAt
  - updatedAt

- user_soup_star

  - userId
  - soupId
  - createdAt

### table relations

one user may have many created soups, inverse one soup only belongs to one user.
