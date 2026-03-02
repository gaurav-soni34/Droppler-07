# 🔐 Security Analysis Report - Droppler Dashboard

**Date:** March 2, 2026  
**Project:** Droppler (Water Usage Tracking Dashboard)  
**Status:** ⚠️ CRITICAL SECURITY ISSUES FOUND

---

## Executive Summary

Your codebase contains **6 critical security vulnerabilities** that must be addressed before production deployment:

1. ✗ Hardcoded Firebase credentials in source code
2. ✗ Sensitive API keys exposed in environment files  
3. ✗ Hardcoded private IP address (10.125.186.96)
4. ✗ Hardcoded n8n webhook URL with unknown exposed token
5. ✗ Port number hardcoded for local development
6. ✗ Firebase config duplicated in both env.local and firebase.ts (single source of truth violation)

**Risk Level:** 🔴 **CRITICAL** - Firebase credentials visible to anyone with repository access

---

## 🔥 CRITICAL ISSUES

### 1. Firebase API Key Hardcoded in Source Code

**Severity:** 🔴 CRITICAL

**Location:**
- [src/lib/firebase.ts](src/lib/firebase.ts#L10-L16) (Lines 10-16)
- [env.local](env.local#L1-L7) (Lines 1-7) - Also here

**Code Snippet:**
```typescript
// src/lib/firebase.ts (Lines 5-16)
const firebaseConfig = {
  apiKey: "AIzaSyBdF7MpUI_Z5O8Vn3mJF0zOiB9OQVWfN0M",
  authDomain: "smartwater-1603f.firebaseapp.com",
  projectId: "smartwater-1603f",
  storageBucket: "smartwater-1603f.appspot.com",
  messagingSenderId: "1035527975317",
  appId: "1:1035527975317:web:d3d231cb5fc853b843069c",
  databaseURL: "https://water-c2989-default-rtdb.asia-southeast1.firebasedatabase.app",
};
```

**Problem:**
- Firebase API keys hardcoded directly in source code
- The `apiKey` value is exposed in the repository
- Anyone who clones the repo has access to your Firebase backend
- The key can be used to:
  - Access Firestore/Realtime Database
  - Create/modify/delete records
  - Crash your app with rate limiting
  - Misuse your Firebase resources (billable)

**env.local content:**
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBdF7MpUI_Z5O8Vn3mJF0zOiB9OQVWfN0M
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=smartwater-1603f.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=smartwater-1603f
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=smartwater-1603f.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1035527975317
NEXT_PUBLIC_FIREBASE_APP_ID=1:1035527975317:web:d3d231cb5fc853b843069c
NEXT_PUBLIC_FIREBASE_DB_URL=https://water-c2989-default-rtdb.asia-southeast1.firebasedatabase.app
```

**What Should Be Done:**

✅ **Option 1 (Recommended):** Use environment variables ONLY
```typescript
// src/lib/firebase.ts
import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DB_URL!,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const rtdb = getDatabase(app);
```

✅ **env.local (unchanged):**
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBdF7MpUI_Z5O8Vn3mJF0zOiB9OQVWfN0M
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=smartwater-1603f.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=smartwater-1603f
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=smartwater-1603f.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1035527975317
NEXT_PUBLIC_FIREBASE_APP_ID=1:1035527975317:web:d3d231cb5fc853b843069c
NEXT_PUBLIC_FIREBASE_DB_URL=https://water-c2989-default-rtdb.asia-southeast1.firebasedatabase.app
```

✅ **.gitignore (already correct):**
```gitignore
.env*
.env.local
.env.production
```

**After Action:**
1. Rotate Firebase API keys immediately
2. Review Firebase console for unauthorized access attempts
3. Ensure `.env.local` is in `.gitignore` (it should be)

---

### 2. Hardcoded Private IP Address

**Severity:** 🔴 CRITICAL (Network Security)

**Location:** [src/app/generat-qr/page.tsx](src/app/generat-qr/page.tsx#L114) (Line 114)

**Code Snippet:**
```typescript
// src/app/generat-qr/page.tsx (Lines 114-115)
const LOCAL_IP = "10.125.186.96";
const PORT = 3000;

// Used at Line 163:
const reportUrl = `http://${LOCAL_IP}:${PORT}/report?studentId=${student.id}`;
```

**Problem:**
- Private IP `10.125.186.96` is hardcoded
- This is your local machine's IP address on a private network
- QR codes will contain this IP → exposed when QR codes are printed/shared
- Will break in production (different IP)
- Security risk: leaks your network infrastructure

**What Should Be Done:**

✅ **Add to .env.local:**
```
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

✅ **Add to .env.production:**
```
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_API_BASE_URL=https://yourdomain.com/api
```

✅ **Update code:**
```typescript
// src/app/generat-qr/page.tsx
// Remove hardcoded constants
// const LOCAL_IP = "10.125.186.96";
// const PORT = 3000;

export default function GenerateQRPage() {
  // ... existing code ...
  
  {grouped[className].map((student) => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const reportUrl = `${appUrl}/report?studentId=${student.id}`;
    return (
      // ... existing JSX ...
    );
  })}
}
```

---

### 3. Hardcoded n8n Webhook URL with Token

**Severity:** 🔴 CRITICAL (API/Service Exposure)

**Location:** [src/app/report/page.tsx](src/app/report/page.tsx#L70) (Line 70)

**Code Snippet:**
```typescript
// src/app/report/page.tsx (Lines 68-76)
const sendToN8n = async (actionLabel: string, studentName: string) => {
  try {
    await fetch("https://arflux.app.n8n.cloud/webhook-test/99e2942e-7786-4b20-bea6-9cfab5cc1f66", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `🚨 Issue reported: ${actionLabel}`,
        student: studentName,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (err) {
    console.error("❌ Failed to send data to n8n:", err);
  }
};
```

**Problem:**
- Webhook URL contains unique token ID: `99e2942e-7786-4b20-bea6-9cfab5cc1f66`
- Token is visible in source code → exposed to everyone
- Anyone can trigger your n8n workflows by making POST requests
- Can be used for:
  - Denial of service (spam requests)
  - Unauthorized data manipulation
  - Workflow abuse

**What Should Be Done:**

✅ **Add to .env.local:**
```
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://arflux.app.n8n.cloud/webhook-test/99e2942e-7786-4b20-bea6-9cfab5cc1f66
```

✅ **Update code:**
```typescript
// src/app/report/page.tsx
const sendToN8n = async (actionLabel: string, studentName: string) => {
  const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
  
  if (!webhookUrl) {
    console.warn("n8n webhook URL not configured");
    return;
  }
  
  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `🚨 Issue reported: ${actionLabel}`,
        student: studentName,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (err) {
    console.error("❌ Failed to send data to n8n:", err);
  }
};
```

---

## ⚠️ ENVIRONMENT-SPECIFIC ISSUES

### 4. .env.local Committed to Repository (Possible)

**Severity:** 🔴 CRITICAL

**Issue:** 
Your `.gitignore` correctly includes `.env*`, but:
- ✗ `env.local` file is shown in your workspace (not `.env.local`)
- ⚠️ Check if this file is committed to git

**Verification:**
```bash
# Run this in terminal to check if env.local is tracked:
git status env.local
# Or check git history:
git log --all -- env.local
```

**If committed to git:**
1. Remove from all history: `git rm --cached env.local`
2. Add to `.gitignore`: `.env.local`
3. Force new commit: `git commit -m "Remove env.local from tracking"`
4. Push changes: `git push`

---

### 5. Hardcoded Port Number

**Severity:** ⚠️ MEDIUM

**Location:** [src/app/generat-qr/page.tsx](src/app/generat-qr/page.tsx#L115) (Line 115)

**Code:**
```typescript
const PORT = 3000;
```

**Problem:**
- Production might use different port (3000 vs 8080, etc.)
- Breaks portability across environments

**Solution:** Already covered in Issue #2 above using `NEXT_PUBLIC_APP_URL`

---

## 📋 CONFIGURATION ISSUES

### 6. Firebase Config Duplication (Code Smell)

**Severity:** ⚠️ MEDIUM (Maintainability)

**Locations:**
- [src/lib/firebase.ts](src/lib/firebase.ts#L10-L16) - Hardcoded values
- [env.local](env.local#L1-L7) - Environment variables

**Problem:**
- Same config defined in two places
- Difficult to maintain (changes must be synced)
- Rules of 3: Don't Repeat Yourself (DRY principle)

**Solution:** Use single source of truth (environment variables only)

---

## ✅ WHAT'S GOOD

- ✅ Firebase config uses `NEXT_PUBLIC_*` prefix correctly (for client-side usage)
- ✅ `.gitignore` correctly excludes `.env*` files
- ✅ Using Firebase Realtime Database (not hardcoded connection strings)
- ✅ No SQL connection strings exposed
- ✅ No AWS/GCP service account keys visible
- ✅ No authentication tokens visible (except n8n webhook, which is an issue)

---

## 🛠️ ACTIONABLE FIXES SUMMARY

| Issue | File | Line | Fix | Priority |
|-------|------|------|-----|----------|
| Firebase Key Hardcoded | firebase.ts | 10-16 | Use `process.env.*` | P0 |
| Firebase Key Exposed | env.local | 1-7 | Ensure not committed | P0 |
| Private IP Hardcoded | generat-qr/page.tsx | 114 | Use `process.env.NEXT_PUBLIC_APP_URL` | P0 |
| Port Hardcoded | generat-qr/page.tsx | 115 | Use env variable | P0 |
| Webhook URL Hardcoded | report/page.tsx | 70 | Use `process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL` | P0 |
| Config Duplication | firebase.ts + env.local | Multiple | Remove from code | P1 |

---

## 📦 ENVIRONMENT VARIABLES SETUP

### `.env.local` (Development) - DO NOT COMMIT
```env
# Firebase Config
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBdF7MpUI_Z5O8Vn3mJF0zOiB9OQVWfN0M
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=smartwater-1603f.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=smartwater-1603f
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=smartwater-1603f.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1035527975317
NEXT_PUBLIC_FIREBASE_APP_ID=1:1035527975317:web:d3d231cb5fc853b843069c
NEXT_PUBLIC_FIREBASE_DB_URL=https://water-c2989-default-rtdb.asia-southeast1.firebasedatabase.app

# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api

# External Services
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://arflux.app.n8n.cloud/webhook-test/99e2942e-7786-4b20-bea6-9cfab5cc1f66
```

### `.env.production` (Production) - Store in CI/CD or hosting provider
```env
# Firebase Config (same credentials or different project)
NEXT_PUBLIC_FIREBASE_API_KEY=<PRODUCTION_API_KEY>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<PRODUCTION_DOMAIN>
NEXT_PUBLIC_FIREBASE_PROJECT_ID=<PRODUCTION_PROJECT_ID>
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<PRODUCTION_BUCKET>
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<PRODUCTION_SENDER_ID>
NEXT_PUBLIC_FIREBASE_APP_ID=<PRODUCTION_APP_ID>
NEXT_PUBLIC_FIREBASE_DB_URL=<PRODUCTION_DB_URL>

# App URLs
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_API_BASE_URL=https://yourdomain.com/api

# External Services
NEXT_PUBLIC_N8N_WEBHOOK_URL=<PRODUCTION_WEBHOOK_URL>
```

---

## 🔒 BEST PRACTICES FOR PRODUCTION DEPLOYMENT

### 1. **Rotate Firebase Credentials**
- Go to Firebase Console → Settings → Service Accounts
- Generate new API key
- Update all `.env.production` values
- Delete old credentials

### 2. **Implement Firebase Security Rules**
Create `.json` rules file in Firebase Console:
```json
{
  "rules": {
    "logs": {
      ".read": true,
      ".write": "auth != null"
    },
    "totals": {
      ".read": true,
      ".write": false
    },
    "students": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

### 3. **Use Cloudflare Workers or API Gateway for Sensitive Calls**
Instead of calling n8n directly from frontend:
```typescript
// Move to API route
// pages/api/report.ts or app/api/report/route.ts
export async function POST(req: Request) {
  const body = await req.json();
  
  // API key stored securely server-side
  const webhookUrl = process.env.N8N_WEBHOOK_URL!;
  
  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  
  return Response.json({ success: true });
}
```

Then call from frontend:
```typescript
await fetch("/api/report", {
  method: "POST",
  body: JSON.stringify(data),
});
```

### 4. **CORS Configuration**
In `next.config.ts`:
```typescript
const nextConfig: NextConfig = {
  headers: async () => {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: process.env.ALLOWED_ORIGINS || "http://localhost:3000" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,DELETE" },
        ],
      },
    ];
  },
};
```

### 5. **Environment Variable Validation**
Create a config validation file:
```typescript
// src/lib/env.ts
export const env = {
  firebase: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DB_URL!,
  },
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api",
  },
  n8n: {
    webhookUrl: process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL!,
  },
};

// At build time, validate:
if (!env.firebase.apiKey) throw new Error("Missing NEXT_PUBLIC_FIREBASE_API_KEY");
if (!env.n8n.webhookUrl) throw new Error("Missing NEXT_PUBLIC_N8N_WEBHOOK_URL");
```

### 6. **Deployment Checklist**
- [ ] Remove all hardcoded credentials from source files
- [ ] Set environment variables in hosting provider
- [ ] Test production build locally with production env vars
- [ ] Enable Firebase security rules
- [ ] Setup CloudFlare or similar for DDoS protection
- [ ] Enable HTTPS (should be automatic with most hosts)
- [ ] Setup monitoring and alerting for Firebase usage
- [ ] Rotate credentials quarterly
- [ ] Implement rate limiting on API endpoints

### 7. **Git Pre-commit Hook to Prevent Credential Leaks**
Create `.git/hooks/pre-commit`:
```bash
#!/bin/bash
# Prevent committing env files or API keys

FILES=$(git diff --cached --name-only)

for file in $FILES; do
  if [[ $file =~ \.env ]]; then
    echo "ERROR: You're trying to commit a .env file!"
    echo "Are you sure? (This would expose secrets)"
    exit 1
  fi
done

# Check for hardcoded API keys
if git diff --cached | grep -E "(AIzaSy|firebase|webhook|192\.168)"; then
  echo "WARNING: Possible credentials detected in staged changes"
  echo "Review carefully before committing"
fi

exit 0
```

---

## 📊 RISK MATRIX

| Issue | Likelihood | Impact | Risk | Mitigation |
|-------|-----------|--------|------|-----------|
| Firebase key compromise | HIGH | CRITICAL | 🔴 EXTREME | Use env vars + rotate keys |
| IP address leak | MEDIUM | MEDIUM | 🟠 HIGH | Use env var for URL |
| n8n webhook abuse | HIGH | MEDIUM | 🟠 HIGH | Move to backend endpoint |
| Port conflicts | LOW | LOW | 🟢 LOW | Use env var (already done) |

---

## 📞 NEXT STEPS

**Immediate (Before pushing to production):**
1. ✅ Rotate Firebase API keys
2. ✅ Update `src/lib/firebase.ts` to use environment variables
3. ✅ Update `src/app/generat-qr/page.tsx` to use `NEXT_PUBLIC_APP_URL`
4. ✅ Update `src/app/report/page.tsx` to use `NEXT_PUBLIC_N8N_WEBHOOK_URL`
5. ✅ Verify `.env.local` is in `.gitignore`
6. ✅ Remove any committed `.env.local` from git history (if present)

**Short-term (Before public deployment):**
- [ ] Implement Firebase security rules
- [ ] Move n8n calls to backend API route
- [ ] Add environment variable validation
- [ ] Setup production environment variables in hosting provider
- [ ] Test production build locally

**Long-term (Best practices):**
- [ ] Setup git pre-commit hooks
- [ ] Implement secret scanning in CI/CD pipeline
- [ ] Setup audit logging for API usage
- [ ] Implement rate limiting
- [ ] Regular security audits

---

**Generated:** March 2, 2026  
**Risk Assessment:** 🔴 **CRITICAL - ADDRESS BEFORE PRODUCTION**
