import "./style.css";

const loader = document.getElementById("loader") as HTMLDivElement;
const inp = document.getElementById("input") as HTMLInputElement;
const btn = document.getElementById("sendButton") as HTMLButtonElement;
const botMessageTemplate = document.getElementById(
  "chat-bot-message"
) as HTMLTemplateElement;
const userMessageTemplate = document.getElementById(
  "chat-user-message"
) as HTMLTemplateElement;

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === "Enter" && btn.disabled === false) {
    sendMessage((e.target as HTMLInputElement).value);
  }
}
inp.addEventListener("input", e => {
  const target = e.target as HTMLInputElement;
  const hasValue = target.value.trim();
  if (btn) {
    btn.disabled = !hasValue;
  }
});
inp.addEventListener("keydown", handleKeyDown);
btn.addEventListener("click", () => sendMessage(inp.value));

let firstMessage = true;

async function sendMessage(message: string) {
  loader.insertAdjacentElement("beforebegin", createMessage("me", message));
  inp.value = "";
  btn.disabled = true;
  setLoader(true);
  await delay(500);
  setLoader(false);
  inp.focus();
  if (firstMessage) {
    loader.insertAdjacentElement(
      "beforebegin",
      createMessage(
        "bot",
        `Nice to meet you, ${message}! How can I assist you today?`
      )
    );
    firstMessage = false;
  } else {
    loader.insertAdjacentElement(
      "beforebegin",
      createMessage(
        "bot",
        `You said: "${message}". Oops sorry I can't assist with that right now. Maybe in the future?`
      )
    );
  }
  inp.scrollIntoView({ behavior: "smooth", block: "end" });
}

function setLoader(isLoading: boolean) {
  if (isLoading) {
    loader.dataset.loading = "";
  } else {
    delete loader.dataset.loading;
  }
}

function createMessage(from: "me" | "bot", message: string) {
  const template = from === "me" ? userMessageTemplate : botMessageTemplate;
  const el = (template.content.cloneNode(true) as DocumentFragment)
    .firstElementChild as HTMLDivElement;
  const m = el.querySelector(".chat-bubble");
  if (m) {
    m.textContent = message;
  }
  return el;
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  await delay(2000);
  setLoader(false);
  loader.insertAdjacentElement(
    "beforebegin",
    createMessage(
      "bot",
      "Hello! What's your name? I'd like to greet you properly."
    )
  );
  inp.focus();
})();
