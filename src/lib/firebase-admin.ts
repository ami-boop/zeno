import serviceAccount from '../../firebase-adminsdk.json'
import { cert, getApps, initializeApp, type ServiceAccount } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

const app = getApps()[0] ?? initializeApp({ credential: cert(serviceAccount as ServiceAccount) })

export const adminAuth = getAuth(app)
