// Global type declarations

declare global {
	interface Window {
		$?: typeof import('jquery');
		runExample?: (name: string) => void;
		keypress?: {
			simple_combo: (keys: string, callback: () => void) => void;
		};
		lastError?: unknown;
		lastErrorInstance?: unknown;
		ChronotopeTimeLine?: unknown;
		exceptionReason?: unknown;
		Chronotope?: unknown;
		errorInstanceChain?: unknown;
		exceptionConstructors?: Record<string, unknown>;
	}
}

export {};
