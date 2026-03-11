import zxcvbn from 'zxcvbn';

type InitMessage = {
  type: 'init';
  requestId: number;
  baseUserInputs: string[];
  polishWordlistText?: string;
};

type CheckMessage = {
  type: 'check';
  requestId: number;
  password: string;
};

type IncomingMessage = InitMessage | CheckMessage;

type ReadyResponse = {
  type: 'ready';
  requestId: number;
  userInputsSize: number;
  warning?: string;
};

type ResultResponse = {
  type: 'result';
  requestId: number;
  payload: {
    score: number;
    guesses?: number;
    crack_times_seconds?: {
      offline_slow_hashing_1e4_per_second?: number;
    };
    feedback: {
      warning: string;
      suggestions: string[];
    };
  };
};

type ErrorResponse = {
  type: 'error';
  requestId: number;
  message: string;
};

const ctx = self as unknown as DedicatedWorkerGlobalScope;

const stripDiacritics = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const POLISH_FREQ_50K_URL =
  'https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2016/pl/pl_50k.txt';

let userInputs: string[] | null = null;
let initInFlight: Promise<{ userInputsSize: number; warning?: string }> | null = null;

const ensureInitialized = (baseUserInputs: string[]) => {
  if (userInputs) return Promise.resolve({ userInputsSize: userInputs.length });
  if (initInFlight) return initInFlight;

  initInFlight = (async () => {
    const set = new Set<string>();

    const addToken = (token: string) => {
      const lower = token.trim().toLowerCase();
      if (!lower) return;
      if (lower.length < 4) return;
      const stripped = stripDiacritics(lower);
      set.add(lower);
      set.add(stripped);
    };

    baseUserInputs.forEach(addToken);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10_000);
    let warning: string | undefined;

    try {
      const res = await fetch(POLISH_FREQ_50K_URL, { signal: controller.signal });
      if (!res.ok) {
        warning = `Nie udało się pobrać słownika (HTTP ${res.status})`;
      } else {
        const text = await res.text();
        const lines = text.split('\n');
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          const word = line.split(/\s+/)[0] || '';
          addToken(word.replace('\r', ''));
        }
      }
    } catch {
      warning = 'Nie udało się pobrać słownika (offline / blokada / timeout)';
    } finally {
      clearTimeout(timeoutId);
    }

    userInputs = Array.from(set);
    return { userInputsSize: userInputs.length, warning };
  })();

  return initInFlight;
};

const ensureInitializedWithText = (baseUserInputs: string[], polishWordlistText?: string) => {
  if (userInputs) return Promise.resolve({ userInputsSize: userInputs.length });
  if (initInFlight) return initInFlight;

  initInFlight = (async () => {
    const set = new Set<string>();

    const addToken = (token: string) => {
      const lower = token.trim().toLowerCase();
      if (!lower) return;
      if (lower.length < 4) return;
      const stripped = stripDiacritics(lower);
      set.add(lower);
      set.add(stripped);
    };

    baseUserInputs.forEach(addToken);

    let warning: string | undefined;

    if (typeof polishWordlistText === 'string' && polishWordlistText.length > 0) {
      const lines = polishWordlistText.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const word = line.split(/\s+/)[0] || '';
        addToken(word.replace('\r', ''));
      }
    } else {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10_000);
      try {
        const res = await fetch(POLISH_FREQ_50K_URL, { signal: controller.signal });
        if (!res.ok) {
          warning = `Nie udało się pobrać słownika (HTTP ${res.status})`;
        } else {
          const text = await res.text();
          const lines = text.split('\n');
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const word = line.split(/\s+/)[0] || '';
            addToken(word.replace('\r', ''));
          }
        }
      } catch {
        warning = 'Nie udało się pobrać słownika (offline / blokada / timeout)';
      } finally {
        clearTimeout(timeoutId);
      }
    }

    userInputs = Array.from(set);
    return { userInputsSize: userInputs.length, warning };
  })();

  return initInFlight;
};

ctx.onmessage = async (event: MessageEvent<IncomingMessage>) => {
  const msg = event.data;

  if (msg.type === 'init') {
    const { userInputsSize, warning } = await ensureInitializedWithText(msg.baseUserInputs, msg.polishWordlistText);
    const response: ReadyResponse = { type: 'ready', requestId: msg.requestId, userInputsSize, warning };
    ctx.postMessage(response);
    return;
  }

  if (msg.type === 'check') {
    if (!userInputs) {
      const response: ErrorResponse = {
        type: 'error',
        requestId: msg.requestId,
        message: 'Worker nie został zainicjalizowany',
      };
      ctx.postMessage(response);
      return;
    }

    try {
      const result = zxcvbn(msg.password, userInputs);
      const payload: ResultResponse['payload'] = {
        score: (result as any)?.score ?? 0,
        guesses: (result as any)?.guesses,
        crack_times_seconds: (result as any)?.crack_times_seconds
          ? {
              offline_slow_hashing_1e4_per_second: (result as any)?.crack_times_seconds
                ?.offline_slow_hashing_1e4_per_second,
            }
          : undefined,
        feedback: {
          warning: (result as any)?.feedback?.warning ?? '',
          suggestions: Array.isArray((result as any)?.feedback?.suggestions)
            ? (result as any).feedback.suggestions
            : [],
        },
      };

      const response: ResultResponse = { type: 'result', requestId: msg.requestId, payload };
      ctx.postMessage(response);
    } catch {
      const response: ErrorResponse = { type: 'error', requestId: msg.requestId, message: 'Błąd podczas analizy hasła' };
      ctx.postMessage(response);
    }
  }
};

export {};
