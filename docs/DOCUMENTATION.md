# Terminal Documentation

## Overview

Terminal is a modern, extensible command-line interface application designed for developers, system administrators, and power users. It provides an enhanced terminal experience with productivity features, customizable themes, plugin support, and advanced session management — all from a single, lightweight codebase.

---

## Key Capabilities

### Core Shell Features
- Full POSIX-compliant shell execution
- Multi-tab and split-pane session management
- Persistent command history with fuzzy search
- Inline syntax highlighting and autocompletion

### Developer Tools
- Integrated Git status and branch indicators
- Directory bookmarks and fast navigation
- Built-in file previews and directory trees
- Command timing and profiling output

### Customization
- Theme engine with light/dark mode support
- Font and color palette configuration
- Configurable keybindings
- Plugin system for extending core functionality

---

## Installation

### Prerequisites
- Node.js 18+ (for plugin tooling)
- A POSIX-compatible operating system (Linux, macOS) or WSL on Windows

### Install from Source

```bash
git clone https://github.com/alhameenoki1-prog/Terminal-.git
cd Terminal-
npm install
npm run build
```

### Run

```bash
npm start
```

---

## Configuration

Terminal is configured via a `~/.terminal/config.json` file generated on first launch.

### Example Configuration

```json
{
  "theme": "dark",
  "font": {
    "family": "JetBrains Mono",
    "size": 14
  },
  "shell": "/bin/bash",
  "history": {
    "maxEntries": 10000,
    "deduplicate": true
  },
  "plugins": []
}
```

### Configuration Options

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `theme` | string | `"dark"` | UI color theme (`"dark"` or `"light"`) |
| `font.family` | string | `"monospace"` | Terminal font family |
| `font.size` | number | `14` | Font size in pixels |
| `shell` | string | `"/bin/bash"` | Shell binary to use |
| `history.maxEntries` | number | `10000` | Maximum command history entries |
| `history.deduplicate` | boolean | `true` | Skip duplicate consecutive commands |
| `plugins` | array | `[]` | List of enabled plugin names |

---

## Usage

### Session Management

**Open a new tab:** `Ctrl+T`
**Split pane horizontally:** `Ctrl+Shift+H`
**Split pane vertically:** `Ctrl+Shift+V`
**Close tab/pane:** `Ctrl+W`
**Navigate tabs:** `Ctrl+Tab` / `Ctrl+Shift+Tab`

### Search & Navigation

**History search (fuzzy):** `Ctrl+R`
**Bookmark current directory:** `bookmark add <name>`
**Jump to bookmark:** `bookmark go <name>`
**List bookmarks:** `bookmark list`

### Built-in Commands

| Command | Description |
|---------|-------------|
| `bookmark add <name>` | Save current directory as a named bookmark |
| `bookmark go <name>` | Navigate to a saved bookmark |
| `bookmark list` | Display all saved bookmarks |
| `history search <query>` | Fuzzy search command history |
| `plugin install <name>` | Install a plugin from the registry |
| `plugin list` | List installed plugins |
| `theme set <name>` | Switch the active theme |

---

## Plugin System

Plugins extend Terminal functionality and are distributed as npm packages prefixed with `terminal-plugin-`.

### Installing a Plugin

```bash
plugin install git-status
```

### Writing a Plugin

Plugins export a single object conforming to the plugin interface:

```typescript
export default {
  name: "my-plugin",
  version: "1.0.0",
  commands: {
    hello: (args) => {
      console.log(`Hello, ${args[0] ?? "world"}!`);
    },
  },
  hooks: {
    onPromptRender: (context) => {
      // Modify the prompt before display
    },
  },
};
```

---

## Architecture

Terminal is built with a modular architecture separating concerns cleanly across layers:

```
Terminal-/
├── src/
│   ├── core/          # Shell process management, PTY layer
│   ├── ui/            # Renderer, theme engine, layout
│   ├── history/       # Command history storage and search
│   ├── plugins/       # Plugin loader and registry client
│   ├── config/        # Configuration parsing and validation
│   └── utils/         # Shared utilities
├── docs/              # Documentation
├── tests/             # Unit and integration tests
└── package.json
```

### Core Components

**PTY Layer (`src/core/`)**
Manages pseudo-terminal processes, shell spawning, and I/O multiplexing across tabs and panes.

**UI Renderer (`src/ui/`)**
Handles terminal cell rendering, cursor management, scroll buffer, and theme application. Uses a virtual scroll approach for large output buffers.

**History Engine (`src/history/`)**
Persists command history to disk, deduplicates entries, and exposes a fuzzy search index backed by a trie structure for fast lookups.

**Plugin Loader (`src/plugins/`)**
Dynamically loads installed plugins, validates their interfaces, and wires their commands and hooks into the runtime.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Language | TypeScript |
| Build tool | Vite |
| Shell integration | node-pty |
| UI rendering | Custom canvas renderer |
| Configuration | JSON with JSON Schema validation |
| Testing | Vitest |

---

## Performance

- Virtual scroll buffer — only visible rows are rendered, keeping memory usage flat regardless of output size
- Incremental history indexing — new entries are appended without re-indexing the full history
- Plugin sandbox — plugins run in isolated contexts to prevent interference with core performance
- Lazy theme loading — theme assets are loaded on demand, not at startup

---

## Security

**Input Sanitization**
All user-supplied input is sanitized before being passed to shell processes to prevent command injection through UI components.

**Plugin Isolation**
Plugins are loaded in sandboxed environments with limited access to system APIs. Permissions must be declared in the plugin manifest and approved by the user on install.

**Config Validation**
The configuration file is validated against a JSON Schema on startup. Invalid or unexpected fields are rejected with descriptive errors rather than silently ignored.

---

## Contributing

Contributions are welcome. Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes with tests
4. Run the test suite: `npm test`
5. Submit a pull request with a clear description of the change

### Code Style

- TypeScript strict mode is enforced
- All public APIs must have JSDoc comments
- Tests are required for new commands and plugins

---

## License

MIT License. See [LICENSE](../LICENSE) for details.
