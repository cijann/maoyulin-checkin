/************************************
 * 猫羽雫 Cookie 抓取脚本
 * 适配: Loon (http-request)
 *
 * 用 Safari 打开 maoyulin.xyz 任意页面，
 * 自动抓取请求中的 session cookie 并存到持久化存储。
 * 签到脚本会自动读取。
 *
 * 抓到后建议关掉此脚本，避免频繁触发。
 ************************************/

const STORE_KEY = "maoyulin_session";

// 从请求头里捞 session cookie
const rawCookie = ($request.headers && ($request.headers.Cookie || $request.headers.cookie)) || "";
const match = rawCookie.match(/(?:^|;\s*)session=([^;]+)/);

if (match) {
  const session = match[1];
  const prev = typeof $persistentStore !== "undefined" ? $persistentStore.read(STORE_KEY) : "";

  // 值没变就跳过，避免重复通知
  if (session === prev) {
    $done();
    return;
  }

  if (typeof $persistentStore !== "undefined") {
    $persistentStore.write(session, STORE_KEY);
  }

  const preview = session.length > 24 ? session.substring(0, 24) + "..." : session;
  console.log(`[猫羽雫抓Cookie] ✅ 已存储 session=${preview}`);

  if (typeof $notification !== "undefined") {
    $notification.post("猫羽雫 🍪 已抓取", "签到脚本可用", `session=${preview}`);
  }
}

$done();
