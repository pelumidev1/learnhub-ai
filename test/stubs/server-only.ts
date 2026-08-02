// Stand-in for the `server-only` package under Vitest. The real one throws on
// import to stop server code reaching a client bundle; that guard is enforced
// by the Next build, not by the test runner, so replacing it here loses nothing.
export {};
