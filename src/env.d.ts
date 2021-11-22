interface ImportMetaEnv extends Readonly<Record<string, string>> {
  readonly MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
