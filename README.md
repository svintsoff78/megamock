# 🚀 MegaMock for NestJS

**MegaMock** is a declarative mock generator for NestJS.  
It creates mock API responses directly from class definitions using decorators — no json-server, no swagger mocker, no manual fixtures.

---

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-Compatible-red?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Typescript-100%25-blue?style=for-the-badge" />
  <img src="https://img.shields.io/npm/v/%40megamock/nest?style=for-the-badge" />
</p>

---

## ✨ Features

- 🎯 Generate mock API responses via the `@MockRoute` decorator
- 🧩 Nested entities with `@MockProperty({ type: User })`
- 🔄 Array generation with random lengths
- ❓ Nullable fields with automatic probability
- 🧱 Depth limit to prevent circular structures
- 📦 Works with HTTP, WebSockets, tests, and local development
- 🔌 No external mock servers or JSON files required

---

## 📦 Installation

```bash
npm install @megamock/nest
# or
yarn add @megamock/nest
```


