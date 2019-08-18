const { coverageGenerator } = require('../src/coverageGenerator');

describe('Report Utils', function () {
    it('Coverage Generator shoould return proper data structure', function () {
        expect(coverageGenerator([], 'html')).toStrictEqual({});
    });
})