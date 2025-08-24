# Playwright API Tests

## 🚀 Install

1. Clone this repo:

   ```bash
   git clone https://github.com/your-username/playwright-api-test.git
   cd playwright-api-test
   ```

2. Install packages:

   ```bash
   npm install
   ```

---

## 🧪 Run tests

This project has **API tests only**.
All tests are in one file:

```
tests/api-testing.spec.js
```

Run all tests:

```bash
npx playwright test
```

---

## ⚙️ CI/CD

The tests run with **GitHub Actions**:

* Every day at **09:00 (local time)**.
* On **every commit** to the repo.

You can see the config file here:

```
.github/workflows/ci.yml
```

---

👉 Very simple: install, run, and the pipeline runs tests automatic.

Note: This was my first time to create CI/CD pipeline it was great expirience and learn a lot. Wasn't hard.
---
