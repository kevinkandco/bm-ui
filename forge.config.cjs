const { FusesPlugin } = require("@electron-forge/plugin-fuses");
const { FuseV1Options, FuseVersion } = require("@electron/fuses");

module.exports = {
  packagerConfig: {
    asar: true,
  },
  rebuildConfig: {},
  makers: [
    // {
    //   name: "@electron-forge/maker-deb",
    //   config: {
    //     options: {
    //       name: "Brief Me",
    //       // maintainer: "Octal infotech",
    //       // homepage: "https://octalinfotech.com",
    //       name: "Brief Me",
    //       title: "Brief Me Installer",
    //       description: "Smart summaries. Focused updates. Less noise.",
    //       icon: "public/assets/icon.png",
    //     },
    //   },
    // },
    // {
    //   name: "@electron-forge/maker-squirrel",
    //   config: {},
    // },
    {
      name: "@electron-forge/maker-dmg",
      config: {
        name: "Brief Me",
        title: "Brief Me Installer",
        description: "Smart summaries. Focused updates. Less noise.",
        icon: "public/assets/mac-logo.icns",
        // background:
        //   "public/lovable-uploads/10c02016-8844-4312-a961-c0bfeb309800.png", // optional: background image for the DMG
        overwrite: true,
      },
    },
    // {
    //   name: "@electron-forge/maker-zip",
    //   platforms: ["darwin"],
    // },
    // {
    //   name: "@electron-forge/maker-deb",
    //   config: {},
    // },
    // {
    //   name: "@electron-forge/maker-rpm",
    //   config: {},
    // },
  ],
  plugins: [
    {
      name: "@electron-forge/plugin-auto-unpack-natives",
      config: {},
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
