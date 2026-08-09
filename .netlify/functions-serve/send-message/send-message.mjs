
import {createRequire as ___nfyCreateRequire} from "module";
import {fileURLToPath as ___nfyFileURLToPath} from "url";
import {dirname as ___nfyPathDirname} from "path";
let __filename=___nfyFileURLToPath(import.meta.url);
let __dirname=___nfyPathDirname(___nfyFileURLToPath(import.meta.url));
let require=___nfyCreateRequire(import.meta.url);


// netlify/functions/send-message.mjs
var send_message_default = async (req, context) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return Response.json({ error: "Server not configured" }, { status: 500 });
  }
  let data;
  try {
    data = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const { type, username, message, email } = data;
  let text;
  if (type === "about") {
    if (!username || !message) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }
    text = `\u{1F4E8} New message \u2014 monster-az.netlify.app
\u{1F464} From: ${username}
\u{1F4AC} Message: ${message}`;
  } else if (type === "subscribe") {
    if (!email) {
      return Response.json({ error: "Missing email" }, { status: 400 });
    }
    text = `\u{1F514} New subscriber \u2014 monster-az.netlify.app
\u{1F4E7} ${email}`;
  } else {
    return Response.json({ error: "Unknown type" }, { status: 400 });
  }
  try {
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text })
    });
    if (!res.ok) throw new Error("telegram-failed");
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ error: "Telegram send failed" }, { status: 502 });
  }
};
var config = {
  path: "/api/send-message",
  method: "POST"
};
export {
  config,
  send_message_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibmV0bGlmeS9mdW5jdGlvbnMvc2VuZC1tZXNzYWdlLm1qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiZXhwb3J0IGRlZmF1bHQgYXN5bmMgKHJlcSwgY29udGV4dCkgPT4ge1xyXG4gIGlmIChyZXEubWV0aG9kICE9PSBcIlBPU1RcIikge1xyXG4gICAgcmV0dXJuIG5ldyBSZXNwb25zZShcIk1ldGhvZCBOb3QgQWxsb3dlZFwiLCB7IHN0YXR1czogNDA1IH0pO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgVEVMRUdSQU1fQk9UX1RPS0VOID0gcHJvY2Vzcy5lbnYuVEVMRUdSQU1fQk9UX1RPS0VOO1xyXG4gIGNvbnN0IFRFTEVHUkFNX0NIQVRfSUQgPSBwcm9jZXNzLmVudi5URUxFR1JBTV9DSEFUX0lEO1xyXG5cclxuICBpZiAoIVRFTEVHUkFNX0JPVF9UT0tFTiB8fCAhVEVMRUdSQU1fQ0hBVF9JRCkge1xyXG4gICAgcmV0dXJuIFJlc3BvbnNlLmpzb24oeyBlcnJvcjogXCJTZXJ2ZXIgbm90IGNvbmZpZ3VyZWRcIiB9LCB7IHN0YXR1czogNTAwIH0pO1xyXG4gIH1cclxuXHJcbiAgbGV0IGRhdGE7XHJcbiAgdHJ5IHtcclxuICAgIGRhdGEgPSBhd2FpdCByZXEuanNvbigpO1xyXG4gIH0gY2F0Y2gge1xyXG4gICAgcmV0dXJuIFJlc3BvbnNlLmpzb24oeyBlcnJvcjogXCJJbnZhbGlkIEpTT05cIiB9LCB7IHN0YXR1czogNDAwIH0pO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgeyB0eXBlLCB1c2VybmFtZSwgbWVzc2FnZSwgZW1haWwgfSA9IGRhdGE7XHJcblxyXG4gIGxldCB0ZXh0O1xyXG4gIGlmICh0eXBlID09PSBcImFib3V0XCIpIHtcclxuICAgIGlmICghdXNlcm5hbWUgfHwgIW1lc3NhZ2UpIHtcclxuICAgICAgcmV0dXJuIFJlc3BvbnNlLmpzb24oeyBlcnJvcjogXCJNaXNzaW5nIGZpZWxkc1wiIH0sIHsgc3RhdHVzOiA0MDAgfSk7XHJcbiAgICB9XHJcbiAgICB0ZXh0ID0gYFx1RDgzRFx1RENFOCBOZXcgbWVzc2FnZSBcdTIwMTQgbW9uc3Rlci1hei5uZXRsaWZ5LmFwcFxcblx1RDgzRFx1REM2NCBGcm9tOiAke3VzZXJuYW1lfVxcblx1RDgzRFx1RENBQyBNZXNzYWdlOiAke21lc3NhZ2V9YDtcclxuICB9IGVsc2UgaWYgKHR5cGUgPT09IFwic3Vic2NyaWJlXCIpIHtcclxuICAgIGlmICghZW1haWwpIHtcclxuICAgICAgcmV0dXJuIFJlc3BvbnNlLmpzb24oeyBlcnJvcjogXCJNaXNzaW5nIGVtYWlsXCIgfSwgeyBzdGF0dXM6IDQwMCB9KTtcclxuICAgIH1cclxuICAgIHRleHQgPSBgXHVEODNEXHVERDE0IE5ldyBzdWJzY3JpYmVyIFx1MjAxNCBtb25zdGVyLWF6Lm5ldGxpZnkuYXBwXFxuXHVEODNEXHVEQ0U3ICR7ZW1haWx9YDtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIFJlc3BvbnNlLmpzb24oeyBlcnJvcjogXCJVbmtub3duIHR5cGVcIiB9LCB7IHN0YXR1czogNDAwIH0pO1xyXG4gIH1cclxuXHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKGBodHRwczovL2FwaS50ZWxlZ3JhbS5vcmcvYm90JHtURUxFR1JBTV9CT1RfVE9LRU59L3NlbmRNZXNzYWdlYCwge1xyXG4gICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICBoZWFkZXJzOiB7IFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiIH0sXHJcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgY2hhdF9pZDogVEVMRUdSQU1fQ0hBVF9JRCwgdGV4dCB9KSxcclxuICAgIH0pO1xyXG4gICAgaWYgKCFyZXMub2spIHRocm93IG5ldyBFcnJvcihcInRlbGVncmFtLWZhaWxlZFwiKTtcclxuICAgIHJldHVybiBSZXNwb25zZS5qc29uKHsgb2s6IHRydWUgfSk7XHJcbiAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICByZXR1cm4gUmVzcG9uc2UuanNvbih7IGVycm9yOiBcIlRlbGVncmFtIHNlbmQgZmFpbGVkXCIgfSwgeyBzdGF0dXM6IDUwMiB9KTtcclxuICB9XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgY29uZmlnID0ge1xyXG4gIHBhdGg6IFwiL2FwaS9zZW5kLW1lc3NhZ2VcIixcclxuICBtZXRob2Q6IFwiUE9TVFwiLFxyXG59OyJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7QUFBQSxJQUFPLHVCQUFRLE9BQU8sS0FBSyxZQUFZO0FBQ3JDLE1BQUksSUFBSSxXQUFXLFFBQVE7QUFDekIsV0FBTyxJQUFJLFNBQVMsc0JBQXNCLEVBQUUsUUFBUSxJQUFJLENBQUM7QUFBQSxFQUMzRDtBQUVBLFFBQU0scUJBQXFCLFFBQVEsSUFBSTtBQUN2QyxRQUFNLG1CQUFtQixRQUFRLElBQUk7QUFFckMsTUFBSSxDQUFDLHNCQUFzQixDQUFDLGtCQUFrQjtBQUM1QyxXQUFPLFNBQVMsS0FBSyxFQUFFLE9BQU8sd0JBQXdCLEdBQUcsRUFBRSxRQUFRLElBQUksQ0FBQztBQUFBLEVBQzFFO0FBRUEsTUFBSTtBQUNKLE1BQUk7QUFDRixXQUFPLE1BQU0sSUFBSSxLQUFLO0FBQUEsRUFDeEIsUUFBUTtBQUNOLFdBQU8sU0FBUyxLQUFLLEVBQUUsT0FBTyxlQUFlLEdBQUcsRUFBRSxRQUFRLElBQUksQ0FBQztBQUFBLEVBQ2pFO0FBRUEsUUFBTSxFQUFFLE1BQU0sVUFBVSxTQUFTLE1BQU0sSUFBSTtBQUUzQyxNQUFJO0FBQ0osTUFBSSxTQUFTLFNBQVM7QUFDcEIsUUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTO0FBQ3pCLGFBQU8sU0FBUyxLQUFLLEVBQUUsT0FBTyxpQkFBaUIsR0FBRyxFQUFFLFFBQVEsSUFBSSxDQUFDO0FBQUEsSUFDbkU7QUFDQSxXQUFPO0FBQUEsa0JBQXFELFFBQVE7QUFBQSxxQkFBaUIsT0FBTztBQUFBLEVBQzlGLFdBQVcsU0FBUyxhQUFhO0FBQy9CLFFBQUksQ0FBQyxPQUFPO0FBQ1YsYUFBTyxTQUFTLEtBQUssRUFBRSxPQUFPLGdCQUFnQixHQUFHLEVBQUUsUUFBUSxJQUFJLENBQUM7QUFBQSxJQUNsRTtBQUNBLFdBQU87QUFBQSxZQUFrRCxLQUFLO0FBQUEsRUFDaEUsT0FBTztBQUNMLFdBQU8sU0FBUyxLQUFLLEVBQUUsT0FBTyxlQUFlLEdBQUcsRUFBRSxRQUFRLElBQUksQ0FBQztBQUFBLEVBQ2pFO0FBRUEsTUFBSTtBQUNGLFVBQU0sTUFBTSxNQUFNLE1BQU0sK0JBQStCLGtCQUFrQixnQkFBZ0I7QUFBQSxNQUN2RixRQUFRO0FBQUEsTUFDUixTQUFTLEVBQUUsZ0JBQWdCLG1CQUFtQjtBQUFBLE1BQzlDLE1BQU0sS0FBSyxVQUFVLEVBQUUsU0FBUyxrQkFBa0IsS0FBSyxDQUFDO0FBQUEsSUFDMUQsQ0FBQztBQUNELFFBQUksQ0FBQyxJQUFJLEdBQUksT0FBTSxJQUFJLE1BQU0saUJBQWlCO0FBQzlDLFdBQU8sU0FBUyxLQUFLLEVBQUUsSUFBSSxLQUFLLENBQUM7QUFBQSxFQUNuQyxTQUFTLEtBQUs7QUFDWixXQUFPLFNBQVMsS0FBSyxFQUFFLE9BQU8sdUJBQXVCLEdBQUcsRUFBRSxRQUFRLElBQUksQ0FBQztBQUFBLEVBQ3pFO0FBQ0Y7QUFFTyxJQUFNLFNBQVM7QUFBQSxFQUNwQixNQUFNO0FBQUEsRUFDTixRQUFRO0FBQ1Y7IiwKICAibmFtZXMiOiBbXQp9Cg==
