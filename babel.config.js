export default function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@': './Pet-Finder', // Adjust if your app folder is named differently
          },
        },
      ],
    ],
  };
}
