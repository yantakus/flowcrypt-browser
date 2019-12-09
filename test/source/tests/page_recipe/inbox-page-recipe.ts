import { PageRecipe } from './abstract-page-recipe';
import { AvaContext } from '..';
import { TestUrls } from '../../browser/test_urls';
import { BrowserHandle } from '../../browser';
import { Util } from '../../util';

type CheckDecryptMsg$opt = { acctEmail: string, threadId: string, expectedContent: string, enterPp?: string, finishCurrentSession?: boolean };
type CheckSentMsg$opt = { acctEmail: string, subject: string, expectedContent?: string, isEncrypted?: boolean, isSigned?: boolean, sender?: string };

export class InboxPageRecipe extends PageRecipe {

  public static async checkDecryptMsg(t: AvaContext, browser: BrowserHandle, { acctEmail, threadId, enterPp, expectedContent, finishCurrentSession }: CheckDecryptMsg$opt) {
    const inboxPage = await browser.newPage(t, TestUrls.extension(`chrome/settings/inbox/inbox.htm?acctEmail=${acctEmail}&threadId=${threadId}`));
    await inboxPage.waitAll('iframe');
    if (finishCurrentSession) {
      await inboxPage.waitAndClick('@action-finish-session');
      await Util.sleep(3); // give frames time to reload, else we will be manipulating them while reloading -> Error: waitForFunction failed: frame got detached.
    }
    const pgpBlockFrame = await inboxPage.getFrame(['pgp_block.htm']);
    await pgpBlockFrame.waitAll('@pgp-block-content');
    await pgpBlockFrame.waitForSelTestState('ready');
    if (enterPp) {
      await inboxPage.notPresent("@action-finish-session");
      await pgpBlockFrame.waitAndClick('@action-show-passphrase-dialog', { delay: 1 });
      await inboxPage.waitAll('@dialog-passphrase');
      const ppFrame = await inboxPage.getFrame(['passphrase.htm']);
      await ppFrame.waitAndType('@input-pass-phrase', enterPp);
      await ppFrame.waitAndClick('@action-confirm-pass-phrase-entry', { delay: 1 });
      await pgpBlockFrame.waitForSelTestState('ready');
      await inboxPage.waitAll('@action-finish-session');
      await Util.sleep(1);
    }
    const content = await pgpBlockFrame.read('@pgp-block-content');
    if (content.indexOf(expectedContent) === -1) {
      throw new Error(`message did not decrypt`);
    }
    await inboxPage.close();
  }

  public static async checkFinishingSession(t: AvaContext, browser: BrowserHandle, acctEmail: string, threadId: string) {
    const inboxPage = await browser.newPage(t, TestUrls.extension(`chrome/settings/inbox/inbox.htm?acctEmail=${acctEmail}&threadId=${threadId}`));
    await inboxPage.waitAll('iframe');
    await inboxPage.waitAndClick('@action-finish-session');
    await inboxPage.waitTillGone('@action-finish-session');
    await Util.sleep(3); // give frames time to reload, else we will be manipulating them while reloading -> Error: waitForFunction failed: frame got detached.
    const pgpBlockFrame = await inboxPage.getFrame(['pgp_block.htm']);
    await pgpBlockFrame.waitAll('@pgp-block-content');
    await pgpBlockFrame.waitForSelTestState('ready');
    await pgpBlockFrame.waitAndClick('@action-show-passphrase-dialog', { delay: 1 });
    await inboxPage.waitAll('@dialog-passphrase');
  }

  public static async checkSentMsg(t: AvaContext, browser: BrowserHandle, { acctEmail, subject, expectedContent, isEncrypted, isSigned, sender }: CheckSentMsg$opt) {
    if (typeof isSigned !== 'undefined') {
      throw new Error('checkSentMsg.isSigned not implemented');
    }
    if (typeof expectedContent !== 'undefined') {
      throw new Error('checkSentMsg.expectedContent not implemented');
    }
    if (typeof isEncrypted !== 'undefined') {
      throw new Error('checkSentMsg.isEncrypted not implemented');
    }
    const inboxPage = await browser.newPage(t, TestUrls.extension(`chrome/settings/inbox/inbox.htm?acctEmail=${acctEmail}&labelId=SENT`));
    await inboxPage.waitAndClick(`@container-subject(${subject})`, { delay: 1 });
    if (sender) { // make sure it was sent from intended addr
      await inboxPage.waitAll(`@container-msg-header(${sender})`);
    }
    await inboxPage.close();
  }

}