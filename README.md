# Eki

## Development

- Node.js 23
- Pnpm

### Android SDK

Please download Android SDK from [Android Developers](https://developer.android.com/studio#command-tools) and place it in `~/Android/sdk`.

Execute the following command to install the required packages:

```bash
./Android/sdk/cmdline-tools/latest/bin/sdkmanager "platform-tools"
```

Then, add set `ANDROID_HOME` to `~/Android/sdk` in your `.bashrc` or `.zshrc`, and add `platform-tools` to your `PATH`.

### Dependencies

```bash
pnpm install
```

### WSL

Please refer to [Running a local Expo development environment in Windows Subsystem for Linux (WSL)](https://github.com/expo/fyi/blob/main/wsl.md) for setting up WSL.

### Android Emulator

```bash
pnpm android
```
