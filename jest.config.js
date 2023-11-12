// https://jestjs.io/docs/webpack#handling-static-assets
module.exports = {
    moduleNameMapper: {
      '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
        '<rootDir>/__mocks__/fileMock.js',
      '\\.(css|less)$': '<rootDir>/__mocks__/styleMock.js',
    },
    // https://stackoverflow.com/a/67845294/14862313
    testEnvironment: 'jsdom',
  };