import { extend, override } from 'flarum/common/extend';
import app from 'flarum/forum/app';
import HeaderSecondary from 'flarum/forum/components/HeaderSecondary';
import SettingsPage from 'flarum/forum/components/SettingsPage';
import LoginModal from 'flarum/forum/components/LogInModal'
// @ts-ignore
import { NestedStringArray } from '@askvortsov/rich-icu-message-formatter';

/**
 * Returns a setting added by the extension
 */
function setting(slug: string, cast?: typeof Boolean | typeof Number): any | boolean | number {
  let setting = app.forum.attribute(`abdulrehman-sso.${slug}`);

  if (cast !== undefined) {
    if (cast === Boolean && !isNaN(setting as number)) {
      setting = Number(setting);
    }
    return cast(setting);
  }

  return setting;
}

/**
 * Returns login and signup props
 */
function getItems(): Record<string, { url: string; itemName: string; removeItem: boolean; text: string | NestedStringArray }> {
  return {
    login: {
      url: setting('login_url'),
      itemName: 'logIn',
      removeItem: setting('remove_login_btn', Boolean),
      text: app.translator.trans('core.forum.header.log_in_link'),
    },
    signup: {
      url: setting('signup_url'),
      itemName: 'signUp',
      removeItem: setting('remove_signup_btn', Boolean),
      text: app.translator.trans('core.forum.header.sign_up_link'),
    },
  };
}

app.initializers.add('abdulrehman-sso', () => {
  console.info('FORUM: App is initialized abdulrehman-sso!!!!!');
  // Lazily resolve LogInModal so it is available after all modules are registered
  // return
  const logInModalModule = LoginModal
  console.info("logInModalModule", logInModalModule)
  if (logInModalModule) {
    console.warn('abdulrehman-sso: LogInModalModule not found, skipping override.');
    if (!logInModalModule) {
      console.warn('abdulrehman-sso: logInModalModule not found, skipping override.');
    } else {
      override(logInModalModule.prototype, 'oncreate', () => {
        if (!setting('provider_mode', Boolean)) {
          const loginUrl = setting('login_url');
          if (loginUrl) {
            window.location.href = loginUrl;
          } else {
            app.alerts.show({ type: 'error' }, app.translator.trans('abdulrehman-sso.forum.no_login_url_error'));
          }

          throw new Error('Stop execution');
        }
      });
    } // end if LogInModal
  }

  extend(HeaderSecondary.prototype, 'items', (buttons) => {
    if (!setting('provider_mode', Boolean)) {
      const items = getItems();
      for (const [, props] of Object.entries(items)) {
        if (props.url) {
          if (props.removeItem) {
            buttons.remove(props.itemName);
          } else {
            // Remove login button
            if (!buttons.has(props.itemName)) {
              return;
            }
            buttons.setContent(
              props.itemName,
              <a href={props.url} className="Button Button--link">
                {props.text}
              </a>
            );
          }
        }
      }
    }
  });

  // extend(SettingsPage.prototype, 'accountItems', (items) => {
  //   if (setting('provider_mode', Boolean) || !setting('login_url')) {
  //     return; // Do not add account items if no login url is set.
  //   }

  //   // Remove change email and password buttons
  //   items.remove('changeEmail');
  //   items.remove('changePassword');

  //   if (!setting('manage_account_url', Boolean)) {
  //     return;
  //   }

  //   items.add(
  //     'manageAccount',
  //     <a class="Button" href={setting('manage_account_url')} target={setting('manage_account_btn_open_in_new_tab', Boolean) ? '_blank' : ''}>
  //       {app.translator.trans('abdulrehman-sso.forum.manage_account_btn')}
  //     </a>
  //   );
  // });

  // extend(SettingsPage.prototype, 'settingsItems', (items) => {
  //   if (setting('manage_account_url', Boolean) || setting('provider_mode', Boolean)) {
  //     return; // Manage account link is added above
  //   }

  //   // Remove account section
  //   if (items.has('account') && items.get('account').children.length === 0) {
  //     items.remove('account');
  //   }
  // });
});
