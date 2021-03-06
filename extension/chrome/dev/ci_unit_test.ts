/* ©️ 2016 - present FlowCrypt a.s. Limitations apply. Contact human@flowcrypt.com */

'use strict';

import { Buf } from '../../js/common/core/buf.js';
import { KeyUtil } from '../../js/common/core/crypto/key.js';
import { AttUI } from '../../js/common/ui/att-ui.js';
import { ApiErr } from '../../js/common/api/shared/api-error.js';
import { WellKnownHostMeta } from '../../js/common/api/account-servers/well-known-host-meta.js';
import { Mime } from '../../js/common/core/mime.js';
import { Att } from '../../js/common/core/att.js';
import { Wkd } from '../../js/common/api/key-server/wkd.js';
import { MsgUtil } from '../../js/common/core/crypto/pgp/msg-util.js';
import { Sks } from '../../js/common/api/key-server/sks.js';
import { Ui } from '../../js/common/browser/ui.js';

/**
 * importing all libs that are tested in ci tests
 * add lib name below, let the IDE resolve the actual import
 */
const libs: any[] = [
  WellKnownHostMeta,
  ApiErr,
  Att,
  AttUI,
  Buf,
  KeyUtil,
  Mime,
  Wkd,
  Sks,
  MsgUtil,
  Ui
];

// add them to global scope so ci can use them
for (const lib of libs) {
  (window as any)[(lib as any).name] = lib;
}
