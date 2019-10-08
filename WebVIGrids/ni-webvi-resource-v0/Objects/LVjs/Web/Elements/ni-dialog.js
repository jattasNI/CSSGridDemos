//****************************************
// ni-dialog element
// DOM Registration: HTMLNIDialog
// National Instruments Copyright 2018
//****************************************
const waitForClose = function (dialogElement) {
    return new Promise(function (resolve) {
        const handler = function (evt) {
            dialogElement.removeEventListener('ni-dialog-close', handler);
            resolve(evt.detail.userAction);
        };
        dialogElement.addEventListener('ni-dialog-close', handler);
    });
};
let lastDialog = Promise.resolve();
const enqueueDialog = function (dialogElement) {
    lastDialog = lastDialog.then(async function () {
        const dialogResult = waitForClose(dialogElement);
        // Append as direct child of body due to limitations of the polyfill: https://github.com/GoogleChrome/dialog-polyfill#limitations
        document.body.appendChild(dialogElement);
        dialogElement.showModal();
        const userAction = await dialogResult;
        document.body.removeChild(dialogElement);
        return userAction;
    });
    return lastDialog;
};
export class HTMLNIDialog extends JQX.BaseElement {
    /**
     * Helper function for making One Button Dialogs.
     * The corresponding helper functions createOneButtonDialog, createTwoButtonDialog, and createThreeButtonDialog
     * will enqueue dialogs into the same queue to have dialogs pop-up in sequential order of creation.
     * @param messageText - The text of the body of the popup
     * @param textOne - The button text of the one button dialog. Has default focus.
     */
    static async createOneButtonDialog(messageText, textOne) {
        const el = document.createElement('ni-dialog');
        el.dialogType = 'one-button';
        el.messageText = messageText;
        el.textOne = textOne;
        return await enqueueDialog(el);
    }
    /**
     * Helper function for making Two Button Dialogs.
     * The corresponding helper functions createOneButtonDialog, createTwoButtonDialog, and createThreeButtonDialog
     * will enqueue dialogs into the same queue to have dialogs pop-up in sequential order of creation.
     * @param messageText - The text of the body of the popup
     * @param textOne - The left button text of two button dialog. Has default focus.
     * @param textTwo - The right button text of two button dialog.
     */
    static async createTwoButtonDialog(messageText, textOne, textTwo) {
        const el = document.createElement('ni-dialog');
        el.dialogType = 'two-button';
        el.messageText = messageText;
        el.textOne = textOne;
        el.textTwo = textTwo;
        return await enqueueDialog(el);
    }
    static async createThreeButtonDialog(messageText, windowTitle, messageTextJustification, textOne, textTwo, textThree, keyboardShortcuts, allowsClose) {
        const el = document.createElement('ni-dialog');
        el.dialogType = 'three-button';
        el.messageText = messageText;
        el.windowTitle = windowTitle;
        el.textOne = textOne;
        el.textTwo = textTwo;
        el.textThree = textThree;
        el.preventClose = !allowsClose;
        return await enqueueDialog(el);
    }
    static get BUTTON_ONE_ACTION() {
        return 'BUTTON_ONE_ACTION';
    }
    static get BUTTON_TWO_ACTION() {
        return 'BUTTON_TWO_ACTION';
    }
    static get BUTTON_THREE_ACTION() {
        return 'BUTTON_THREE_ACTION';
    }
    static get CLOSE_ACTION() {
        return 'CLOSE_ACTION';
    }
    static get properties() {
        return {
            dialogType: {
                type: 'string',
                allowedValues: ['one-button', 'two-button', 'three-button'],
                value: 'one-button',
                defaultReflectToAttribute: true
            },
            textOne: {
                type: 'string',
                value: 'Button 1',
                defaultReflectToAttribute: true
            },
            textTwo: {
                type: 'string',
                value: 'Button 2',
                defaultReflectToAttribute: true
            },
            textThree: {
                type: 'string',
                value: 'Button 3',
                defaultReflectToAttribute: true
            },
            windowTitle: {
                type: 'string',
                value: '',
                defaultReflectToAttribute: true
            },
            messageText: {
                type: 'string',
                value: '',
                defaultReflectToAttribute: true
            },
            preventClose: {
                type: 'boolean',
                value: false,
                defaultReflectToAttribute: true
            }
        };
    }
    // This element with ni-unused-jqx-container was added to catch and ignore styles applied to the first root element in all jqx-elements via the .jqx-container class.
    template() {
        return `<div class="ni-unused-jqx-container"></div>
                <dialog (close)="clickButtonClose">
                    <div class="ni-container">
                    <header>
                        <span class="ni-window-title">[[windowTitle]]</span>
                        <button class="ni-close" disabled tabindex="-1" (click)="clickButtonClose"></button>
                    </header>
                    <main>[[messageText]]</main>
                    <footer>
                        <button class="ni-button-one" (click)="clickButtonOne">[[textOne]]</button>
                        <button class="ni-button-two" (click)="clickButtonTwo">[[textTwo]]</button>
                        <button class="ni-button-three" (click)="clickButtonThree">[[textThree]]</button>
                    </footer>
                    </div>
                </dialog>`;
    }
    clickButtonOne() {
        this.$.fireEvent('ni-dialog-close', {
            userAction: HTMLNIDialog.BUTTON_ONE_ACTION
        });
    }
    clickButtonTwo() {
        this.$.fireEvent('ni-dialog-close', {
            userAction: HTMLNIDialog.BUTTON_TWO_ACTION
        });
    }
    clickButtonThree() {
        this.$.fireEvent('ni-dialog-close', {
            userAction: HTMLNIDialog.BUTTON_THREE_ACTION
        });
    }
    clickButtonClose() {
        if (this.preventClose === false) {
            this.$.fireEvent('ni-dialog-close', {
                userAction: HTMLNIDialog.CLOSE_ACTION
            });
        }
    }
    showModal() {
        const dialog = this.querySelector('dialog');
        window.dialogPolyfill.registerDialog(dialog);
        dialog.showModal();
        // Workaround for bug in Chrome for showModal where default focus is wrong
        // https://github.com/whatwg/html/issues/1929
        this.querySelector('.ni-close').disabled = false;
    }
}
window.JQX('ni-dialog', HTMLNIDialog);
//# sourceMappingURL=ni-dialog.js.map