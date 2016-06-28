'use strict';

get_account_emails(function(account_emails) {
  if(account_emails && account_emails.length) {
    account_storage_get(account_emails, ['setup_done'], function(account_storages) {
      var functioning_accounts = 0;
      $.each(account_storages, function(email, storage) {
        functioning_accounts += storage.setup_done === true;
      });
      get_active_window_account_email(function(active_account_email, setup_done) {
        if(!functioning_accounts) {
          initial_setup(active_account_email);
        } else {
          standard_popup(active_account_email, setup_done);
        }
      });
    });
  } else {
    initial_setup();
  }
});

function initial_setup(account_email) {
  chrome_message_send(null, 'settings', {
    account_email: account_email
  }, function() {
    window.close();
  });
}

function get_active_window_account_email(callback) {
  var account_email = undefined;
  account_storage_get(null, ['current_window_account_email'], function(storage) {
    account_email = storage.current_window_account_email;
    account_storage_get(account_email, ['setup_done'], function(storage_2) {
      callback(account_email, storage_2.setup_done);
    });
  });
}

function standard_popup(active_account_email, setup_done) {
  if(typeof active_account_email === 'undefined' || setup_done === true) {
    $('#email_or_settings').css('display', 'block');
  } else {
    $('#set_up_account').css('display', 'block');
  }
  $('.action_open_settings').click(function() {
    if(typeof active_account_email !== 'undefined') {
      chrome_message_send(null, 'settings', {
        account_email: active_account_email
      }, function() {
        window.close();
      });
    } else {
      window.location = 'select_account.htm?action=settings';
    }
  });

  $('.action_send_email').click(function() {
    if(typeof active_account_email !== 'undefined') {
      window.location = '/chrome/gmail_elements/new_message.htm?placement=popup&account_email=' + encodeURIComponent(active_account_email);
    } else {
      window.location = 'select_account.htm?action=new_message';
    }
  });
}
