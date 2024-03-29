
Usage:
1. Install dependancies via `npm install`
2. Run `npm run build:release`
3. Run `npm start -- --package {PACKAGE_NAME}@{PACKAGE_VERSION} --repository {USER_NAME}/{REPOSITORY_NAME} --token {TOKEN}`
4. Replaces values in curly braces
5. Alternatively create `.env` file and define Bitbucket token there

Tests:
execute `npm run test` to run all tests