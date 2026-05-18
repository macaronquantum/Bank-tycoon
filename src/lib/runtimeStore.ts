type ChatMessage = { user: string; text: string; at: string };
type GameSession = { id: string; name: string; isDefault: boolean; status: 'open' | 'closed' };

const globalStore = globalThis as unknown as {
  _chat?: ChatMessage[];
  _sessions?: GameSession[];
};

if (!globalStore._chat) {
  globalStore._chat = [
    { user: 'System', text: 'Bienvenue sur Capital Tycoon 👋', at: new Date().toISOString() },
  ];
}

if (!globalStore._sessions) {
  globalStore._sessions = [
    { id: 'default-global-season', name: 'Global Season', isDefault: true, status: 'open' },
  ];
}

export const runtimeStore = {
  get chat() { return globalStore._chat!; },
  get sessions() { return globalStore._sessions!; },
};
