# 🔧 IMPLEMENTATION GUIDE - Security Fixes

## Quick Fix Checklist

- [ ] Fix 1: Update `src/lib/firebase.ts`
- [ ] Fix 2: Update `src/app/generat-qr/page.tsx`  
- [ ] Fix 3: Update `src/app/report/page.tsx`
- [ ] Fix 4: Verify `.gitignore` includes `.env.local`
- [ ] Fix 5: Create `.env.production` template
- [ ] Fix 6: Create `src/lib/env.ts` for validation

---

## FIX 1: Update Firebase Configuration

### Current Code (INSECURE)
**File:** `src/lib/firebase.ts`

```typescript
// 🚨 VULNERABLE: Hardcoded API key
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

### Fixed Code (SECURE)
```typescript
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

// Initialize Firebase once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Export Realtime Database instance
export const rtdb = getDatabase(app);
```

---

## FIX 2: Update QR Generation Page (Remove IP & Port Hardcoding)

### Current Code (INSECURE)
**File:** `src/app/generat-qr/page.tsx` (Lines 114-115 and 163)

```typescript
// 🚨 VULNERABLE: Hardcoded IP address
const LOCAL_IP = "10.125.186.96";
const PORT = 3000;

// ... later in code (Line 163):
const reportUrl = `http://${LOCAL_IP}:${PORT}/report?studentId=${student.id}`;
```

### Fixed Code (SECURE)
```typescript
// Remove the hardcoded constants entirely
// Delete these lines:
// const LOCAL_IP = "10.125.186.96";
// const PORT = 3000;

