// test-data/userDataProvider.js
module.exports = [
  { username: 'standard_user', password: 'secret_sauce', expectedResult: 'success' },
  { username: 'locked_out_user', password: 'secret_sauce', expectedResult: 'locked' },
  { username: 'problem_user', password: 'secret_sauce', expectedResult: 'success_with_issues' },
  { username: 'performance_glitch_user', password: 'secret_sauce', expectedResult: 'slow_success' },
  { username: 'error_user', password: 'secret_sauce', expectedResult: 'unexpected_errors' },
  { username: 'visual_user', password: 'secret_sauce', expectedResult: 'ui_issues' }
];
