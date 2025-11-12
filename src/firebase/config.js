import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// 临时测试配置 - 请替换为你的真实 Firebase 配置
const firebaseConfig = {
  apiKey: "AIzaSyBLASoEG5NwdnsVov-lvT_KJX1rg-m6QLc",
  authDomain: "study-hub-1297a.firebaseapp.com",
  projectId: "study-hub-1297a",
  storageBucket: "study-hub-1297a.firebasestorage.app",
  messagingSenderId: "278786999386",
  appId: "1:278786999386:web:7f7d9a148714565cd28463",
}

// 初始化 Firebase
const app = initializeApp(firebaseConfig)

// 导出认证和数据库服务
export const auth = getAuth(app)
export const db = getFirestore(app)
export default app
