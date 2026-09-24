const MODULE_ID = "som-das-seis-rolls";
const SETTINGS = {
  supabaseUrl: "supabaseUrl",
  anonKey: "anonKey",
  adminEmail: "adminEmail",
  adminPassword: "adminPassword",
};

Hooks.once("init", () => {
  game.settings.register(MODULE_ID, SETTINGS.supabaseUrl, { name: "URL do Supabase", hint: "URL terminada em .supabase.co", scope: "world", config: true, type: String, default: "" });
  game.settings.register(MODULE_ID, SETTINGS.anonKey, { name: "Chave pública do Supabase", hint: "Publishable key ou anon public key", scope: "world", config: true, type: String, default: "" });
  game.settings.register(MODULE_ID, SETTINGS.adminEmail, { name: "E-mail administrativo", scope: "world", config: true, type: String, default: "" });
  game.settings.register(MODULE_ID, SETTINGS.adminPassword, { name: "Senha administrativa", hint: "Fica salva apenas nas configurações locais do mundo Foundry.", scope: "world", config: true, type: String, default: "" });
});

Hooks.once("ready", () => {
  if (!game.user.isGM) return;
  new SomDasSeisRollBridge().start();
});

class SomDasSeisRollBridge {
  constructor() {
    this.lastCreatedAt = new Date().toISOString();
    this.accessToken = null;
    this.timer = null;
  }

  setting(name) {
    return game.settings.get(MODULE_ID, name);
  }

  async start() {
    if (!this.setting(SETTINGS.supabaseUrl) || !this.setting(SETTINGS.anonKey) || !this.setting(SETTINGS.adminEmail) || !this.setting(SETTINGS.adminPassword)) {
      ui.notifications.warn("Som das Seis: configure o Supabase nas configurações do mundo.");
      return;
    }
    await this.poll();
    this.timer = window.setInterval(() => this.poll(), 3000);
  }

  async authenticate() {
    const baseUrl = this.setting(SETTINGS.supabaseUrl).replace(/\/$/, "");
    const response = await fetch(`${baseUrl}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: { apikey: this.setting(SETTINGS.anonKey), "Content-Type": "application/json" },
      body: JSON.stringify({ email: this.setting(SETTINGS.adminEmail), password: this.setting(SETTINGS.adminPassword) }),
    });
    if (!response.ok) throw new Error("Não foi possível autenticar no Supabase.");
    const data = await response.json();
    this.accessToken = data.access_token;
  }

  async poll() {
    try {
      if (!this.accessToken) await this.authenticate();
      const baseUrl = this.setting(SETTINGS.supabaseUrl).replace(/\/$/, "");
      const query = new URLSearchParams({ select: "*", created_at: `gt.${this.lastCreatedAt}`, order: "created_at.asc" });
      const response = await fetch(`${baseUrl}/rest/v1/roll_events?${query}`, { headers: { apikey: this.setting(SETTINGS.anonKey), Authorization: `Bearer ${this.accessToken}` } });
      if (response.status === 401) { this.accessToken = null; return; }
      if (!response.ok) throw new Error("Não foi possível consultar as rolagens.");
      const rolls = await response.json();
      for (const roll of rolls) {
        this.lastCreatedAt = roll.created_at;
        await ChatMessage.create({ speaker: { alias: "Som das Seis" }, content: `<strong>${escapeHtml(roll.character_name || "Personagem")}</strong> rolou <strong>${escapeHtml(roll.roll_name)}</strong>: <strong>${roll.die} + ${roll.score} = ${roll.total}</strong> <span>${roll.success ? "Sucesso" : "Falha"}</span>` });
      }
    } catch (error) {
      console.error(`${MODULE_ID} |`, error);
    }
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]));
}
