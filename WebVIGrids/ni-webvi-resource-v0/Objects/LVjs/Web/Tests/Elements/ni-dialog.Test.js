//******************************************
// Tests for ni-dialog elements
// National Instruments Copyright 2018
//******************************************
import { HTMLNIDialog } from '../../Elements/ni-dialog.js';
describe('The ni-dialog elements', function () {
    'use strict';
    const sleep = function () {
        return new Promise(function (resolve) {
            setTimeout(resolve, 0);
        });
    };
    const waitForElement = async function (selector) {
        let element = document.querySelector(selector);
        while (!(element instanceof HTMLElement)) {
            await sleep();
            element = document.querySelector(selector);
        }
        return element;
    };
    const clickElement = function (element) {
        element.dispatchEvent(new CustomEvent('click'));
    };
    // TODO should be removed after we migrate to jasmine >= 2.7 and the `it` blocks support async functions natively
    const makeAsync = function (done, fn) {
        fn().then(() => done()).catch((ex) => done.fail(ex));
    };
    const domVerifier = testHelpers.createDomVerifier(this.description);
    beforeAll(function () {
        domVerifier.captureDomState();
    });
    afterAll(function () {
        domVerifier.verifyDomState();
    });
    describe('global objects', function () {
        it('exist', function () {
            expect(HTMLNIDialog).toBeDefined();
            expect(HTMLNIDialog.createOneButtonDialog).toBeDefined();
            expect(HTMLNIDialog.createTwoButtonDialog).toBeDefined();
            expect(HTMLNIDialog.createThreeButtonDialog).toBeDefined();
        });
    });
    describe('for one button dialogs', function () {
        it('can be created and click the button to close', function (done) {
            makeAsync(done, async function () {
                const dialogClose = HTMLNIDialog.createOneButtonDialog('Hello World', 'My Button');
                const button = await waitForElement('.ni-button-one');
                clickElement(button);
                const result = await dialogClose;
                expect(result).toBe(HTMLNIDialog.BUTTON_ONE_ACTION);
            });
        });
    });
    describe('for two button dialogs', function () {
        it('can be created and click button one to close', function (done) {
            makeAsync(done, async function () {
                const dialogClose = HTMLNIDialog.createTwoButtonDialog('Hello World', 'My Button One', 'My Other Button Two');
                const button = await waitForElement('.ni-button-one');
                clickElement(button);
                const result = await dialogClose;
                expect(result).toBe(HTMLNIDialog.BUTTON_ONE_ACTION);
            });
        });
        it('can be created and click button two to close', function (done) {
            makeAsync(done, async function () {
                const dialogClose = HTMLNIDialog.createTwoButtonDialog('Hello World', 'My Button', 'My Other Button Two');
                const button = await waitForElement('.ni-button-two');
                clickElement(button);
                const result = await dialogClose;
                expect(result).toBe(HTMLNIDialog.BUTTON_TWO_ACTION);
            });
        });
    });
    describe('for dialogs queued in different orders', function () {
        it('can open one button dialogs in order', function (done) {
            makeAsync(done, async function () {
                const dialogCloseOne = HTMLNIDialog.createOneButtonDialog('Hello World One', 'My Button One');
                const dialogCloseTwo = HTMLNIDialog.createOneButtonDialog('Hello World Two', 'My Button Two');
                const dialogCloseThree = HTMLNIDialog.createOneButtonDialog('Hello World Three', 'My Button Three');
                let button = await waitForElement('.ni-button-one');
                expect(button.textContent).toBe('My Button One');
                clickElement(button);
                await dialogCloseOne;
                button = await waitForElement('.ni-button-one');
                expect(button.textContent).toBe('My Button Two');
                clickElement(button);
                await dialogCloseTwo;
                button = await waitForElement('.ni-button-one');
                expect(button.textContent).toBe('My Button Three');
                clickElement(button);
                await dialogCloseThree;
            });
        });
        it('can open two button dialogs in order', function (done) {
            makeAsync(done, async function () {
                const dialogCloseOne = HTMLNIDialog.createTwoButtonDialog('Hello World One', 'My Two Button One', 'That other button');
                const dialogCloseTwo = HTMLNIDialog.createTwoButtonDialog('Hello World Two', 'My Two Button Two', 'That other button');
                const dialogCloseThree = HTMLNIDialog.createTwoButtonDialog('Hello World Three', 'My Two Button Three', 'That other button');
                let button = await waitForElement('.ni-button-one');
                expect(button.textContent).toBe('My Two Button One');
                clickElement(button);
                await dialogCloseOne;
                button = await waitForElement('.ni-button-one');
                expect(button.textContent).toBe('My Two Button Two');
                clickElement(button);
                await dialogCloseTwo;
                button = await waitForElement('.ni-button-one');
                expect(button.textContent).toBe('My Two Button Three');
                clickElement(button);
                await dialogCloseThree;
            });
        });
        it('can open a mix of dialogs in order', function (done) {
            makeAsync(done, async function () {
                const dialogCloseOne = HTMLNIDialog.createOneButtonDialog('Hello World A One Button', 'My Button A One');
                const dialogCloseTwo = HTMLNIDialog.createTwoButtonDialog('Hello World B Two Button', 'My Button B One', 'My Button B Two');
                const dialogCloseThree = HTMLNIDialog.createOneButtonDialog('Hello World C One Button', 'My Button C One');
                const dialogCloseFour = HTMLNIDialog.createTwoButtonDialog('Hello World D Two Button', 'My Button D One', 'My Button D Two');
                let button = await waitForElement('.ni-button-one');
                expect(button.textContent).toBe('My Button A One');
                clickElement(button);
                await dialogCloseOne;
                button = await waitForElement('.ni-button-one');
                expect(button.textContent).toBe('My Button B One');
                clickElement(button);
                await dialogCloseTwo;
                button = await waitForElement('.ni-button-one');
                expect(button.textContent).toBe('My Button C One');
                clickElement(button);
                await dialogCloseThree;
                button = await waitForElement('.ni-button-one');
                expect(button.textContent).toBe('My Button D One');
                clickElement(button);
                await dialogCloseFour;
            });
        });
    });
    describe('can be observed by a running vireo instance (#FailsCSP)', function () {
        const createDataURI = function (mime, text) {
            return `data:${mime},${encodeURI(text)}`;
        };
        const createWebAppLocalExecutionTestHelper = function (testConfig) {
            const executionTestHelper = testHelpers.createWebAppLocalExecutionTestHelper();
            return new Promise(function (resolve) {
                executionTestHelper.setupAndWaitForStop(testConfig, resolve, () => { });
            });
        };
        it('for one button dialog', function (done) {
            makeAsync(done, async function () {
                const viName = 'MyVI';
                const via = `
                define(MyVI dv(VirtualInstrument (
                    Locals: c(
                        e(c(
                            e(.Boolean status)
                            e(.Int32 code)
                            e(.String source)
                        ) error)
                        e(.Occurrence occurrence)
                        e(.Boolean result)
                        e(dv(.String 'My Message') message)
                        e(dv(.String 'Button One') buttonOne)
                    )
                    clump (
                        JavaScriptInvoke(occurrence true error 'OneButtonDialog' result message buttonOne)
                    )
                ) ) )
                enqueue(MyVI)`;
                const fixture = `<ni-front-panel ni-control-id="1"><style ni-autogenerated-style-id=""></style></ni-front-panel>`;
                const testConfig = {
                    viName: viName,
                    viaCodePath: createDataURI('text/plain', via),
                    htmlFixturePath: createDataURI('text/html', fixture)
                };
                const cleanup = createWebAppLocalExecutionTestHelper(testConfig);
                const button = await waitForElement('.ni-button-one');
                expect(button.textContent).toBe('Button One');
                clickElement(button);
                await cleanup;
            });
        });
        it('for two button dialog', function (done) {
            makeAsync(done, async function () {
                const viName = 'MyVI';
                const via = `
                define(MyVI dv(VirtualInstrument (
                    Locals: c(
                        e(c(
                            e(.Boolean status)
                            e(.Int32 code)
                            e(.String source)
                        ) error)
                        e(.Occurrence occurrence)
                        e(.Boolean result)
                        e(dv(.String 'My Message') message)
                        e(dv(.String 'Button One') buttonOne)
                        e(dv(.String 'Button Two') buttonTwo)
                    )
                    clump (
                        JavaScriptInvoke(occurrence true error 'TwoButtonDialog' result message buttonOne buttonTwo)
                    )
                ) ) )
                enqueue(MyVI)`;
                const fixture = `<ni-front-panel ni-control-id="1"><style ni-autogenerated-style-id=""></style></ni-front-panel>`;
                const testConfig = {
                    viName: viName,
                    viaCodePath: createDataURI('text/plain', via),
                    htmlFixturePath: createDataURI('text/html', fixture)
                };
                const cleanup = createWebAppLocalExecutionTestHelper(testConfig);
                const button = await waitForElement('.ni-button-two');
                expect(button.textContent).toBe('Button Two');
                clickElement(button);
                await cleanup;
            });
        });
    });
});
//# sourceMappingURL=ni-dialog.Test.js.map