export default function GenerateQRPage() {
  const [savedStudents, setSavedStudents] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const { theme, systemTheme } = useTheme();

  // ... rest of the code ...

  return (
    <div className="p-6">
      <h1 className={`text-6xl font-light mb-8 text-center ${textColor}`}>
        QR is Here Buddy!
      </h1>

      {Object.keys(grouped).map((className) => (
        <div key={className} className="mb-10">
          <h2 className={`text-2xl font-semibold mb-6 ${textColor}`}>
            Class {className}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {grouped[className].map((student) => {
              // ✅ SECURE: Use environment variable instead
              const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
              const reportUrl = `${appUrl}/report?studentId=${student.id}`;
              
              return (
                <div
                  key={student.id}
                  className={`${cardBg} border rounded-lg p-4 shadow-md ${shadowColor} flex flex-col items-center w-full`}
                >
                  {/* ... rest of JSX ... */}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## FIX 3: Update Report Page (Move n8n Webhook to Env)

### Current Code (INSECURE)
**File:** `src/app/report/page.tsx` (Line 70)

```typescript
// 🚨 VULNERABLE: Hardcoded webhook URL with token
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

### Fixed Code (SECURE) - Option A: Frontend with env var
```typescript
const sendToN8n = async (actionLabel: string, studentName: string) => {
  const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
  
  if (!webhookUrl) {
    console.warn("⚠️ n8n webhook URL not configured");
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

### Fixed Code (RECOMMENDED) - Option B: Backend endpoint (More Secure)

**Create:** `src/app/api/webhooks/n8n/route.ts`
```typescript
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // API key stored securely server-side
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    
    if (!webhookUrl) {
      console.error("N8N_WEBHOOK_URL not configured");
      return Response.json(
        { error: "Webhook not configured" },
        { status: 500 }
      );
    }
    
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      throw new Error(`n8n webhook failed: ${response.statusText}`);
    }
    
    return Response.json({ success: true });
  } catch (error) {
    console.error("❌ Failed to call n8n webhook:", error);
    return Response.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
}
```

**Update report/page.tsx to call your API:**
```typescript
const sendToN8n = async (actionLabel: string, studentName: string) => {
  try {
    await fetch("/api/webhooks/n8n", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `🚨 Issue reported: ${actionLabel}`,
        student: studentName,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (err) {
    console.error("❌ Failed to send report:", err);
  }
};
```

**NOTE:** Option B is significantly more secure because:
- Webhook URL/token never exposed to browser
- Can implement rate limiting on backend
- Can add authentication/validation
- Easy to swap n8n with another service later

---

## FIX 4: Verify .gitignore

### Current (Should be correct)
**File:** `.gitignore`

```gitignore
# env files (can opt-in for committing if needed)
.env*
```

**To manually verify:**
```bash
# Should show no output if env.local is properly ignored:
git status env.local
git ls-files | grep -E "\.env"
```

**If env.local is committed to git history:**
```bash
# Remove from tracking
git rm --cached env.local

# Remove from all git history (nuclear option)
git filter-branch --tree-filter 'rm -f .env.local' HEAD

# Or use BFG (safer)
bfg --delete-files env.local
```

---

## FIX 5: Create Production Environment File Template

### Create: `.env.production.example`
```env
# Firebase Configuration (Production Project)
NEXT_PUBLIC_FIREBASE_API_KEY=your_production_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_production_domain.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_production_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_production_bucket.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_production_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_production_app_id
NEXT_PUBLIC_FIREBASE_DB_URL=https://your_production_rtdb.firebasedatabase.app

# Application URLs
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_API_BASE_URL=https://yourdomain.com/api

# External Services
NEXT_PUBLIC_N8N_WEBHOOK_URL=your_production_n8n_webhook_url
# OR use backend endpoint and store this server-side:
N8N_WEBHOOK_URL=your_production_n8n_webhook_url
```

### Deployment Instructions

**For Vercel:**
```bash
# Using Vercel CLI
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
# ... etc for all variables
```

**For Netlify:**
```bash
# Using Netlify CLI
netlify env:set NEXT_PUBLIC_FIREBASE_API_KEY "value"
netlify env:set NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN "value"
# ... etc for all variables
```

**For Docker/Self-hosted:**
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm ci
# Environment variables passed at runtime
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Run with:
```bash
docker run -e NEXT_PUBLIC_FIREBASE_API_KEY="..." -e NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..." myapp
```

---

## FIX 6: Create Environment Validation Module

### Create: `src/lib/env.ts`

```typescript
/**
 * Environment variable validation and configuration
 * This ensures all required env vars are present at runtime
 */

function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  
  return value;
}

export const env = {
  // Firebase Configuration
  firebase: {
    apiKey: getEnvVar("NEXT_PUBLIC_FIREBASE_API_KEY"),
    authDomain: getEnvVar("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"),
    projectId: getEnvVar("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
    storageBucket: getEnvVar("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"),
    messagingSenderId: getEnvVar("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
    appId: getEnvVar("NEXT_PUBLIC_FIREBASE_APP_ID"),
    databaseURL: getEnvVar("NEXT_PUBLIC_FIREBASE_DB_URL"),
  },
  
  // Application Configuration
  app: {
    url: getEnvVar("NEXT_PUBLIC_APP_URL", "http://localhost:3000"),
    apiBaseUrl: getEnvVar("NEXT_PUBLIC_API_BASE_URL", "http://localhost:3000/api"),
    isDev: process.env.NODE_ENV === "development",
    isProd: process.env.NODE_ENV === "production",
  },
  
  // External Services
  n8n: {
    webhookUrl: getEnvVar("NEXT_PUBLIC_N8N_WEBHOOK_URL", ""),
  },
} as const;

// Validate at module load time
if (typeof window === "undefined") {
  // Server-side validation (runs on build)
  try {
    // Validate required vars
    if (env.isProd) {
      Object.values(env.firebase).forEach((value) => {
        if (!value) {
          throw new Error("Missing Firebase configuration for production");
        }
      });
    }
  } catch (error) {
    console.error("Environment validation failed:", error);
    if (env.isProd) {
      throw error; // Fail build in production
    }
  }
}
```

### Update firebase.ts to use validation:

```typescript
import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";
import { env } from "./env";

const firebaseConfig = {
  apiKey: env.firebase.apiKey,
  authDomain: env.firebase.authDomain,
  projectId: env.firebase.projectId,
  storageBucket: env.firebase.storageBucket,
  messagingSenderId: env.firebase.messagingSenderId,
  appId: env.firebase.appId,
  databaseURL: env.firebase.databaseURL,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const rtdb = getDatabase(app);
```

---

## Deployment Checklist

Before going to production, verify:

### Pre-Deployment
- [ ] All hardcoded credentials removed from source code
- [ ] `.env.local` added to `.gitignore` 
- [ ] No `.env.local` in git history
- [ ] Tested build locally with production env vars: `NODE_ENV=production npm run build`
- [ ] All environment variables validated via `env.ts`

### During Deployment
- [ ] Set all `NEXT_PUBLIC_*` variables in hosting provider
- [ ] Set `N8N_WEBHOOK_URL` (server-side) if using backend endpoint
- [ ] Rotate Firebase API keys
- [ ] Enable Firebase security rules

### Post-Deployment
- [ ] Test production build with real credentials
- [ ] Monitor Firebase for unauthorized access
- [ ] Check n8n webhook logs for abuse
- [ ] Setup rate limiting on API routes
- [ ] Enable logging/monitoring

---

## Testing the Fixes

### Local Development
```bash
# Create .env.local with development credentials
echo "NEXT_PUBLIC_FIREBASE_API_KEY=..." > .env.local
echo "NEXT_PUBLIC_APP_URL=http://localhost:3000" >> .env.local

# Start dev server
npm run dev

# Test that variables are loaded
# Check browser console for no errors
```

### Production Build
```bash
# Build for production
NODE_ENV=production npm run build

# Check for any hardcoded credentials in build output
grep -r "AIzaSy" .next/
grep -r "10.125.186" .next/
grep -r "99e2942e" .next/

# Should return zero results if fixed correctly
```

### Env Validation
```typescript
// In browser console or Node REPL
import { env } from "@/lib/env";
console.log(env.firebase.apiKey); // Should not be exposed
console.log(env.app.url); // Should be correct for environment
```

---

## Timeline for Implementation

**Immediate (Today):**
1. Create `src/lib/env.ts`
2. Update `src/lib/firebase.ts` 
3. Update `src/app/generat-qr/page.tsx`
4. Update `src/app/report/page.tsx`
5. Test locally with `npm run dev`

**This Week:**
1. Create `.env.production.example`
2. Setup production environment variables in hosting provider
3. Test production build locally
4. Rotate Firebase credentials

**Before Public Launch:**
1. Implement Firebase security rules
2. Move n8n webhook to backend endpoint (FIX 3, Option B)
3. Setup monitoring and alerting
4. Final security audit

---

## References

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Firebase Security](https://firebase.google.com/docs/security)
- [OWASP - Secrets Management](https://owasp.org/www-community/attacks/Sensitive_Data_Exposure)
- [12-Factor App - Config](https://12factor.net/config)
